#!/usr/bin/env node

/**
 * Enterprise Data Governance Agent — Command Line Interface (CLI)
 * Production CI/CD Governance Gate returning Exit Code 0 (PASS) or 1 (BLOCK).
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { EnterpriseDataGovernanceAgent } from './agent.js';
import { DatasetSchema, BaselineDataContract } from './types.js';
import { DossierGenerator } from './dossier/dossierGenerator.js';

interface ParsedArgs {
  candidatePath?: string;
  baselinePath?: string;
  llm: 'mock' | 'ollama' | 'gemini';
  geminiKey?: string;
  geminiModel?: string;
  ollamaUrl?: string;
  ollamaModel?: string;
  jsonOutput: boolean;
  help: boolean;
}

function parseArguments(args: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    llm: 'mock',
    jsonOutput: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--candidate' && args[i + 1]) {
      parsed.candidatePath = args[++i];
    } else if (arg === '--baseline' && args[i + 1]) {
      parsed.baselinePath = args[++i];
    } else if (arg === '--llm' && args[i + 1]) {
      parsed.llm = args[++i] as any;
    } else if (arg === '--gemini-key' && args[i + 1]) {
      parsed.geminiKey = args[++i];
    } else if (arg === '--gemini-model' && args[i + 1]) {
      parsed.geminiModel = args[++i];
    } else if (arg === '--ollama-url' && args[i + 1]) {
      parsed.ollamaUrl = args[++i];
    } else if (arg === '--ollama-model' && args[i + 1]) {
      parsed.ollamaModel = args[++i];
    } else if (arg === '--json') {
      parsed.jsonOutput = true;
    } else if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    }
  }

  return parsed;
}

function showHelp() {
  console.log(`
🛡️  Enterprise Data Governance Agent — CLI Gate

Usage:
  governance-agent [options]
  npx tsx src/cli.ts [options]

Options:
  --candidate <path.json>  Path to candidate dataset schema JSON (Required)
  --baseline <path.json>   Path to baseline data contract JSON (Optional)
  --llm <mock|ollama|gemini> Set cognitive reasoning provider (default: mock)
  --gemini-key <key>       Google AI Studio API key (or GEMINI_API_KEY env)
  --gemini-model <model>   Gemini model (default: gemini-2.5-flash)
  --ollama-url <url>       Local Ollama URL (default: http://localhost:11434)
  --ollama-model <model>   Local Ollama model (default: llama3:latest)
  --json                   Output machine-readable JSON (ideal for CI/CD)
  --help, -h               Show this help message

Exit Codes:
  0 = PASS (Approved or Approved with Warning)
  1 = BLOCK (Quarantine or Deployment Blocked)
`);
}

async function runCli() {
  const args = parseArguments(process.argv.slice(2));

  if (args.help) {
    showHelp();
    process.exit(0);
  }

  if (!args.candidatePath) {
    console.error('❌ Error: Missing mandatory argument --candidate <path.json>\n');
    showHelp();
    process.exit(1);
  }

  // Read Candidate Schema
  let candidate: DatasetSchema;
  try {
    const raw = readFileSync(resolve(process.cwd(), args.candidatePath), 'utf-8');
    candidate = JSON.parse(raw);
  } catch (err) {
    console.error(`❌ Failed to read candidate schema file at '${args.candidatePath}': ${(err as Error).message}`);
    process.exit(1);
  }

  // Read Baseline Contract (Optional)
  let baseline: BaselineDataContract | undefined;
  if (args.baselinePath) {
    try {
      const raw = readFileSync(resolve(process.cwd(), args.baselinePath), 'utf-8');
      baseline = JSON.parse(raw);
    } catch (err) {
      console.error(`❌ Failed to read baseline data contract file at '${args.baselinePath}': ${(err as Error).message}`);
      process.exit(1);
    }
  }

  // Initialize Agent
  const agent = new EnterpriseDataGovernanceAgent({
    mode: args.llm,
    geminiKey: args.geminiKey,
    geminiModel: args.geminiModel,
    ollamaUrl: args.ollamaUrl,
    ollamaModel: args.ollamaModel
  });

  if (!args.jsonOutput) {
    console.log('\n🤖 Starting Autonomous Data Governance Compliance Audit...');
    console.log(`- Dataset:     ${candidate.datasetUrn}`);
    console.log(`- Security:    ${candidate.classificationTier}`);
    console.log(`- Gateway:     ${args.llm.toUpperCase()} (Zero-Token deterministic scanner active)\n`);
  }

  // Execute Audit
  const result = await agent.auditDataset(candidate, baseline);

  if (args.jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(DossierGenerator.formatMarkdown(result.dossier));
    if (result.exitCode === 0) {
      console.log('\n✅ GOVERNANCE PASS: Ingestion pipeline unlocked.\n');
    } else {
      console.log(`\n❌ GOVERNANCE HALT: Pipeline blocked (${result.decision}). Quarantined or rejected.\n`);
    }
  }

  process.exit(result.exitCode);
}

runCli().catch(err => {
  console.error('Fatal Governance Error:', err);
  process.exit(1);
});
