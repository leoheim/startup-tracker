import { Launch, PerformanceTier } from '../entities/Launch';

export class EngagementCalculator {
  /**
   * Calculate engagement score based on metrics
   * Formula: (likes * 1) + (comments * 3) + (shares * 5) + (views * 0.01)
   */
  static calculateScore(launch: {
    likesCount: number;
    commentsCount: number;
    sharesCount: number;
    viewsCount: number;
  }): number {
    const { likesCount, commentsCount, sharesCount, viewsCount } = launch;

    const score =
      likesCount * 1 +
      commentsCount * 3 + // Comments are worth more
      sharesCount * 5 + // Shares have more impact
      viewsCount * 0.01; // Views count less

    return Math.round(score * 100) / 100; // Round to 2 decimals
  }

  /**
   * Classify performance tier based on engagement score
   */
  static classifyPerformance(score: number): PerformanceTier {
    if (score < 100) return 'low';
    if (score < 1000) return 'medium';
    return 'high';
  }

  /**
   * Calculate and classify in one go
   */
  static analyzeEngagement(launch: {
    likesCount: number;
    commentsCount: number;
    sharesCount: number;
    viewsCount: number;
  }): { score: number; tier: PerformanceTier } {
    const score = this.calculateScore(launch);
    const tier = this.classifyPerformance(score);

    return { score, tier };
  }
}
