import assert from 'node:assert';
import { EvidenceVault } from '../../src/evidence/evidenceVault.js';

console.log('🧪 [Unit Test] Running EvidenceVault Suite...');

EvidenceVault.resetVault();

// Test 1: Vault initialization and initial seed records
EvidenceVault.ensureInitialized();
const initialRecords = EvidenceVault.getAllRecords();
assert.ok(initialRecords.length >= 8, 'Vault should seed with realistic historical enterprise records');

// Test 2: Cryptographic chain integrity check on untouched seeded records
const initialVerification = EvidenceVault.verifyChainIntegrity();
assert.strictEqual(initialVerification.isValid, true, 'Seeded evidence chain must be 100% cryptographically valid');
assert.strictEqual(initialVerification.recordsVerified, initialRecords.length);

// Test 3: Appending a new audit decision to the immutable chain
const testUrn = 'urn:datacatalog:production:security:vault_test_dataset';
const newRecord = EvidenceVault.recordDecision({
  datasetUrn: testUrn,
  datasetName: 'Security Vault Test Dataset',
  classification: 'RESTRICTED',
  provider: 'Google Gemini',
  model: 'gemini-2.5-flash',
  decision: 'QUARANTINE',
  violations: [
    { type: 'SSN', field: 'taxpayer_ssn', description: 'Cleartext SSN breach', severity: 'CRITICAL', regulation: 'GDPR' }
  ],
  regulations: ['GDPR', 'GLBA'],
  blastRadius: 0
});

assert.ok(newRecord.id.startsWith('EV-'));
assert.strictEqual(newRecord.decision, 'QUARANTINE');
assert.strictEqual(newRecord.riskLevel, 'CRITICAL');
assert.strictEqual(newRecord.hitlRequired, true);
assert.strictEqual(newRecord.previousHash, initialRecords[initialRecords.length - 1].evidenceHash);
assert.strictEqual(newRecord.evidenceHash.length, 64, 'Evidence hash must be 64-char hex SHA-256 string');

// Test 4: Re-verifying chain integrity with newly appended record
const postAppendVerification = EvidenceVault.verifyChainIntegrity();
assert.strictEqual(postAppendVerification.isValid, true);
assert.strictEqual(postAppendVerification.recordsVerified, initialRecords.length + 1);

// Test 5: Dataset timeline and trend calculation
const customerTimeline = EvidenceVault.getDatasetTimeline('urn:datacatalog:production:customer:customer_master');
assert.strictEqual(customerTimeline.datasetUrn, 'urn:datacatalog:production:customer:customer_master');
assert.ok(customerTimeline.records.length >= 4);

// Test 6: Dataset Risk Profile calculation
const profile = EvidenceVault.getDatasetRiskProfile('urn:datacatalog:production:customer:customer_master');
assert.ok(profile.riskScore > 0 && profile.riskScore <= 100);
assert.ok(profile.priorIncidents >= 2);
assert.strictEqual(typeof profile.isRepeatOffender, 'boolean');

// Test 7: Repeat offenders query
const repeatOffenders = EvidenceVault.getRepeatOffenders();
assert.ok(Array.isArray(repeatOffenders));
assert.ok(repeatOffenders.length >= 1, 'customer_master should be recognized as a repeat offender');

// Test 8: Executive KPIs and Regulatory Exposure
const kpis = EvidenceVault.getExecutiveKpis();
assert.strictEqual(kpis.datasetsGoverned, 2184);
assert.ok(kpis.platformHealthScore >= 70 && kpis.platformHealthScore <= 100);

const regulations = EvidenceVault.getRegulatoryExposure();
assert.strictEqual(regulations.length, 4);
assert.ok(regulations.some(r => r.framework === 'GDPR'));
assert.ok(regulations.some(r => r.framework === 'PCI-DSS'));

console.log('✅ [Unit Test] EvidenceVault Suite PASSED (100% assertions satisfied)');
