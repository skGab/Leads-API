import { z } from 'zod';

export const leadSchema = z.object({
  leads: z
    .array(
      z.object({
        id: z.string().nullable(),
        email: z.string().nullable(),
        name: z.string().nullable(),
        company: z.string().nullable(),
        job_title: z.string().nullable(),
        bio: z.string().nullable(),
        public_url: z.string().nullable(),
        created_at: z.string().nullable(),
        opportunity: z.string().nullable(),
        number_conversions: z.string().nullable(),
        user: z.string().nullable(),
        website: z.string().nullable(),
        personal_phone: z.string().nullable(),
        mobile_phone: z.string().nullable(),
        city: z.string().nullable(),
        state: z.string().nullable(),
        lead_stage: z.string().nullable(),
        last_marked_opportunity_date: z.string().nullable(),
        uuid: z.string().nullable(),
        fit_score: z.string().nullable(),
        first_conversion: z.unknown().nullable(),
        last_conversion: z.unknown().nullable(),
        tags: z.unknown().nullable(),
        custom_fields: z.unknown().nullable(),
      })
    )
    .nonempty(),
});

export const db_clienteSchema = [
  { name: 'id', type: 'STRING', mode: 'NULLABLE' },
  { name: 'email', type: 'STRING', mode: 'NULLABLE' },
  { name: 'name', type: 'STRING', mode: 'NULLABLE' },
  { name: 'company', type: 'STRING', mode: 'NULLABLE' },
  { name: 'job_title', type: 'STRING', mode: 'NULLABLE' },
  { name: 'bio', type: 'STRING', mode: 'NULLABLE' },
  { name: 'public_url', type: 'STRING', mode: 'NULLABLE' },
  { name: 'created_at', type: 'TIMESTAMP', mode: 'NULLABLE' },
  { name: 'opportunity', type: 'BOOLEAN', mode: 'NULLABLE' },
  { name: 'number_conversions', type: 'FLOAT', mode: 'NULLABLE' },
  { name: 'user', type: 'STRING', mode: 'NULLABLE' },
  { name: 'website', type: 'STRING', mode: 'NULLABLE' },
  { name: 'personal_phone', type: 'STRING', mode: 'NULLABLE' },
  { name: 'mobile_phone', type: 'STRING', mode: 'NULLABLE' },
  { name: 'city', type: 'STRING', mode: 'NULLABLE' },
  { name: 'state', type: 'STRING', mode: 'NULLABLE' },
  { name: 'lead_stage', type: 'STRING', mode: 'NULLABLE' },
  { name: 'last_marked_opportunity_date', type: 'TIMESTAMP', mode: 'NULLABLE' },
  { name: 'uuid', type: 'STRING', mode: 'NULLABLE' },
  { name: 'fit_score', type: 'STRING', mode: 'NULLABLE' },
  { name: 'timestamp', type: 'TIMESTAMP', mode: 'NULLABLE' },
];

export const db_tempSchema = [
  { name: 'id', type: 'STRING', mode: 'NULLABLE' },
  { name: 'opportunity', type: 'BOOLEAN', mode: 'NULLABLE' },
  { name: 'lead_stage', type: 'STRING', mode: 'NULLABLE' },
  { name: 'timestamp', type: 'TIMESTAMP', mode: 'NULLABLE' },
];
