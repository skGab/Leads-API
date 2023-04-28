import { z } from 'zod';
import { leadSchema } from './schema';
import { InsertRowsResponse } from '@google-cloud/bigquery';

export interface Auth {
  keyFilename: string;
  projectId: string;
}

export type Cliente = Record<string, string>;

export interface Clientes {
  leads: Cliente[];
}

export interface CoreDataItem {
  id: string;
  email: string;
  name: string;
  company: string;
  job_title: string;
  bio: string;
  public_url: string;
  created_at: Date | null;
  opportunity: boolean;
  number_conversions: number | null;
  user: string;
  website: string;
  personal_phone: string;
  mobile_phone: string;
  city: string;
  state: string;
  lead_stage: string;
  last_marked_opportunity_date: Date | null;
  uuid: string;
  fit_score: string;
  timestamp: Date | null;
}

export type CoreData = CoreDataItem[];

export interface LeadSearched {
  id: string;
  lead_stage: string;
  opportunity: boolean;
  timestamp: Date | null;
}

export type Lead = z.infer<typeof leadSchema>['leads'][number];

export interface LeadFilterResult {
  coreData: CoreDataItem;
  otherData: Record<string, any>;
}

// Extend the InsertRowsResponse type to include insertErrors
export interface ExtendedInsertRowsResponse extends InsertRowsResponse {
  insertErrors?: {
    index: number;
    errors: any[];
  }[];
}
