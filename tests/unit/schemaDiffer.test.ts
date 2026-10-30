import assert from 'assert';
import { SchemaDiffer } from '../../src/tier4-deterministic/schemaDiffer.js';
import { DatasetSchema, BaselineDataContract } from '../../src/types.js';

console.log('🧪 [Unit Test] Running SchemaDiffer AST Suite...');

const baseline: BaselineDataContract = {
  datasetUrn: 'urn:datacatalog:production:finance:orders',
  contractVersion: '1.0.0',
  minimumClassificationTier: 'CONFIDENTIAL',
  allowedMutations: ['ADD_NULLABLE_COLUMN'],
  prohibitedMutations: ['DROP_COLUMN', 'NARROW_TYPE'],
  columns: [
    { name: 'order_id', type: 'uuid', nullable: false },
    { name: 'customer_id', type: 'string', nullable: false },
    { name: 'amount', type: 'decimal', nullable: false }
  ],
  registeredConsumers: [
    {
      id: 'consumer-analytics',
      serviceName: 'Analytics Pipeline',
      consumerType: 'STREAMING_PIPELINE',
      ownerTeam: 'Analytics Team',
      dependentFields: ['customer_id', 'amount'],
      slaTier: 'TIER_1_CRITICAL'
    }
  ]
};

// Case 1: Breaking change - Dropped column
const candidateDroppedCol: DatasetSchema = {
  datasetUrn: 'urn:datacatalog:production:finance:orders',
  datasetName: 'Orders Candidate',
  classificationTier: 'CONFIDENTIAL',
  schemaVersion: '2.0.0',
  storageTarget: 'LAKEHOUSE',
  columns: [
    { name: 'order_id', type: 'uuid', nullable: false },
    { name: 'amount', type: 'decimal', nullable: false }
  ]
};

const droppedDiffs = SchemaDiffer.diff(candidateDroppedCol, baseline);
assert.strictEqual(droppedDiffs.length, 1, 'Must detect 1 removed column');
assert.strictEqual(droppedDiffs[0].isBreaking, true, 'Removed column must be marked breaking');
assert.strictEqual(droppedDiffs[0].fieldName, 'customer_id');
assert.strictEqual(droppedDiffs[0].affectedConsumers.includes('Analytics Pipeline'), true);

// Case 2: Non-breaking change - Added optional column
const candidateAddedCol: DatasetSchema = {
  datasetUrn: 'urn:datacatalog:production:finance:orders',
  datasetName: 'Orders Candidate',
  classificationTier: 'CONFIDENTIAL',
  schemaVersion: '1.1.0',
  storageTarget: 'LAKEHOUSE',
  columns: [
    { name: 'order_id', type: 'uuid', nullable: false },
    { name: 'customer_id', type: 'string', nullable: false },
    { name: 'amount', type: 'decimal', nullable: false },
    { name: 'discount_code', type: 'string', nullable: true }
  ]
};

const addedDiffs = SchemaDiffer.diff(candidateAddedCol, baseline);
assert.strictEqual(addedDiffs.length, 1, 'Must detect 1 added column');
assert.strictEqual(addedDiffs[0].isBreaking, false, 'Optional added column must be non-breaking');
assert.strictEqual(addedDiffs[0].mutationType, 'FIELD_ADDED_OPTIONAL');

console.log('✅ [Unit Test] SchemaDiffer AST Suite PASSED (100% assertions satisfied)');
