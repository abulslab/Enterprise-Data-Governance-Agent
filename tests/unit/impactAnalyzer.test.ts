import assert from 'assert';
import { ImpactAnalyzer } from '../../src/tier3-ooda/impactAnalyzer.js';
import { SchemaDiffFinding, DownstreamConsumer } from '../../src/types.js';

console.log('🧪 [Unit Test] Running ImpactAnalyzer Blast Radius Suite...');

const consumers: DownstreamConsumer[] = [
  {
    id: 'c-1',
    serviceName: 'Core Billing Engine',
    consumerType: 'CUSTOMER_API',
    ownerTeam: 'Billing Team',
    dependentFields: ['order_id', 'amount'],
    slaTier: 'TIER_1_CRITICAL'
  },
  {
    id: 'c-2',
    serviceName: 'Marketing Reporting',
    consumerType: 'BI_DASHBOARD',
    ownerTeam: 'Marketing',
    dependentFields: ['campaign_id'],
    slaTier: 'TIER_3_REPORTING'
  }
];

const breakingDiffs: SchemaDiffFinding[] = [
  {
    fieldName: 'amount',
    mutationType: 'FIELD_REMOVED',
    isBreaking: true,
    impactDescription: 'Field removed',
    affectedConsumers: ['Core Billing Engine']
  }
];

const impact = ImpactAnalyzer.analyze(breakingDiffs, consumers);

assert.strictEqual(impact.blastRadiusRisk, 'CRITICAL', 'Breaking change affecting Tier 1 SLA must be CRITICAL');
assert.strictEqual(impact.totalDownstreamAffected, 1, 'Exactly 1 consumer should be affected');
assert.strictEqual(impact.affectedConsumerServices[0].serviceName, 'Core Billing Engine');
assert.strictEqual(impact.affectedConsumerServices[0].brokenFields[0], 'amount');

console.log('✅ [Unit Test] ImpactAnalyzer Blast Radius Suite PASSED (100% assertions satisfied)');
