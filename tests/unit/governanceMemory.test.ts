import assert from 'node:assert';
import { GovernanceMemory } from '../../src/memory/governanceMemory.js';

console.log('🧪 [Unit Test] Running GovernanceMemory Suite...');

GovernanceMemory.resetMemory();

const urn = 'urn:datacatalog:production:finance:customer_orders';

// Test 1: Initial clean audit
const record1 = GovernanceMemory.recordAudit(urn, 'APPROVE', ['Compliant schema']);
assert.strictEqual(record1.totalAudits, 1);
assert.strictEqual(record1.violationCount, 0);
assert.strictEqual(record1.isRepeatOffender, false);
assert.strictEqual(record1.escalationLevel, 'STANDARD');

// Test 2: First violation
const record2 = GovernanceMemory.recordAudit(urn, 'QUARANTINE', ['Unmasked SSN']);
assert.strictEqual(record2.totalAudits, 2);
assert.strictEqual(record2.violationCount, 1);
assert.strictEqual(record2.isRepeatOffender, false);
assert.strictEqual(record2.escalationLevel, 'WARNING');

// Test 3: Second violation triggers Repeat Offender
const record3 = GovernanceMemory.recordAudit(urn, 'BLOCK_DEPLOYMENT', ['Dropped customer_id']);
assert.strictEqual(record3.totalAudits, 3);
assert.strictEqual(record3.violationCount, 2);
assert.strictEqual(record3.isRepeatOffender, true);
assert.strictEqual(record3.escalationLevel, 'ESCALATED');

// Test 4: Third violation triggers Critical Block
const record4 = GovernanceMemory.recordAudit(urn, 'QUARANTINE', ['Unmasked Credit Card PAN']);
assert.strictEqual(record4.violationCount, 3);
assert.strictEqual(record4.escalationLevel, 'CRITICAL_BLOCK');

console.log('✅ [Unit Test] GovernanceMemory Suite PASSED (100% assertions satisfied)');
