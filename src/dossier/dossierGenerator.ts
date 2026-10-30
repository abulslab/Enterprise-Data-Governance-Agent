import { 
  ComplianceDossier, 
  GovernanceDecision, 
  SensitiveDataFinding, 
  SchemaDiffFinding, 
  RegulatoryCitation, 
  ConsumerImpactAnalysis, 
  ClassificationTier,
  OODAStep 
} from '../types.js';
import { randomUUID } from 'crypto';

export interface DossierBuilderParams {
  datasetUrn: string;
  declaredClassification: ClassificationTier;
  recommendedClassification: ClassificationTier;
  decision: GovernanceDecision;
  sensitiveFindings: SensitiveDataFinding[];
  schemaDiffs: SchemaDiffFinding[];
  regulatoryCitations: RegulatoryCitation[];
  consumerImpact: ConsumerImpactAnalysis;
  scannedRecordsCount: number;
  deterministicDurationMs: number;
  tokensConsumedTotal: number;
  reasoningTrajectory: OODAStep[];
}

/**
 * Compliance Dossier Generator
 * Synthesizes formal, cryptographic compliance records with executive summaries,
 * regulatory mappings, consumer impact analyses, and full OODA reasoning trails.
 */
export class DossierGenerator {
  public static generate(params: DossierBuilderParams): ComplianceDossier {
    const traceId = `GOV-AUDIT-${randomUUID()}`;
    const auditTimestamp = new Date().toISOString();

    // Determine overall risk score
    let riskScore: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (params.decision.outcome === 'QUARANTINE' || params.consumerImpact.blastRadiusRisk === 'CRITICAL') {
      riskScore = 'CRITICAL';
    } else if (params.decision.outcome === 'BLOCK_DEPLOYMENT' || params.consumerImpact.blastRadiusRisk === 'HIGH') {
      riskScore = 'HIGH';
    } else if (params.decision.outcome === 'APPROVE_WITH_WARNING') {
      riskScore = 'MEDIUM';
    }

    // Executive Summary
    const execSummary = this.composeExecutiveSummary(params, riskScore);

    // Recommended Actions
    const recommendedActions = this.composeRecommendedActions(params);

    return {
      traceId,
      auditTimestamp,
      datasetUrn: params.datasetUrn,
      declaredClassification: params.declaredClassification,
      recommendedClassification: params.recommendedClassification,
      decision: params.decision,
      riskScore,
      executiveSummary: execSummary,
      sensitiveDataFindings: params.sensitiveFindings,
      schemaDiffFindings: params.schemaDiffs,
      regulatoryCitations: params.regulatoryCitations,
      consumerImpact: params.consumerImpact,
      recommendedActions,
      auditLog: {
        scannedRecordsCount: params.scannedRecordsCount,
        deterministicScanDurationMs: params.deterministicDurationMs,
        tokensConsumedTotal: params.tokensConsumedTotal,
        deterministicEngineZeroTokensOffloaded: true
      },
      reasoningTrajectory: params.reasoningTrajectory
    };
  }

  public static formatMarkdown(dossier: ComplianceDossier): string {
    const lines: string[] = [];
    lines.push('================================================================================');
    lines.push('ENTERPRISE DATA GOVERNANCE COMPLIANCE AUDIT DOSSIER');
    lines.push('================================================================================');
    lines.push(`Audit Trace ID:     ${dossier.traceId}`);
    lines.push(`Dataset URN:        ${dossier.datasetUrn}`);
    lines.push(`Audit Timestamp:    ${dossier.auditTimestamp}`);
    lines.push(`Declared Security:  ${dossier.declaredClassification}`);
    lines.push(`Recommended Tier:   ${dossier.recommendedClassification}`);
    lines.push(`Governance Status:  ${dossier.decision.outcome} (Risk: ${dossier.riskScore})`);
    if (dossier.decision.suggestedIssueTicketKey) {
      lines.push(`Issue Defect Key:   ${dossier.decision.suggestedIssueTicketKey}`);
    }
    lines.push('');
    lines.push('1. EXECUTIVE SUMMARY:');
    lines.push(dossier.executiveSummary);
    lines.push('');
    lines.push('2. ZERO-TOKEN DETERMINISTIC SCAN METRICS:');
    lines.push(`- Scanned Records:     ${dossier.auditLog.scannedRecordsCount}`);
    lines.push(`- Engine Scan Time:    ${dossier.auditLog.deterministicScanDurationMs}ms`);
    lines.push(`- Tokens Consumed:     ${dossier.auditLog.tokensConsumedTotal} (${dossier.auditLog.tokensConsumedTotal === 0 ? '100% Zero-Token Deterministic Offload' : 'Cognitive Gateway Call'})`);
    lines.push(`- PII Violations:      ${dossier.sensitiveDataFindings.length}`);
    lines.push(`- Contract Mutations:  ${dossier.schemaDiffFindings.length}`);
    lines.push('');

    if (dossier.sensitiveDataFindings.length > 0) {
      lines.push('3. SENSITIVE DATA DISCOVERY FINDINGS:');
      for (const f of dossier.sensitiveDataFindings) {
        lines.push(`  • [${f.category}] Column '${f.fieldName}' matched ${f.patternType} (Preview: ${f.sampleValueMasked}) -> Regulations: ${f.statutoryRegulation.join(', ')}`);
      }
      lines.push('');
    }

    if (dossier.schemaDiffFindings.length > 0) {
      lines.push('4. DATA CONTRACT DIFF & COMPATIBILITY:');
      for (const d of dossier.schemaDiffFindings) {
        lines.push(`  • [${d.isBreaking ? 'BREAKING' : 'NON-BREAKING'}] ${d.mutationType} on '${d.fieldName}': ${d.impactDescription}`);
      }
      lines.push('');
    }

    if (dossier.consumerImpact.affectedConsumerServices.length > 0) {
      lines.push('5. DOWNSTREAM CONSUMER BLAST RADIUS:');
      lines.push(`Risk Level: ${dossier.consumerImpact.blastRadiusRisk} (${dossier.consumerImpact.totalDownstreamAffected} systems affected)`);
      for (const s of dossier.consumerImpact.affectedConsumerServices) {
        lines.push(`  • Service: ${s.serviceName} (${s.consumerType}, ${s.slaTier}) — Broken Fields: [${s.brokenFields.join(', ')}]`);
      }
      lines.push('');
    }

    if (dossier.regulatoryCitations.length > 0) {
      lines.push('6. STATUTORY REGULATORY MAPPINGS:');
      for (const c of dossier.regulatoryCitations) {
        lines.push(`  • [${c.framework}] ${c.articleOrSection}: ${c.title}`);
        lines.push(`    Context:     ${c.violationContext}`);
        lines.push(`    Penalty:     ${c.statutoryPenaltyRisk}`);
        lines.push(`    Remediation: ${c.mandatoryRemediation}`);
      }
      lines.push('');
    }

    lines.push('7. RECOMMENDED ACTIONS:');
    for (let i = 0; i < dossier.recommendedActions.length; i++) {
      lines.push(`  ${i + 1}. ${dossier.recommendedActions[i]}`);
    }
    lines.push('');

    lines.push('8. AUTONOMOUS OODA REASONING TRAJECTORY:');
    for (const step of dossier.reasoningTrajectory) {
      lines.push(`  [Step ${step.step} | ${step.phase} | ${step.engineProvider}]`);
      lines.push(`    Obs: ${step.observation}`);
      lines.push(`    Dec: ${step.decision}`);
    }
    lines.push('================================================================================');

    return lines.join('\n');
  }

