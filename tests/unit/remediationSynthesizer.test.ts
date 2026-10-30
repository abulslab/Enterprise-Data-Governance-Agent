import assert from 'node:assert';
import { RemediationSynthesizer } from '../../src/autofix/remediationSynthesizer.js';
import { DatasetSchema, SensitiveDataFinding, SchemaDiffFinding } from '../../src/types.js';

console.log('🧪 [Unit Test] Running RemediationSynthesizer Suite...');

const candidate: DatasetSchema = {
  datasetUrn: 'urn:datacatalog:production:finance:orders_v2',
  datasetName: 'Orders v2',
  classificationTier: 'CONFIDENTIAL',
  schemaVersion: '2.0.0',
  storageTarget: 'LAKEHOUSE',
  columns: [
    { name: 'order_id', type: 'uuid', nullable: false },
    { name: 'taxpayer_ssn', type: 'string', nullable: false },
    { name: 'amount', type: 'decimal', nullable: false }
  ]
};

const findings: SensitiveDataFinding[] = [
  {
    fieldName: 'taxpayer_ssn',
    patternType: 'SSN',
    category: 'DIRECT_PII',
    sampleValueMasked: '***-**-1234',
    sampleValueRawPreview: '***1234',
    recordIndex: 0,
    confidence: 1.0,
    statutoryRegulation: ['GDPR', 'HIPAA']
  }
];

const diffs: SchemaDiffFinding[] = [];

const remediation = RemediationSynthesizer.synthesize(candidate, findings, diffs);

assert.ok(remediation.suggestedSql.includes('SHA256(CONCAT(taxpayer_ssn'));
assert.ok(remediation.suggestedPySpark.includes('.withColumn("taxpayer_ssn", sha2('));
assert.ok(remediation.suggestedDbt.includes("crypto_hash_pii('taxpayer_ssn'"));
assert.ok(remediation.suggestedDeltaLiveTables.includes('@dlt.expect_or_drop'));

console.log('✅ [Unit Test] RemediationSynthesizer Suite PASSED (100% assertions satisfied)');
