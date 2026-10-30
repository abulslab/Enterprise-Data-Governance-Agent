import { 
  ClassificationTier, 
  SensitiveDataFinding, 
  DatasetSchema 
} from '../types.js';

export interface ClassificationResult {
  declaredTier: ClassificationTier;
  recommendedTier: ClassificationTier;
  isMisclassified: boolean;
  classificationReasoning: string;
  identifiedSensitivities: string[];
}

/**
 * Enterprise Data Classification Engine
 * Evaluates attributes against 4 enterprise security classifications:
 * PUBLIC, INTERNAL, CONFIDENTIAL, RESTRICTED.
 */
export class DataClassifier {
  public static classify(
    schema: DatasetSchema,
    findings: SensitiveDataFinding[]
  ): ClassificationResult {
    const declaredTier = schema.classificationTier || 'CONFIDENTIAL';
    const identifiedSensitivities: string[] = [];

    let hasDirectPii = false;
    let hasFinancial = false;
    let hasContactPii = false;

    for (const f of findings) {
      if (f.category === 'DIRECT_PII' && f.patternType === 'SSN') {
        hasDirectPii = true;
        identifiedSensitivities.push(`Direct PII (SSN in column '${f.fieldName}')`);
      } else if (f.category === 'FINANCIAL') {
        hasFinancial = true;
        identifiedSensitivities.push(`Financial Identifier (${f.patternType} in column '${f.fieldName}')`);
      } else if (f.patternType === 'EMAIL_ADDRESS' || f.patternType === 'PHONE_NUMBER') {
        hasContactPii = true;
        identifiedSensitivities.push(`Contact PII (${f.patternType} in column '${f.fieldName}')`);
      }
    }

    let recommendedTier: ClassificationTier = 'PUBLIC';
    let reasoning = '';

    if (hasDirectPii || hasFinancial) {
      recommendedTier = 'RESTRICTED';
      reasoning = `Dataset contains direct government or financial credentials (${identifiedSensitivities.join(', ')}). Under enterprise governance policy, raw credentials must be classified as RESTRICTED and stored exclusively in certified secure vaults.`;
    } else if (hasContactPii || schema.columns.some(c => /customer|user|account|email|phone|address/i.test(c.name))) {
      recommendedTier = 'CONFIDENTIAL';
      reasoning = `Dataset contains personal customer attributes requiring role-based access control (RBAC) and privacy protection. Classified as CONFIDENTIAL.`;
    } else if (schema.columns.some(c => /internal|employee|salary|cost|metric|debug/i.test(c.name))) {
      recommendedTier = 'INTERNAL';
      reasoning = `Dataset contains proprietary operational metrics and internal identifiers. Classified as INTERNAL for enterprise personnel use only.`;
    } else {
      recommendedTier = 'PUBLIC';
      reasoning = `Dataset consists of publicly shareable or de-identified reference attributes. Zero sensitive or regulated fields detected. Classified as PUBLIC.`;
    }

    // Determine if candidate declared a tier that under-protects the data
    const tierSeverity: Record<ClassificationTier, number> = {
      'PUBLIC': 1,
      'INTERNAL': 2,
      'CONFIDENTIAL': 3,
      'RESTRICTED': 4
    };

    const isMisclassified = tierSeverity[declaredTier] < tierSeverity[recommendedTier];

    return {
      declaredTier,
      recommendedTier,
      isMisclassified,
      classificationReasoning: reasoning,
      identifiedSensitivities
    };
  }
}
