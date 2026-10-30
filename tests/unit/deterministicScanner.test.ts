import assert from 'assert';
import { DeterministicScanner } from '../../src/tier4-deterministic/deterministicScanner.js';
import { isValidLuhn } from '../../src/tier4-deterministic/luhnValidator.js';
import { isValidAbaRouting } from '../../src/tier4-deterministic/routingValidator.js';
import { DatasetSchema } from '../../src/types.js';

console.log('🧪 [Unit Test] Running DeterministicScanner & Checksum Suite...');

// 1. Luhn Mod 10 Verification
assert.strictEqual(isValidLuhn('4532015112830366'), true, 'Valid Visa PAN should pass Luhn algorithm');
assert.strictEqual(isValidLuhn('4532015112830367'), false, 'Invalid Visa PAN should fail Luhn algorithm');

// 2. ABA Routing Transit Checksum Verification
assert.strictEqual(isValidAbaRouting('021000021'), true, 'Valid JPMorgan Chase ABA routing number should pass');
assert.strictEqual(isValidAbaRouting('021000022'), false, 'Invalid routing number should fail checksum');

// 3. Deterministic Scanner Execution
const candidateWithSsn: DatasetSchema = {
  datasetUrn: 'urn:datacatalog:production:finance:test_records',
  datasetName: 'Test Records',
  classificationTier: 'CONFIDENTIAL',
  schemaVersion: '1.0.0',
  storageTarget: 'LAKEHOUSE',
  columns: [
    { name: 'user_id', type: 'string', nullable: false },
    { name: 'tax_id', type: 'string', nullable: false },
    { name: 'masked_tax_id', type: 'string', nullable: true }
  ],
  sampleRecords: [
    { user_id: 'u-1', tax_id: '123-45-6789', masked_tax_id: '***-**-6789' }
  ]
};

const scanReport = DeterministicScanner.scan(candidateWithSsn);

assert.strictEqual(scanReport.tokensConsumed, 0, 'Deterministic engine must consume exactly 0 tokens');
assert.strictEqual(scanReport.sensitiveFindings.length, 1, 'Must detect unmasked SSN');
assert.strictEqual(scanReport.sensitiveFindings[0].fieldName, 'tax_id', 'Identified field must match tax_id');
assert.strictEqual(scanReport.sensitiveFindings[0].patternType, 'SSN', 'Identified pattern must match SSN');
assert.strictEqual(scanReport.sensitiveFindings[0].sampleValueMasked, '***-**-6789', 'Must generate masked preview');

// Masked field should NOT be flagged as a violation
const maskedFinding = scanReport.sensitiveFindings.find(f => f.fieldName === 'masked_tax_id');
assert.strictEqual(maskedFinding, undefined, 'Properly masked values must produce 0 false positives');

console.log('✅ [Unit Test] DeterministicScanner & Checksum Suite PASSED (100% assertions satisfied)');
