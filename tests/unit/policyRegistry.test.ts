import assert from 'assert';
import { RegulatoryMapper } from '../../src/tier2-policies/regulatoryMapper.js';
import { SensitiveDataFinding } from '../../src/types.js';

console.log('🧪 [Unit Test] Running RegulatoryMapper Suite...');

const findings: SensitiveDataFinding[] = [
  {
    fieldName: 'card_num',
    patternType: 'CREDIT_CARD_PAN',
    category: 'FINANCIAL',
    sampleValueMasked: '****-****-****-1234',
    sampleValueRawPreview: '***1234',
    recordIndex: 0,
    confidence: 1.0,
    statutoryRegulation: ['PCI-DSS', 'GLBA']
  },
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

const citations = RegulatoryMapper.mapViolations(findings);

assert.strictEqual(citations.some(c => c.framework === 'PCI-DSS'), true, 'Must map credit card finding to PCI-DSS');
assert.strictEqual(citations.some(c => c.framework === 'GLBA'), true, 'Must map SSN finding to GLBA');
assert.strictEqual(citations.some(c => c.framework === 'HIPAA'), true, 'Must map SSN finding to HIPAA');
assert.strictEqual(citations.some(c => c.framework === 'GDPR'), true, 'Must map personal identifier to GDPR');

console.log('✅ [Unit Test] RegulatoryMapper Suite PASSED (100% assertions satisfied)');
