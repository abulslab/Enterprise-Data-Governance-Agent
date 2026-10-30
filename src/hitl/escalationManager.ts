import { HitlEscalationPackage, DatasetSchema, SensitiveDataFinding, SchemaDiffFinding, GovernanceDecisionOutcome } from '../types.js';

/**
 * Human-in-the-Loop Governance Escalation Manager
 * 
 * Enforces Invariant G-4: Critical governance breaches or repeat offenders
 * trigger immediate supervisory review and dispatch automated escalation packages
 * to enterprise incident systems (Jira, ServiceNow, Slack, Teams).
 */
export class EscalationManager {
  public static createEscalationPackage(
    candidate: DatasetSchema,
    outcome: GovernanceDecisionOutcome,
    findings: SensitiveDataFinding[],
    diffs: SchemaDiffFinding[],
    isRepeatOffender: boolean = false
  ): HitlEscalationPackage {
    const ticketId = `SEC-GOV-${Math.floor(1000 + Math.random() * 9000)}`;
    const severity = isRepeatOffender || outcome === 'QUARANTINE' ? 'SEV-1-CRITICAL' : 'SEV-2-HIGH';

    const piiSummary = findings.map(f => `${f.patternType} in '${f.fieldName}'`).join(', ');
    const diffSummary = diffs.map(d => `${d.mutationType} on '${d.fieldName}'`).join(', ');

    const summary = isRepeatOffender
      ? `CRITICAL REPEAT OFFENDER: ${candidate.datasetUrn} has breached Invariant G-1/G-2 multiple times. Automated pipeline lock engaged.`
      : `Governance Gate ${outcome}: ${candidate.datasetUrn} detected ${findings.length} PII violations and ${diffs.length} contract diffs.`;

    // 1. Jira Enterprise Payload
    const jiraPayload = {
      fields: {
        project: { key: 'SEC' },
        summary: `[${severity}] Data Governance Violation - ${candidate.datasetUrn}`,
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: summary },
                { type: 'text', text: `\nViolations: ${piiSummary || 'None'}` },
                { type: 'text', text: `\nContract Diffs: ${diffSummary || 'None'}` }
              ]
            }
          ]
        },
        issuetype: { name: 'Security Incident' },
        priority: { name: severity === 'SEV-1-CRITICAL' ? 'Highest' : 'High' },
        labels: ['data-governance', 'autonomous-agent', 'compliance-gate', outcome.toLowerCase()]
      }
    };

    // 2. ServiceNow Change Request / Incident Payload
    const serviceNowPayload = {
      short_description: `Automated Governance Gate ${outcome} on ${candidate.datasetUrn}`,
      category: 'Information Security',
      subcategory: 'Data Privacy & Contract Enforcement',
      urgency: severity === 'SEV-1-CRITICAL' ? '1' : '2',
      impact: severity === 'SEV-1-CRITICAL' ? '1' : '2',
      assignment_group: 'Data Governance Board',
      cmdb_ci: candidate.datasetUrn,
      work_notes: `Agent Trace ID generated. Pipeline blocked. Awaiting Human-in-the-Loop review.`
    };

    // 3. Slack Block Kit Interactive Alert
    const slackCardPayload = {
      text: `🚨 Data Governance Alert: ${candidate.datasetUrn}`,
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: `🚨 Governance Decision: ${outcome}`, emoji: true }
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Dataset:*\n\`${candidate.datasetUrn}\`` },
            { type: 'mrkdwn', text: `*Severity:*\n${severity}` },
            { type: 'mrkdwn', text: `*PII Breaches:*\n${findings.length}` },
            { type: 'mrkdwn', text: `*Repeat Offender:*\n${isRepeatOffender ? '⚠️ YES' : 'NO'}` }
          ]
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'Approve Override (HITL)', emoji: true },
              style: 'primary',
              value: `override_${ticketId}`
            },
            {
              type: 'button',
              text: { type: 'plain_text', text: 'Confirm Quarantine Lock', emoji: true },
              style: 'danger',
              value: `confirm_${ticketId}`
            }
          ]
        }
      ]
    };

    // 4. Microsoft Teams Adaptive Card
    const teamsCardPayload = {
      type: 'AdaptiveCard',
      version: '1.4',
      body: [
        { type: 'TextBlock', text: `🛡️ Autonomous Governance Gate — ${outcome}`, weight: 'Bolder', size: 'Medium' },
        { type: 'TextBlock', text: summary, wrap: true },
        {
          type: 'FactSet',
          facts: [
            { title: 'Dataset', value: candidate.datasetUrn },
            { title: 'Severity', value: severity },
            { title: 'Ticket', value: ticketId }
          ]
        }
      ],
      actions: [
        { type: 'Action.OpenUrl', title: 'Review in Governance Studio', url: 'http://localhost:5175' }
      ]
    };

    return {
      ticketId,
      datasetUrn: candidate.datasetUrn,
      severity,
      approvalRequiredBy: [
        'Chief Privacy Officer (CPO)',
        'Principal Data Architect',
        'Lead Data Steward'
      ],
      summary,
      jiraPayload,
      serviceNowPayload,
      slackCardPayload,
      teamsCardPayload
    };
  }
}
