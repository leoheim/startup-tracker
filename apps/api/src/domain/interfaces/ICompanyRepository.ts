import { Company, CreateCompanyInput } from '../entities/Company';

export interface ICompanyRepository {
  findById(id: string): Promise<Company | null>;
  findByName(name: string): Promise<Company | null>;
  findAll(limit?: number, offset?: number): Promise<Company[]>;
  create(input: CreateCompanyInput): Promise<Company>;
  update(id: string, input: Partial<CreateCompanyInput>): Promise<Company>;
  delete(id: string): Promise<boolean>;
}
