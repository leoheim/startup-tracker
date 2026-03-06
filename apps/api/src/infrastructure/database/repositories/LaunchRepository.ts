import { eq } from 'drizzle-orm';
import { db } from '../db';
import { launches } from '../schema';
import { ILaunchRepository } from '../../../domain/interfaces/ILaunchRepository';
import { Launch, CreateLaunchInput } from '../../../domain/entities/Launch';
import { EngagementCalculator } from '../../../domain/services/EngagementCalculator';

export class LaunchRepository implements ILaunchRepository {
  async findById(id: string): Promise<Launch | null> {
    const [launch] = await db
      .select()
      .from(launches)
      .where(eq(launches.id, id))
      .limit(1);

    return (launch as unknown as Launch) || null;
  }

  async findByUrl(url: string): Promise<Launch | null> {
    const [launch] = await db
      .select()
      .from(launches)
      .where(eq(launches.postUrl, url))
      .limit(1);

    return (launch as unknown as Launch) || null;
  }

  async findByCompany(companyId: string): Promise<Launch[]> {
    const results = await db
      .select()
      .from(launches)
      .where(eq(launches.companyId, companyId));
    return results as unknown as Launch[];
  }

  async findAll(limit: number = 50, offset: number = 0): Promise<Launch[]> {
    const results = await db.select().from(launches).limit(limit).offset(offset);
    return results as unknown as Launch[];
  }

  async findByPerformanceTier(
    tier: 'low' | 'medium' | 'high'
  ): Promise<Launch[]> {
    const results = await db
      .select()
      .from(launches)
      .where(eq(launches.performanceTier, tier));
    return results as unknown as Launch[];
  }

  async create(input: CreateLaunchInput): Promise<Launch> {
    // Calculate engagement score and tier
    const { score, tier } = EngagementCalculator.analyzeEngagement({
      likesCount: input.likesCount || 0,
      commentsCount: input.commentsCount || 0,
      sharesCount: input.sharesCount || 0,
      viewsCount: input.viewsCount || 0,
    });

    const [launch] = await db
      .insert(launches)
      .values({
        ...input,
        likesCount: input.likesCount || 0,
        commentsCount: input.commentsCount || 0,
        sharesCount: input.sharesCount || 0,
        viewsCount: input.viewsCount || 0,
        engagementScore: score.toString(),
        performanceTier: tier,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return launch as unknown as Launch;
  }

  async update(id: string, input: Partial<Launch>): Promise<Launch> {
    // Recalculate engagement if metrics changed
    let updates: any = { ...input, updatedAt: new Date() };

    if (
      input.likesCount !== undefined ||
      input.commentsCount !== undefined ||
      input.sharesCount !== undefined ||
      input.viewsCount !== undefined
    ) {
      const existing = await this.findById(id);
      if (existing) {
        const { score, tier } = EngagementCalculator.analyzeEngagement({
          likesCount: input.likesCount ?? existing.likesCount,
          commentsCount: input.commentsCount ?? existing.commentsCount,
          sharesCount: input.sharesCount ?? existing.sharesCount,
          viewsCount: input.viewsCount ?? existing.viewsCount,
        });
        updates.engagementScore = score.toString();
        updates.performanceTier = tier;
      }
    }

    const [launch] = await db
      .update(launches)
      .set(updates)
      .where(eq(launches.id, id))
      .returning();

    return launch as unknown as Launch;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(launches).where(eq(launches.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
