export interface Contact {
  id: string;
  companyId: string;
  launchId?: string;
  fullName?: string;
  role?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  twitterHandle?: string;
  enrichmentSource?: string;
  enrichmentConfidence?: number;
  enrichedAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateContactInput {
  companyId: string;
  launchId?: string;
  fullName?: string;
  role?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  twitterHandle?: string;
  enrichmentSource?: string;
  enrichmentConfidence?: number;
  metadata?: Record<string, any>;
}
