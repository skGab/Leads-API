import { z } from 'zod';
import { leadSchema } from './schema';
import { InsertRowsResponse } from '@google-cloud/bigquery';

// Interface representing authentication-related information
export interface Auth {
  keyFilename: string;
  projectId: string;
}

// Type representing a record object with string keys and string values, likely representing a client entity.
export type Cliente = Record<string, string>;

// Interface representing an object with a property 'leads' which is an array of 'Cliente' objects, likely representing a collection of client data.
export interface Clientes {
  leads: Cliente[];
}

// Interface representing core data for an item, such as lead information.
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

// Type representing an array of 'CoreDataItem' objects, likely representing a collection of core data items.
export type CoreData = CoreDataItem[];

// Interface representing searched lead data with specific properties.
export interface LeadSearched {
  id: string;
  lead_stage: string;
  opportunity: boolean;
  timestamp: Date | null;
}

// Type representing the inferred type of 'leadSchema.leads' array elements, likely representing a single lead entity with properties defined in the 'leadSchema'.
export type Lead = z.infer<typeof leadSchema>['leads'][number];

// Interface representing the result of filtering leads, with coreData containing core data of the lead and otherData containing additional data in the form of key-value pairs.
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
