import assert from 'assert';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { EnterpriseDataGovernanceAgent } from '../../src/agent.js';
import { DatasetSchema, BaselineDataContract } from '../../src/types.js';

console.log('🧪 [Integration Test] Running Full Governance Agent End-to-End Suite...\n');

const currentDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(currentDir, '..', '..');

function loadJson<T>(relPath: string): T {
  return JSON.parse(readFileSync(resolve(rootDir, relPath), 'utf-8'));
}

const baseline = loadJson<BaselineDataContract>('examples/contracts/customer-orders-v1-baseline.json');
const candidatePii = loadJson<DatasetSchema>('examples/candidates/candidate-critical-direct-pii-ssn.json');
const candidateDrift = loadJson<DatasetSchema>('examples/candidates/candidate-breaking-schema-drift.json');
const candidateClean = loadJson<DatasetSchema>('examples/candidates/candidate-clean-approved.json');

const agent = new EnterpriseDataGovernanceAgent({ mode: 'mock' });

async function runIntegrationTests() {
  // Scenario 1: Critical Direct PII Breach -> QUARANTINE
  console.log('  Scenario 1: Testing Direct PII Breach (Invariant 1)...');
  const resPii = await agent.auditDataset(candidatePii, baseline);

  assert.strictEqual(resPii.decision, 'QUARANTINE', 'Direct unmasked SSN must yield QUARANTINE');
  assert.strictEqual(resPii.exitCode, 1, 'Quarantine must exit with code 1');
  assert.strictEqual(resPii.success, false);
  assert.strictEqual(resPii.dossier.sensitiveDataFindings.length >= 1, true);
  assert.strictEqual(resPii.dossier.auditLog.tokensConsumedTotal, 0, 'Zero tokens consumed in deterministic scan');
  assert.strictEqual(resPii.dossier.decision.requiresHumanSupervisoryApproval, true, 'Must require human supervisory approval');
  assert.strictEqual(resPii.dossier.decision.suggestedIssueTicketKey, 'SEC-GOV-902');

  // Scenario 2: Breaking Schema Contract Mutation -> BLOCK_DEPLOYMENT
  console.log('  Scenario 2: Testing Breaking Schema Contract Drift (Invariant 2)...');
  const resDrift = await agent.auditDataset(candidateDrift, baseline);

  assert.strictEqual(resDrift.decision, 'BLOCK_DEPLOYMENT', 'Breaking column removal must yield BLOCK_DEPLOYMENT');
  assert.strictEqual(resDrift.exitCode, 1, 'Block deployment must exit with code 1');
  assert.strictEqual(resDrift.dossier.consumerImpact.blastRadiusRisk, 'CRITICAL');
  assert.strictEqual(resDrift.dossier.schemaDiffFindings.some(d => d.fieldName === 'customer_id'), true);

  // Scenario 3: Clean Compliant Partition with backward-compatible evolution -> APPROVE_WITH_WARNING
  console.log('  Scenario 3: Testing Clean Compliant Candidate with Optional Evolution...');
  const resClean = await agent.auditDataset(candidateClean, baseline);

  assert.strictEqual(resClean.decision, 'APPROVE_WITH_WARNING', 'Clean candidate with optional column evolution must be APPROVE_WITH_WARNING');
  assert.strictEqual(resClean.exitCode, 0, 'Approved candidate must exit with code 0 (PASS)');
  assert.strictEqual(resClean.success, true);
  assert.strictEqual(resClean.dossier.sensitiveDataFindings.length, 0);
  assert.strictEqual(resClean.dossier.decision.requiresHumanSupervisoryApproval, false);

  // Scenario 4: Exact Compliant Partition -> APPROVE
  console.log('  Scenario 4: Testing Exact Compliant Candidate without schema drift...');
  const resExact = await agent.auditDataset(candidateClean);

  assert.strictEqual(resExact.decision, 'APPROVE', 'Exact candidate without contract mutations must be APPROVE');
  assert.strictEqual(resExact.exitCode, 0, 'Must exit with code 0 (PASS)');
  assert.strictEqual(resExact.success, true);

  console.log('\n✅ [Integration Test] Full Governance Agent Suite PASSED (100% compliance)\n');
}

runIntegrationTests().catch(err => {
  console.error('Integration Test Error:', err);
  process.exit(1);
});
