import crypto from 'crypto';
import { CompiledPolicyRule } from '../types.js';

/**
 * Natural Language Policy-to-Invariant Compiler
 * 
 * Allows non-technical compliance officers, legal counsel, and data stewards
 * to write enterprise governance policies in plain English and automatically compiles
 * them into deterministic Tier 1 Invariants, scanner regexes, and gate enforcement logic.
 */
export class PolicyCompiler {
  public static compile(naturalLanguagePrompt: string): CompiledPolicyRule {
    const text = naturalLanguagePrompt.trim();
    const lower = text.toLowerCase();

    // 1. Detect Target Domain
    let targetDomain = 'ENTERPRISE_GLOBAL';
    if (/marketing/i.test(lower)) targetDomain = 'Marketing';
    else if (/finance|billing|ledger/i.test(lower)) targetDomain = 'Finance';
    else if (/health|clinical|patient/i.test(lower)) targetDomain = 'Healthcare';
    else if (/hr|payroll|employee/i.test(lower)) targetDomain = 'Human_Resources';
    else if (/analytics|lakehouse/i.test(lower)) targetDomain = 'Analytics';

    // 2. Detect Target Columns / Pattern Types
    const columnTerms: string[] = [];
    if (/phone|mobile/i.test(lower)) columnTerms.push('phone', 'mobile', 'telephone');
    if (/email/i.test(lower)) columnTerms.push('email', 'email_address');
    if (/ssn|social security/i.test(lower)) columnTerms.push('ssn', 'taxpayer_id');
    if (/credit card|pan|card number/i.test(lower)) columnTerms.push('card_number', 'pan');
    if (/bank|account/i.test(lower)) columnTerms.push('account_number', 'routing_number');

    if (columnTerms.length === 0) {
      columnTerms.push('.*');
    }

    const targetColumnsRegex = `^(${columnTerms.join('|')})$`;

    // 3. Detect Action & Invariant
    let invariantTarget: 'G-1' | 'G-2' | 'G-3' | 'G-4' | 'G-5' = 'G-1';
    let constraintAction: 'ENFORCE_CRYPTO_HASH' | 'ENFORCE_MASKING' | 'DISALLOW_CLEAR_TEXT' | 'ENFORCE_SUPERVISORY_QUARANTINE' = 'ENFORCE_MASKING';

    if (/hash|sha|hmac/i.test(lower)) {
      constraintAction = 'ENFORCE_CRYPTO_HASH';
      invariantTarget = 'G-1';
    } else if (/mask|pseudonym/i.test(lower)) {
      constraintAction = 'ENFORCE_MASKING';
      invariantTarget = 'G-1';
    } else if (/quarantine|stop|block/i.test(lower)) {
      constraintAction = 'ENFORCE_SUPERVISORY_QUARANTINE';
      invariantTarget = 'G-4';
    } else {
      constraintAction = 'DISALLOW_CLEAR_TEXT';
      invariantTarget = 'G-1';
    }

    // Generate cryptographic Rule Hash
    const id = `RULE-POL-${Date.now().toString(36).toUpperCase()}`;
    const ruleHash = crypto
      .createHash('sha256')
      .update(`${id}::${text}::${targetDomain}::${targetColumnsRegex}::${constraintAction}`)
      .digest('hex');

    return {
      id,
      naturalLanguagePrompt: text,
      targetDomain,
      targetColumnsRegex,
      invariantTarget,
      constraintAction,
      ruleHash,
      compiledAt: new Date().toISOString()
    };
  }
}
