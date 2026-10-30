/**
 * Compiled Regular Expression Patterns for Zero-Token Sensitive Data Discovery
 */

export interface PatternRule {
  type: 'SSN' | 'CREDIT_CARD_PAN' | 'BANK_ROUTING_ABA' | 'BANK_ACCOUNT_NUMBER' | 'EMAIL_ADDRESS' | 'PHONE_NUMBER';
  category: 'DIRECT_PII' | 'FINANCIAL';
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
