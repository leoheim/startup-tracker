export interface FundingRound {
  id: string;
  companyId: string;
  roundType?: string; // Seed, Series A, B, C, etc.
  amountRaised?: number;
  currency: string;
  announcedDate?: Date;
  investors?: any[];
  source?: string;
  sourceUrl?: string;
  createdAt: Date;
}

export interface CreateFundingRoundInput {
  companyId: string;
  roundType?: string;
  amountRaised?: number;
  currency?: string;
  announcedDate?: Date;
  investors?: any[];
  source?: string;
  sourceUrl?: string;
}
