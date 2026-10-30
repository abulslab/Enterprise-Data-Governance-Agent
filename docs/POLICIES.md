# Governance Policies & Statutory Citations

This document outlines the statutory compliance frameworks enforced by the **Enterprise Data Governance Agent**.

---

## 1. Statutory Frameworks

### GDPR (General Data Protection Regulation)
- **Article 32 — Security of Processing**: Mandates technical and organizational measures to ensure security appropriate to risk, including pseudonymization and encryption of personal data.
- **Article 5(1)(f) — Integrity & Confidentiality**: Requires protection against unauthorized or unlawful processing and accidental loss.
- **Statutory Risk**: Up to €20M or 4% of annual worldwide turnover.
- **Remediation**: Dynamic column-level masking (`***-**-1234`) or format-preserving encryption at the ingestion boundary.

### HIPAA (Health Insurance Portability and Accountability Act)
- **45 CFR § 164.514(b)(2) — Safe Harbor De-Identification**: Mandates the removal of 18 specific personal identifiers (including Social Security Numbers, phone numbers, and full-face photos) before health data can be treated as de-identified.
- **Statutory Risk**: Civil monetary penalties up to $2,000,000 per calendar year; criminal referrals for willful neglect.
- **Remediation**: Strip or cryptographic zero-hash direct identifiers before exporting partitions to downstream analytical lakes.

### GLBA (Gramm-Leach-Bliley Act)
- **15 U.S.C. § 6801(b) / 16 CFR Part 314 — Safeguards Rule**: Requires financial institutions to maintain comprehensive security safeguards to protect customer nonpublic personal information (NPI).
- **Statutory Risk**: Up to $100,000 per violation for the institution; individual officer penalties.
- **Remediation**: Field-level envelope encryption (AES-256) or routing to an isolated Tier 3 Restricted vault with strict audit trails.

### PCI-DSS (Payment Card Industry Data Security Standard)
- **Requirement 3.4 — Protect Cardholder Data**: Mandates that Primary Account Numbers (PAN) must be rendered unreadable anywhere they are stored (e.g. one-way hashes, truncation, index tokens, or strong cryptography).
- **Statutory Risk**: Card brand fines ($5,000–$100,000/month), payment processing suspension, mandatory on-site QSA audits.
- **Remediation**: Never store unencrypted PANs in data lakehouses. Replace PAN with certified surrogate tokens before pipeline landing.

---

## 2. Enterprise Data Classification Standard

| Tier | Sensitivity | Approved Storage Targets | Permitted Data Attributes |
| :--- | :--- | :--- | :--- |
| **`PUBLIC`** | Low / None | S3 Public Buckets, Web CDNs | Marketing content, press releases, public product catalogs. Zero PII. |
| **`INTERNAL`** | Moderate | Corporate Warehouses, Internal APIs | Internal product IDs, business metrics, employee emails. No customer PII. |
| **`CONFIDENTIAL`** | High | Analytics Lakehouses (RBAC / Lake Formation) | Masked PII (`***-**-6789`), hashed identifiers, aggregated transaction metrics. |
| **`RESTRICTED`** | Critical | Dedicated Security Vaults (HSM / AWS KMS) | Raw SSNs, full credit card PANs, banking credentials, medical records. |
