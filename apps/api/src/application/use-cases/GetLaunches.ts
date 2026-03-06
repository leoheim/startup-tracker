import { ILaunchRepository } from '../../domain/interfaces/ILaunchRepository';
import { Launch } from '../../domain/entities/Launch';

export interface GetLaunchesInput {
  limit?: number;
  offset?: number;
  performanceTier?: 'low' | 'medium' | 'high';
  companyId?: string;
}

export class GetLaunchesUseCase {
  constructor(private launchRepository: ILaunchRepository) {}

  async execute(input: GetLaunchesInput = {}): Promise<Launch[]> {
    const { limit = 50, offset = 0, performanceTier, companyId } = input;

    if (companyId) {
      return await this.launchRepository.findByCompany(companyId);
    }

    if (performanceTier) {
      return await this.launchRepository.findByPerformanceTier(performanceTier);
    }

    return await this.launchRepository.findAll(limit, offset);
  }
}
