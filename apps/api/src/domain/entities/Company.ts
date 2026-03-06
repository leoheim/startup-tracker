export interface Company {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  foundedDate?: Date;
  employeeCount?: number;
  crunchbaseUrl?: string;
  ycBatch?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompanyInput {
  name: string;
  website?: string;
  industry?: string;
  foundedDate?: Date;
  employeeCount?: number;
  crunchbaseUrl?: string;
  ycBatch?: string;
  metadata?: Record<string, any>;
}
