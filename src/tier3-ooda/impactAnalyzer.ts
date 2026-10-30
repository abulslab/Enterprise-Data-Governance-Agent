import { 
  SchemaDiffFinding, 
  DownstreamConsumer, 
  ConsumerImpactAnalysis 
} from '../types.js';

/**
 * Consumer Impact & Blast Radius Assessment Engine
 * Determines downstream systems affected by candidate schema changes,
 * evaluating criticality based on consumer SLA tiers and broken fields.
 */
export class ImpactAnalyzer {
  public static analyze(
    diffs: SchemaDiffFinding[],
    registeredConsumers: DownstreamConsumer[] = []
  ): ConsumerImpactAnalysis {
    const breakingDiffs = diffs.filter(d => d.isBreaking);
    const brokenFields = new Set(breakingDiffs.map(d => d.fieldName));

    if (brokenFields.size === 0 || registeredConsumers.length === 0) {
      return {
        blastRadiusRisk: breakingDiffs.length > 0 ? 'LOW' : 'NONE',
        totalDownstreamAffected: 0,
        affectedConsumerServices: [],
        summary: breakingDiffs.length > 0
          ? 'Breaking changes detected but no registered downstream consumers are currently subscribed to the mutated fields.'
          : 'Zero breaking changes detected. All downstream consumer contracts remain 100% satisfied.'
      };
    }

    const affectedConsumers: {
      serviceName: string;
      consumerType: string;
      slaTier: string;
      brokenFields: string[];
    }[] = [];

    let hasTier1Critical = false;
    let hasTier2Operational = false;

    for (const consumer of registeredConsumers) {
      const impacted = consumer.dependentFields.filter(f => brokenFields.has(f));
      if (impacted.length > 0) {
        affectedConsumers.push({
          serviceName: consumer.serviceName,
          consumerType: consumer.consumerType,
          slaTier: consumer.slaTier,
          brokenFields: impacted
        });

        if (consumer.slaTier === 'TIER_1_CRITICAL') hasTier1Critical = true;
        if (consumer.slaTier === 'TIER_2_OPERATIONAL') hasTier2Operational = true;
      }
    }

    let risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (hasTier1Critical) {
      risk = 'CRITICAL';
    } else if (hasTier2Operational || affectedConsumers.length >= 3) {
      risk = 'HIGH';
    } else if (affectedConsumers.length > 0) {
      risk = 'MEDIUM';
    }

    const summary = affectedConsumers.length > 0
      ? `Blast radius affects ${affectedConsumers.length} downstream consumer systems across ${brokenFields.size} broken contract fields (${Array.from(brokenFields).join(', ')}). Risk level assessed as ${risk}.`
      : 'No registered downstream consumers affected.';

    return {
      blastRadiusRisk: risk,
      totalDownstreamAffected: affectedConsumers.length,
      affectedConsumerServices: affectedConsumers,
      summary
    };
  }
}
