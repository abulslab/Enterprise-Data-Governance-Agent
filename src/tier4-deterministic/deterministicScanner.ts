import { 
  DatasetSchema, 
  BaselineDataContract, 
  SensitiveDataFinding, 
  SchemaDiffFinding 
} from '../types.js';
import { SENSITIVE_PATTERNS, isProperlyMasked } from './regexPatterns.js';
import { isValidLuhn } from './luhnValidator.js';
import { isValidAbaRouting } from './routingValidator.js';
import { SchemaDiffer } from './schemaDiffer.js';

export interface DeterministicScanReport {
  sensitiveFindings: SensitiveDataFinding[];
  schemaDiffFindings: SchemaDiffFinding[];
  scannedRecordsCount: number;
  durationMs: number;
  tokensConsumed: number;
}

/**
 * Tier 4 Zero-Token Deterministic Scanner
 * Combines compiled regular expressions, mathematical checksum algorithms (Luhn, ABA),
 * and AST schema diffing.
 */
export class DeterministicScanner {
  public static scan(
    candidate: DatasetSchema,
    baseline?: BaselineDataContract
  ): DeterministicScanReport {
    const startTime = performance.now();
    const sensitiveFindings: SensitiveDataFinding[] = [];
    const records = candidate.sampleRecords || [];

    for (let rIdx = 0; rIdx < records.length; rIdx++) {
      const record = records[rIdx];

      for (const [fieldName, rawVal] of Object.entries(record)) {
        if (rawVal === null || rawVal === undefined) continue;

        const valStr = String(rawVal).trim();
        if (valStr.length === 0) continue;

        // Skip properly masked or tokenized identifiers
        if (isProperlyMasked(valStr)) {
          continue;
        }

        // Evaluate sensitive patterns
        for (const pattern of SENSITIVE_PATTERNS) {
          if (!pattern.regex.test(valStr)) continue;

          // Additional mathematical checksum validation for financial numbers
          if (pattern.type === 'CREDIT_CARD_PAN') {
            if (!isValidLuhn(valStr)) {
              continue; // False positive rejected by Luhn Mod 10
            }
          }

          if (pattern.type === 'BANK_ROUTING_ABA') {
            if (!isValidAbaRouting(valStr)) {
              continue; // False positive rejected by ABA checksum
            }
          }

          // Masked preview for compliance dossier
          const maskedPreview = this.generateMaskedPreview(valStr, pattern.type);

          sensitiveFindings.push({
            fieldName,
            patternType: pattern.type,
            category: pattern.category,
            sampleValueMasked: maskedPreview,
            sampleValueRawPreview: valStr.length > 4 ? `***${valStr.slice(-4)}` : '***',
            recordIndex: rIdx,
            confidence: 1.0,
            statutoryRegulation: pattern.statutoryRegulation
          });

          break; // Stop after first positive pattern match for this cell
        }
      }
    }

    // AST Schema contract diff
    const schemaDiffFindings = SchemaDiffer.diff(candidate, baseline);

    const durationMs = Math.round((performance.now() - startTime) * 100) / 100;

    return {
      sensitiveFindings,
      schemaDiffFindings,
      scannedRecordsCount: records.length,
      durationMs,
      tokensConsumed: 0 // 100% deterministic, 0 LLM tokens
    };
  }

  private static generateMaskedPreview(val: string, type: string): string {
    if (type === 'SSN') return '***-**-' + val.slice(-4);
    if (type === 'CREDIT_CARD_PAN') return '****-****-****-' + val.slice(-4);
    if (type === 'EMAIL_ADDRESS') {
      const parts = val.split('@');
      return parts[0].slice(0, 2) + '***@' + (parts[1] || 'domain.com');
    }
    if (type === 'PHONE_NUMBER') return '***-***-' + val.slice(-4);
    return '***' + val.slice(-4);
  }
}
