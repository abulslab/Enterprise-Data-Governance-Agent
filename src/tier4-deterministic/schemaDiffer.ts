import { 
  DatasetSchema, 
  BaselineDataContract, 
  SchemaDiffFinding,
  SchemaColumn 
} from '../types.js';

/**
 * Tier 4 Deterministic AST Schema Diff Engine
 * Compares candidate schema against registered baseline data contract.
 * Pinpoints breaking vs. non-breaking changes with 0 LLM tokens consumed.
 */
export class SchemaDiffer {
  public static diff(
    candidate: DatasetSchema,
    baseline?: BaselineDataContract
  ): SchemaDiffFinding[] {
    if (!baseline) {
      return []; // Initial registration, no baseline contract diff
    }

    const findings: SchemaDiffFinding[] = [];
    const baselineColMap = new Map<string, SchemaColumn>();
    for (const col of baseline.columns) {
      baselineColMap.set(col.name, col);
    }

    const candidateColMap = new Map<string, SchemaColumn>();
    for (const col of candidate.columns) {
      candidateColMap.set(col.name, col);
    }

    // 1. Detect Dropped Columns (Breaking change)
    for (const [colName, oldCol] of baselineColMap.entries()) {
      if (!candidateColMap.has(colName)) {
        const affected = baseline.registeredConsumers
          .filter(c => c.dependentFields.includes(colName))
          .map(c => c.serviceName);

        findings.push({
          fieldName: colName,
          mutationType: 'FIELD_REMOVED',
          isBreaking: true,
          oldDefinition: oldCol,
          impactDescription: `Column '${colName}' (${oldCol.type}) removed from production contract. Breaks ${affected.length} active downstream consumers.`,
          affectedConsumers: affected
        });
      }
    }

    // 2. Detect Type Changes and Nullability Violations
    for (const [colName, newCol] of candidateColMap.entries()) {
      const oldCol = baselineColMap.get(colName);
      if (!oldCol) continue; // New column handled below

      // Check Type Incompatibility
      if (oldCol.type !== newCol.type) {
        const isBreaking = !this.isCompatibleWidening(oldCol.type, newCol.type);
        const affected = baseline.registeredConsumers
          .filter(c => c.dependentFields.includes(colName))
          .map(c => c.serviceName);

        findings.push({
          fieldName: colName,
          mutationType: 'FIELD_TYPE_CHANGED',
          isBreaking,
          oldDefinition: oldCol,
          newDefinition: newCol,
          impactDescription: `Type mutated from '${oldCol.type}' to '${newCol.type}'. ${isBreaking ? 'Incompatible type narrowing.' : 'Compatible widening.'}`,
          affectedConsumers: affected
        });
      }

      // Check Nullability: was nullable in baseline, now candidate marks NOT nullable without default
      if (oldCol.nullable && !newCol.nullable) {
        const affected = baseline.registeredConsumers
          .filter(c => c.dependentFields.includes(colName))
          .map(c => c.serviceName);

        findings.push({
          fieldName: colName,
          mutationType: 'NULLABILITY_VIOLATED',
          isBreaking: true,
          oldDefinition: oldCol,
          newDefinition: newCol,
          impactDescription: `Nullability changed from nullable=true to nullable=false. Producers sending nulls will fail validation.`,
          affectedConsumers: affected
        });
      }
    }

    // 3. Detect Added Columns
    for (const [colName, newCol] of candidateColMap.entries()) {
      if (!baselineColMap.has(colName)) {
        if (!newCol.nullable) {
          findings.push({
            fieldName: colName,
            mutationType: 'FIELD_ADDED_REQUIRED',
            isBreaking: true,
            newDefinition: newCol,
            impactDescription: `New mandatory non-nullable column '${colName}' added. Existing data producers cannot fulfill this requirement without code changes.`,
            affectedConsumers: []
          });
        } else {
          findings.push({
            fieldName: colName,
            mutationType: 'FIELD_ADDED_OPTIONAL',
            isBreaking: false,
            newDefinition: newCol,
            impactDescription: `New optional column '${colName}' (${newCol.type}) added. Backward-compatible schema evolution.`,
            affectedConsumers: []
          });
        }
      }
    }

    return findings;
  }

  private static isCompatibleWidening(oldType: string, newType: string): boolean {
    // E.g. integer to decimal is permissible widening; string to integer is breaking narrowing
    if (oldType === 'integer' && newType === 'decimal') return true;
    if (oldType === 'date' && newType === 'timestamp') return true;
    return false;
  }
}