  private static composeExecutiveSummary(params: DossierBuilderParams, risk: string): string {
    const { datasetUrn, decision, sensitiveFindings, schemaDiffs, consumerImpact } = params;
    const directPii = sensitiveFindings.filter(f => f.category === 'DIRECT_PII' || f.category === 'FINANCIAL');
    const breakingDiffs = schemaDiffs.filter(d => d.isBreaking);

    if (decision.outcome === 'QUARANTINE') {
      return `CRITICAL COMPLIANCE HALT: Dataset candidate '${datasetUrn}' triggered an automated partition quarantine. Deterministic inspection discovered ${directPii.length} unmasked direct credentials outside approved vault boundaries. Immediate Human-in-the-Loop review required.`;
    }

    if (decision.outcome === 'BLOCK_DEPLOYMENT') {
      return `DEPLOYMENT GATE FAILURE: Dataset candidate '${datasetUrn}' contains ${breakingDiffs.length} breaking contract mutations that break ${consumerImpact.totalDownstreamAffected} downstream enterprise consumers. Deployment blocked to prevent cascading pipeline failure.`;
    }

    if (decision.outcome === 'APPROVE_WITH_WARNING') {
      return `CONDITIONAL APPROVAL: Dataset candidate '${datasetUrn}' complies with Tier 1 security invariants with minor non-breaking evolutions or security tier adjustments. Ingestion permitted with telemetry warnings logged.`;
    }

    return `COMPLIANCE CERTIFICATION GRANTED: Dataset candidate '${datasetUrn}' successfully passed all Tier 1 Invariants, Zero-Token PII checks, and Data Contract compatibility verifications. Certified for unrestricted lakehouse landing.`;
  }

  private static composeRecommendedActions(params: DossierBuilderParams): string[] {
    const actions: string[] = [];
    const { decision, sensitiveFindings, schemaDiffs } = params;

    if (decision.outcome === 'QUARANTINE') {
      actions.push('Halt ingestion pipeline immediately and isolate incoming partition storage bucket.');
      actions.push('Implement Format-Preserving Encryption (FPE) or Vault Tokenization on sensitive columns prior to landing.');
      actions.push(`Route ticket ${decision.suggestedIssueTicketKey || 'SEC-GOV-902'} to the Enterprise Data Protection Officer for formal supervisory sign-off.`);
    } else if (decision.outcome === 'BLOCK_DEPLOYMENT') {
      actions.push('Reject candidate schema deployment in CI/CD pipeline.');
      actions.push('Engage affected downstream consumer owners to schedule a formal schema version migration.');
      actions.push('Restore removed columns or provide alias compatibility layer in the data contract.');
    } else if (decision.outcome === 'APPROVE_WITH_WARNING') {
      actions.push('Publish updated schema contract version to the enterprise schema registry.');
      actions.push('Update data catalog metadata tags with the certified security classification.');
    } else {
      actions.push('Release automated deployment lock; dataset certified for production execution.');
      actions.push('Record immutable audit verification record in enterprise governance archive.');
    }

    return actions;
  }
}
