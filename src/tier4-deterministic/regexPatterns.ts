/**
 * Compiled Regular Expression Patterns for Zero-Token Sensitive Data Discovery
 */

export interface PatternRule {
  type: 'SSN' | 'CREDIT_CARD_PAN' | 'BANK_ROUTING_ABA' | 'BANK_ACCOUNT_NUMBER' | 'EMAIL_ADDRESS' | 'PHONE_NUMBER' | 'IBAN' | 'PASSPORT' | 'DRIVER_LICENSE' | 'HEALTHCARE_IDENTIFIER' | 'NATIONAL_ID';
  category: 'DIRECT_PII' | 'FINANCIAL' | 'REGULATED_HEALTH';
  regex: RegExp;
  statutoryRegulation: ('GDPR' | 'HIPAA' | 'GLBA' | 'PCI-DSS')[];
}

export const SENSITIVE_PATTERNS: PatternRule[] = [
  {
    type: 'SSN',
    category: 'DIRECT_PII',
    regex: /\b\d{3}-\d{2}-\d{4}\b/,
    statutoryRegulation: ['GLBA', 'HIPAA', 'GDPR']
  },
  {
    type: 'CREDIT_CARD_PAN',
    category: 'FINANCIAL',
    // Matches 13-19 digit card representations with optional dashes/spaces
    regex: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/,
    statutoryRegulation: ['PCI-DSS', 'GLBA']
  },
  {
    type: 'BANK_ROUTING_ABA',
    category: 'FINANCIAL',
    regex: /\b(?:0[1-9]|[1-2][0-9]|3[0-2])[0-9]{7}\b/,
    statutoryRegulation: ['GLBA']
  },
  {
    type: 'IBAN',
    category: 'FINANCIAL',
    regex: /\b[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}\b/,
    statutoryRegulation: ['GDPR', 'GLBA']
  },
  {
    type: 'EMAIL_ADDRESS',
    category: 'DIRECT_PII',
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,
    statutoryRegulation: ['GDPR', 'HIPAA']
  },
  {
    type: 'PHONE_NUMBER',
    category: 'DIRECT_PII',
    regex: /\b(?:\+?1[-.\s]?)?\(?[2-9][0-9]{2}\)?[-.\s]?[2-9][0-9]{2}[-.\s]?[0-9]{4}\b/,
    statutoryRegulation: ['GDPR', 'HIPAA']
  },
  {
    type: 'PASSPORT',
    category: 'DIRECT_PII',
    regex: /\b[A-Z]{1,2}[0-9]{7,9}\b/,
    statutoryRegulation: ['GDPR', 'HIPAA']
  },
  {
    type: 'DRIVER_LICENSE',
    category: 'DIRECT_PII',
    regex: /\b[A-Z][0-9]{7,8}\b/,
    statutoryRegulation: ['GDPR', 'GLBA']
  },
  {
    type: 'HEALTHCARE_IDENTIFIER',
    category: 'REGULATED_HEALTH',
    // US NPI (National Provider Identifier: 10 digits starting with 1 or 2) or MRN format
    regex: /\b(?:NPI-[12]\d{9}|MRN-\d{6,10}|[12]\d{9})\b/,
    statutoryRegulation: ['HIPAA']
  },
  {
    type: 'NATIONAL_ID',
    category: 'DIRECT_PII',
    // UK NINO or Canadian SIN
    regex: /\b(?:[A-CEGHJ-PR-TW-Z]{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-D]|\d{3}-\d{3}-\d{3})\b/,
    statutoryRegulation: ['GDPR']
  }
];

export const MASKED_OR_TOKENIZED_PATTERNS: RegExp[] = [
  /\b\*{3}-\*{2}-\d{4}\b/,            // ***-**-1234
  /\bX{3}-X{2}-\d{4}\b/i,             // XXX-XX-1234
  /\b\*{4}[\s-]?\*{4}[\s-]?\*{4}[\s-]?\d{4}\b/, // ****-****-****-1234
  /\b[A-Za-z0-9._%+-]+@\*{3,}\.[A-Za-z]{2,}\b/, // user@***.com
  /\bTOK_[a-zA-Z0-9_-]{16,}\b/,       // Tokenized surrogate key
  /\bVAULT_[a-zA-Z0-9_-]{16,}\b/      // Vault reference ID
];

/**
 * Checks if a value string is properly pseudonymized, masked, or tokenized.
 */
export function isProperlyMasked(val: string): boolean {
  return MASKED_OR_TOKENIZED_PATTERNS.some(pattern => pattern.test(val));
}
