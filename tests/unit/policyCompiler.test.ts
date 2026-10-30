import assert from 'node:assert';
import { PolicyCompiler } from '../../src/compiler/policyCompiler.js';

console.log('🧪 [Unit Test] Running PolicyCompiler Suite...');

// Test 1: Marketing phone number policy
const rule1 = PolicyCompiler.compile('Marketing datasets containing customer phone numbers must be masked before entering analytics');
assert.strictEqual(rule1.targetDomain, 'Marketing');
assert.ok(rule1.targetColumnsRegex.includes('phone'));
assert.strictEqual(rule1.constraintAction, 'ENFORCE_MASKING');
assert.ok(rule1.ruleHash.length === 64); // SHA-256 hex string

// Test 2: Finance SSN hash policy
const rule2 = PolicyCompiler.compile('Any finance dataset with SSN must have SHA256 HMAC hash applied');
assert.strictEqual(rule2.targetDomain, 'Finance');
assert.ok(rule2.targetColumnsRegex.includes('ssn'));
assert.strictEqual(rule2.constraintAction, 'ENFORCE_CRYPTO_HASH');

console.log('✅ [Unit Test] PolicyCompiler Suite PASSED (100% assertions satisfied)');
