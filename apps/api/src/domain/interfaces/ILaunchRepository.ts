import { Launch, CreateLaunchInput } from '../entities/Launch';

export interface ILaunchRepository {
  findById(id: string): Promise<Launch | null>;
  findByUrl(url: string): Promise<Launch | null>;
  findByCompany(companyId: string): Promise<Launch[]>;
  findAll(limit?: number, offset?: number): Promise<Launch[]>;
  findByPerformanceTier(tier: 'low' | 'medium' | 'high'): Promise<Launch[]>;
  create(input: CreateLaunchInput): Promise<Launch>;
  update(id: string, input: Partial<Launch>): Promise<Launch>;
  delete(id: string): Promise<boolean>;
}
