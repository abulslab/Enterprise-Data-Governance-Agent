import { DatasetIncidentHistory, GovernanceDecisionOutcome } from '../types.js';

/**
 * Enterprise Governance Memory Engine
 * 
 * Capability 7: Persists historical enforcement actions and audit records.
 * Automatically tracks violation history per dataset and team, escalating
 * repeat offenders who breach governance invariants across pipeline runs.
 */
export class GovernanceMemory {
  private static store: Map<string, DatasetIncidentHistory> = new Map();

  /**
   * Records a governance audit result into memory.
   */
  public static recordAudit(
    datasetUrn: string,
    outcome: GovernanceDecisionOutcome,
    reasons: string[]
  ): DatasetIncidentHistory {
    const existing = this.store.get(datasetUrn) || {
      datasetUrn,
      totalAudits: 0,
      violationCount: 0,
      incidentHistory: [],
      isRepeatOffender: false,
      escalationLevel: 'STANDARD'
    };

    const isViolation = outcome === 'QUARANTINE' || outcome === 'BLOCK_DEPLOYMENT';

    existing.totalAudits += 1;
    if (isViolation) {
      existing.violationCount += 1;
      existing.lastViolationTimestamp = new Date().toISOString();
    }

    existing.incidentHistory.push({
      timestamp: new Date().toISOString(),
      outcome,
      reasons
    });

    // Evaluate Repeat Offender Escalation Policy
    if (existing.violationCount >= 3) {
      existing.isRepeatOffender = true;
      existing.escalationLevel = 'CRITICAL_BLOCK';
    } else if (existing.violationCount >= 2) {
      existing.isRepeatOffender = true;
      existing.escalationLevel = 'ESCALATED';
    } else if (existing.violationCount === 1) {
      existing.escalationLevel = 'WARNING';
    } else {
      existing.escalationLevel = 'STANDARD';
    }

    this.store.set(datasetUrn, existing);
    return existing;
  }

  /**
   * Retrieves incident history for a dataset URN.
   */
  public static getHistory(datasetUrn: string): DatasetIncidentHistory | undefined {
    return this.store.get(datasetUrn);
  }

  /**
   * Retrieves all tracked histories.
   */
  public static getAllHistories(): DatasetIncidentHistory[] {
    return Array.from(this.store.values());
  }

  /**
   * Clears in-memory store (for testing or reset).
   */
  public static resetMemory(): void {
    this.store.clear();
  }
}
