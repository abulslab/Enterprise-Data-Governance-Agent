# Developer Reuse & CI/CD Integration Guide 📦

This guide explains how to embed the **Enterprise Data Governance Agent** into continuous deployment pipelines, pre-commit hooks, and data orchestrators.

---

## 1. Zero-Install Execution via NPX

You can run the governance agent directly in any data pipeline without cloning:

```bash
npx tsx /path/to/Enterprise-Data-Governance-Agent/src/cli.ts \
  --candidate ./schemas/new_partition.json \
  --baseline ./contracts/active_contract.json \
  --llm mock
```

---

## 2. GitHub Actions CI/CD Pipeline Gate

Add `.github/workflows/data-governance-gate.yml` to your data repository to prevent toxic PII leaks or breaking contract mutations from merging into `main`:

```yaml
name: Data Governance & Contract Gate

on:
  pull_request:
    paths:
      - 'schemas/**'
      - 'contracts/**'

jobs:
  governance-audit:
    name: Autonomous Governance Gate
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Clone Governance Agent
        run: |
          git clone https://github.com/abulslab/Enterprise-Data-Governance-Agent.git /tmp/gov-agent
          cd /tmp/gov-agent && npm install

      - name: Audit Candidate Schema Contract
        run: |
          node /tmp/gov-agent/dist/cli.js \
            --candidate ./schemas/candidate.json \
            --baseline ./contracts/baseline.json \
            --json > governance-dossier.json

      - name: Upload Compliance Dossier Artifact
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: governance-compliance-dossier
          path: governance-dossier.json
```

---

## 3. Pre-Commit Hook (Preventing Local PII Commits)

In your local repository `.git/hooks/pre-commit`:

```bash
#!/bin/sh
echo "🛡️  Running Enterprise Data Governance Pre-Commit Invariant Check..."

npx tsx /path/to/Enterprise-Data-Governance-Agent/src/cli.ts \
  --candidate ./schemas/candidate.json \
  --llm mock

if [ $? -ne 0 ]; then
  echo "❌ Governance Invariant Failed: Commit rejected."
  exit 1
fi

echo "✅ Governance Invariant Passed."
exit 0
```
