import { eq } from 'drizzle-orm';
import { db } from '../db';
import { companies } from '../schema';
import { ICompanyRepository } from '../../../domain/interfaces/ICompanyRepository';
import { Company, CreateCompanyInput } from '../../../domain/entities/Company';

export class CompanyRepository implements ICompanyRepository {
  async findById(id: string): Promise<Company | null> {
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, id))
      .limit(1);

    return company || null;
  }

  async findByName(name: string): Promise<Company | null> {
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.name, name))
      .limit(1);

    return company || null;
  }

  async findAll(limit: number = 50, offset: number = 0): Promise<Company[]> {
    return await db.select().from(companies).limit(limit).offset(offset);
  }

  async create(input: CreateCompanyInput): Promise<Company> {
    const [company] = await db
      .insert(companies)
      .values({
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return company;
  }

  async update(id: string, input: Partial<CreateCompanyInput>): Promise<Company> {
    const [company] = await db
      .update(companies)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(companies.id, id))
      .returning();

    return company;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(companies).where(eq(companies.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
