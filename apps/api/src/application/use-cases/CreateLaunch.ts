import { ILaunchRepository } from '../../domain/interfaces/ILaunchRepository';
import { ICompanyRepository } from '../../domain/interfaces/ICompanyRepository';
import { Launch, CreateLaunchInput } from '../../domain/entities/Launch';

export class CreateLaunchUseCase {
  constructor(
    private launchRepository: ILaunchRepository,
    private companyRepository: ICompanyRepository
  ) {}

  async execute(input: CreateLaunchInput): Promise<Launch> {
    // Validate company exists
    const company = await this.companyRepository.findById(input.companyId);
    if (!company) {
      throw new Error(`Company with id ${input.companyId} not found`);
    }

    // Check if launch already exists
    const existing = await this.launchRepository.findByUrl(input.postUrl);
    if (existing) {
      throw new Error(`Launch with URL ${input.postUrl} already exists`);
    }

    // Create launch
    return await this.launchRepository.create(input);
  }
}
