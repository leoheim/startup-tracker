-- Create all tables for startup-tracker

CREATE TABLE IF NOT EXISTS companies (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	name varchar(255) NOT NULL,
	website varchar(500),
	industry varchar(100),
	founded_date date,
	employee_count integer,
	crunchbase_url varchar(500),
	yc_batch varchar(20),
	metadata jsonb,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS funding_rounds (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	company_id uuid NOT NULL,
	round_type varchar(50),
	amount_raised numeric(15, 2),
	currency varchar(10) DEFAULT 'USD',
	announced_date date,
	investors jsonb,
	source varchar(100),
	source_url varchar(500),
	created_at timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS launches (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	company_id uuid NOT NULL,
	platform varchar(20) NOT NULL,
	post_url varchar(500) NOT NULL,
	post_id varchar(255),
	content text,
	video_url varchar(500),
	author_handle varchar(255),
	published_at timestamp,
	likes_count integer DEFAULT 0,
	comments_count integer DEFAULT 0,
	shares_count integer DEFAULT 0,
	views_count integer DEFAULT 0,
	engagement_score numeric(10, 2),
	performance_tier varchar(20),
	raw_data jsonb,
	last_scraped_at timestamp,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT launches_post_url_unique UNIQUE(post_url)
);

CREATE TABLE IF NOT EXISTS contacts (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	company_id uuid NOT NULL,
	launch_id uuid,
	full_name varchar(255),
	role varchar(255),
	email varchar(255),
	phone varchar(50),
	linkedin_url varchar(500),
	twitter_handle varchar(255),
	enrichment_source varchar(100),
	enrichment_confidence numeric(3, 2),
	enriched_at timestamp,
	metadata jsonb,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS dm_campaigns (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	launch_id uuid NOT NULL,
	contact_id uuid NOT NULL,
	platform varchar(20),
	message_template text,
	generated_message text,
	status varchar(50) DEFAULT 'draft',
	sent_at timestamp,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL
);

-- Add foreign keys
ALTER TABLE funding_rounds ADD CONSTRAINT funding_rounds_company_id_companies_id_fk
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE cascade;

ALTER TABLE launches ADD CONSTRAINT launches_company_id_companies_id_fk
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE cascade;

ALTER TABLE contacts ADD CONSTRAINT contacts_company_id_companies_id_fk
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE cascade;

ALTER TABLE contacts ADD CONSTRAINT contacts_launch_id_launches_id_fk
  FOREIGN KEY (launch_id) REFERENCES launches(id) ON DELETE set null;

ALTER TABLE dm_campaigns ADD CONSTRAINT dm_campaigns_launch_id_launches_id_fk
  FOREIGN KEY (launch_id) REFERENCES launches(id) ON DELETE cascade;

ALTER TABLE dm_campaigns ADD CONSTRAINT dm_campaigns_contact_id_contacts_id_fk
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE cascade;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_launches_company ON launches(company_id);
CREATE INDEX IF NOT EXISTS idx_launches_platform ON launches(platform);
CREATE INDEX IF NOT EXISTS idx_launches_published ON launches(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_launches_performance ON launches(performance_tier);
CREATE INDEX IF NOT EXISTS idx_funding_company ON funding_rounds(company_id);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company_id);
