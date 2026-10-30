import { 
  DatasetSchema, 
  BaselineDataContract, 
  GovernanceAuditResult 
} from './types.js';
import { DeterministicScanner } from './tier4-deterministic/deterministicScanner.js';
import { DataClassifier } from './classifier/dataClassifier.js';
import { RegulatoryMapper } from './tier2-policies/regulatoryMapper.js';
import { ImpactAnalyzer } from './tier3-ooda/impactAnalyzer.js';
import { DecisionEngine } from './decision/decisionEngine.js';
import { DossierGenerator } from './dossier/dossierGenerator.js';
import { LLMGateway, LLMGatewayOptions } from './llm/llmGateway.js';

export interface EnterpriseGovernanceAgentOptions extends LLMGatewayOptions {
  strictMode?: boolean;
}

/**
 * Enterprise Data Governance Agent
 * Autonomous 4-Tier Cognitive Agent for Lakehouse Data Governance,
 * Schema Contract Enforcement, and Regulatory Compliance Verification.
 */
export class EnterpriseDataGovernanceAgent {
  private llmGateway: LLMGateway;

  constructor(options?: EnterpriseGovernanceAgentOptions) {
    this.llmGateway = new LLMGateway(options);
  }

  /**
   * Execute an end-to-end autonomous governance audit on a candidate dataset.
   */
  public async auditDataset(
    candidate: DatasetSchema,
    baseline?: BaselineDataContract
  ): Promise<GovernanceAuditResult> {
    // =========================================================================
    // STEP 1: Tier 4 Zero-Token Deterministic Scanner
    // =========================================================================
    const scanReport = DeterministicScanner.scan(candidate, baseline);

    // =========================================================================
    // STEP 2: Enterprise Data Classification Engine
    // =========================================================================
    const classification = DataClassifier.classify(candidate, scanReport.sensitiveFindings);

    // =========================================================================
    // STEP 3: Tier 2 Statutory Regulatory Mapping (GDPR, HIPAA, GLBA, PCI-DSS)
    // =========================================================================
    const regulatoryCitations = RegulatoryMapper.mapViolations(scanReport.sensitiveFindings);

    // =========================================================================
    // STEP 4: Tier 3 Downstream Consumer Impact & Blast Radius Analysis
    // =========================================================================
    const registeredConsumers = baseline?.registeredConsumers || candidate.downstreamConsumers || [];
    const consumerImpact = ImpactAnalyzer.analyze(scanReport.schemaDiffFindings, registeredConsumers);

    // =========================================================================
    // STEP 5: Governance Decision Engine
    // =========================================================================
    const decision = DecisionEngine.evaluate({
      sensitiveFindings: scanReport.sensitiveFindings,
      schemaDiffs: scanReport.schemaDiffFindings,
      consumerImpact,
      declaredClassification: candidate.classificationTier,
      recommendedClassification: classification.recommendedTier,
      isMisclassified: classification.isMisclassified
    });

    // =========================================================================
    // STEP 6: Autonomous OODA Reasoning Trajectory (Tri-Mode Gateway)
    // =========================================================================
    const breakingCount = scanReport.schemaDiffFindings.filter(d => d.isBreaking).length;
    const { trajectory, tokensConsumed } = await this.llmGateway.generateTrajectory(
      candidate.datasetUrn,
      decision.outcome,
      scanReport.sensitiveFindings.length,
      breakingCount
    );

    // =========================================================================
    // STEP 7: Cryptographic Compliance Dossier Synthesis
    // =========================================================================
    const dossier = DossierGenerator.generate({
      datasetUrn: candidate.datasetUrn,
      declaredClassification: candidate.classificationTier,
      recommendedClassification: classification.recommendedTier,
      decision,
      sensitiveFindings: scanReport.sensitiveFindings,
      schemaDiffs: scanReport.schemaDiffFindings,
      regulatoryCitations,
      consumerImpact,
      scannedRecordsCount: scanReport.scannedRecordsCount,
      deterministicDurationMs: scanReport.durationMs,
      tokensConsumedTotal: tokensConsumed,
      reasoningTrajectory: trajectory
    });

    // CI/CD Exit Code: 0 = PASS, 1 = BLOCK
    const exitCode = (decision.outcome === 'APPROVE' || decision.outcome === 'APPROVE_WITH_WARNING') ? 0 : 1;

    return {
      success: exitCode === 0,
      exitCode,
      decision: decision.outcome,
      dossier
    };
  }

  /**
   * Alias for auditDataset for concise SDK usage.
   */
  public async audit(
    candidate: DatasetSchema,
    baseline?: BaselineDataContract
  ): Promise<GovernanceAuditResult> {
    return this.auditDataset(candidate, baseline);
  }
}

// Export GovernanceAgent alias
export const GovernanceAgent = EnterpriseDataGovernanceAgent;
