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

    return (company as unknown as Company) || null;
  }

  async findByName(name: string): Promise<Company | null> {
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.name, name))
      .limit(1);

    return (company as unknown as Company) || null;
  }

  async findAll(limit: number = 50, offset: number = 0): Promise<Company[]> {
    const results = await db.select().from(companies).limit(limit).offset(offset);
    return results as unknown as Company[];
  }

  async create(input: CreateCompanyInput): Promise<Company> {
    const values: any = {
      ...input,
      foundedDate: input.foundedDate?.toISOString().split('T')[0],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [company] = await db
      .insert(companies)
      .values(values)
      .returning();

    return company as unknown as Company;
  }

  async update(id: string, input: Partial<CreateCompanyInput>): Promise<Company> {
    const values: any = {
      ...input,
      foundedDate: input.foundedDate?.toISOString().split('T')[0],
      updatedAt: new Date(),
    };

    const [company] = await db
      .update(companies)
      .set(values)
      .where(eq(companies.id, id))
      .returning();

    return company as unknown as Company;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(companies).where(eq(companies.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
