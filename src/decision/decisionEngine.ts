import { 
  GovernanceDecision, 
  SensitiveDataFinding, 
  SchemaDiffFinding, 
  ConsumerImpactAnalysis, 
  ClassificationTier 
} from '../types.js';

export interface DecisionInputs {
  sensitiveFindings: SensitiveDataFinding[];
  schemaDiffs: SchemaDiffFinding[];
  consumerImpact: ConsumerImpactAnalysis;
  declaredClassification: ClassificationTier;
  recommendedClassification: ClassificationTier;
  isMisclassified: boolean;
}

/**
 * Enterprise Governance Decision Engine
 * Evaluates Tier 1 Invariants, Tier 2 Regulatory Policies, and Tier 3 Impact
 * to emit one of four definitive outcomes:
 * APPROVE, APPROVE_WITH_WARNING, QUARANTINE, or BLOCK_DEPLOYMENT.
 */
export class DecisionEngine {
  public static evaluate(inputs: DecisionInputs): GovernanceDecision {
    const timestamp = new Date().toISOString();
    const { 
      sensitiveFindings, 
      schemaDiffs, 
      consumerImpact, 
      declaredClassification, 
      recommendedClassification, 
      isMisclassified 
    } = inputs;

    const directPiiViolations = sensitiveFindings.filter(f => f.category === 'DIRECT_PII' || f.category === 'FINANCIAL');
    const breakingDiffs = schemaDiffs.filter(d => d.isBreaking);

    // Rule 1: Direct PII in non-vaulted storage -> QUARANTINE (Invariant 1 Breach)
    if (directPiiViolations.length > 0 && declaredClassification !== 'RESTRICTED') {
      const piiTypes = Array.from(new Set(directPiiViolations.map(v => v.patternType))).join(', ');
      return {
        outcome: 'QUARANTINE',
        timestamp,
        rationale: `Breach of Invariant 1 (Zero Unmasked Direct PII Outside Vaults). Dataset declared as '${declaredClassification}', but contains unmasked direct credentials (${piiTypes}). Automated partition quarantine enforced.`,
        requiresHumanSupervisoryApproval: true,
        humanApprovalStatus: 'PENDING_REVIEW',
        suggestedIssueTicketKey: 'SEC-GOV-902',
        suggestedRemediationAction: 'Halt ingestion pipeline immediately. Route raw partition to Tier 3 Restricted vault or execute tokenization/FPE masking.'
      };
    }

    // Rule 2: Breaking schema mutation impacting consumers -> BLOCK_DEPLOYMENT (Invariant 2 Breach)
    if (breakingDiffs.length > 0 && consumerImpact.blastRadiusRisk !== 'NONE') {
      const brokenCols = breakingDiffs.map(d => d.fieldName).join(', ');
      return {
        outcome: 'BLOCK_DEPLOYMENT',
        timestamp,
        rationale: `Breach of Invariant 2 (Data Contract Compatibility). Candidate introduces ${breakingDiffs.length} breaking changes (${brokenCols}) with ${consumerImpact.blastRadiusRisk} blast radius affecting ${consumerImpact.totalDownstreamAffected} downstream consumer systems.`,
        requiresHumanSupervisoryApproval: true,
        humanApprovalStatus: 'PENDING_REVIEW',
        suggestedIssueTicketKey: 'CONTRACT-BLOCKED-401',
        suggestedRemediationAction: 'Reject pull request / deployment. Author must provide non-breaking contract evolution or execute formal deprecation lifecycle.'
      };
    }

    // Rule 3: Breaking change with zero registered consumers -> APPROVE_WITH_WARNING
    if (breakingDiffs.length > 0 && consumerImpact.blastRadiusRisk === 'NONE') {
      return {
        outcome: 'APPROVE_WITH_WARNING',
        timestamp,
        rationale: `Schema mutation contains column changes, but zero downstream consumers are currently subscribed. Deployment approved with warning to register contracts.`,
        requiresHumanSupervisoryApproval: false,
        humanApprovalStatus: 'NOT_REQUIRED',
        suggestedRemediationAction: 'Notify data platform team to record updated schema definition in data catalog schema registry.'
      };
    }

    // Rule 4: Misclassification or non-breaking optional additions -> APPROVE_WITH_WARNING
    if (isMisclassified || schemaDiffs.some(d => !d.isBreaking)) {
      return {
        outcome: 'APPROVE_WITH_WARNING',
        timestamp,
        rationale: isMisclassified
          ? `Dataset declared as '${declaredClassification}', but detected attributes warrant '${recommendedClassification}'. Governance catalog updated with recommended security tier.`
          : `Non-breaking schema evolution detected (optional column additions). Backward compatibility preserved.`,
        requiresHumanSupervisoryApproval: false,
        humanApprovalStatus: 'NOT_REQUIRED',
        suggestedRemediationAction: 'Update data catalog metadata tags and notify downstream analytical consumers of optional attribute availability.'
      };
    }

    // Rule 5: 100% Compliant -> APPROVE
    return {
      outcome: 'APPROVE',
      timestamp,
      rationale: `All Tier 1 invariants and data contracts verified. Zero unmasked direct PII, zero breaking mutations, and classification is certified.`,
      requiresHumanSupervisoryApproval: false,
      humanApprovalStatus: 'NOT_REQUIRED',
      suggestedRemediationAction: 'Release pipeline lock. Dataset certified for production ingestion.'
    };
  }
}
