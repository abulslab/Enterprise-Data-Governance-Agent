import { 
  SensitiveDataFinding, 
  RegulatoryCitation 
} from '../types.js';

/**
 * Tier 2 Regulatory Policy Registry & Mapping Engine
 * Translates deterministic data governance findings into statutory compliance citations
 * and prescriptive remediation actions across GDPR, HIPAA, GLBA, and PCI-DSS.
 */
export class RegulatoryMapper {
  public static mapViolations(findings: SensitiveDataFinding[]): RegulatoryCitation[] {
    const citations: RegulatoryCitation[] = [];
    const seenCitations = new Set<string>();

    for (const f of findings) {
      if (f.patternType === 'CREDIT_CARD_PAN') {
        const key = 'PCI-DSS-3.4';
        if (!seenCitations.has(key)) {
          seenCitations.add(key);
          citations.push({
            framework: 'PCI-DSS',
            articleOrSection: 'PCI-DSS v4.0 Req 3.4',
            title: 'Render Primary Account Numbers (PAN) Unreadable Across All Storage Media',
            violationContext: `Cleartext credit card PAN detected in column '${f.fieldName}'. Storage of unencrypted PAN outside certified cardholder data environments (CDE) violates PCI-DSS.`,
            statutoryPenaltyRisk: 'Card brand fines ($5,000–$100,000/month), merchant processing suspension, mandatory Level 1 on-site QSA forensic audit.',
            mandatoryRemediation: 'Implement Format-Preserving Encryption (FPE) using AES-256 or replace PAN with PCI-certified surrogate token prior to lakehouse landing.'
          });
        }
      }

      if (f.patternType === 'SSN' || f.patternType === 'BANK_ROUTING_ABA') {
        const key = 'GLBA-6801';
        if (!seenCitations.has(key)) {
          seenCitations.add(key);
          citations.push({
            framework: 'GLBA',
            articleOrSection: '15 U.S.C. § 6801(b) / 16 CFR Part 314',
            title: 'Gramm-Leach-Bliley Act Safeguards Rule for Nonpublic Personal Information (NPI)',
            violationContext: `Direct financial or government identification credentials (${f.patternType}) detected in column '${f.fieldName}'.`,
            statutoryPenaltyRisk: 'FTC enforcement actions, statutory civil penalties up to $100,000 per violation, and officer liability.',
            mandatoryRemediation: 'Apply cryptographic field-level envelope encryption or route record to an isolated Tier 3 Restricted vault with strict audit logging.'
          });
        }
      }

      if (f.patternType === 'SSN' || f.patternType === 'EMAIL_ADDRESS' || f.patternType === 'PHONE_NUMBER') {
        const key = 'GDPR-Art32';
        if (!seenCitations.has(key)) {
          seenCitations.add(key);
          citations.push({
            framework: 'GDPR',
            articleOrSection: 'GDPR Article 32 & Article 5(1)(f)',
            title: 'Security of Processing & Principle of Integrity and Confidentiality',
            violationContext: `Unprotected personal identifiers (${f.patternType} in column '${f.fieldName}') entering general data pipelines without pseudonymization.`,
            statutoryPenaltyRisk: 'Administrative fines up to €20,000,000 or 4% of annual worldwide turnover, whichever is higher.',
            mandatoryRemediation: 'Enforce irreversible pseudonymization or dynamic column masking (`***-**-1234`) at the ingestion boundary.'
          });
        }
      }

      if (f.patternType === 'SSN') {
        const key = 'HIPAA-164.514';
        if (!seenCitations.has(key)) {
          seenCitations.add(key);
          citations.push({
            framework: 'HIPAA',
            articleOrSection: '45 CFR § 164.514(b)(2)',
            title: 'HIPAA Privacy Rule Safe Harbor De-Identification Standard',
            violationContext: `Social Security Number in column '${f.fieldName}' breaches the 18 direct identifiers prohibited under Safe Harbor de-identification.`,
            statutoryPenaltyRisk: 'HHS OCR Tier 4 civil monetary penalties up to $2,000,000 per calendar year, criminal referral for willful neglect.',
            mandatoryRemediation: 'Strip or zero-hash all 18 direct identifiers before exporting partitions to downstream analytical or business intelligence lakes.'
          });
        }
      }
    }

    return citations;
  }
}
