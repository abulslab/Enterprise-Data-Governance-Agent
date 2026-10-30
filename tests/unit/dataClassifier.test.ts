import assert from 'assert';
import { DataClassifier } from '../../src/classifier/dataClassifier.js';
import { DatasetSchema, SensitiveDataFinding } from '../../src/types.js';

console.log('🧪 [Unit Test] Running DataClassifier Suite...');

const dummySchema: DatasetSchema = {
  datasetUrn: 'urn:datacatalog:production:finance:records',
  datasetName: 'Finance Records',
  classificationTier: 'INTERNAL',
  schemaVersion: '1.0.0',
  storageTarget: 'LAKEHOUSE',
  columns: [
    { name: 'user_id', type: 'string', nullable: false },
    { name: 'ssn', type: 'string', nullable: false }
  ]
};

const ssnFinding: SensitiveDataFinding[] = [
  {
    fieldName: 'ssn',
    patternType: 'SSN',
    category: 'DIRECT_PII',
    sampleValueMasked: '***-**-6789',
    sampleValueRawPreview: '***6789',
    recordIndex: 0,
    confidence: 1.0,
    statutoryRegulation: ['GLBA', 'HIPAA', 'GDPR']
  }
];

const result = DataClassifier.classify(dummySchema, ssnFinding);

assert.strictEqual(result.recommendedTier, 'RESTRICTED', 'Direct SSN must recommend RESTRICTED tier');
assert.strictEqual(result.isMisclassified, true, 'Declared INTERNAL with SSN must flag isMisclassified=true');
assert.strictEqual(result.declaredTier, 'INTERNAL');
assert.strictEqual(result.identifiedSensitivities.length, 1);

console.log('✅ [Unit Test] DataClassifier Suite PASSED (100% assertions satisfied)');
