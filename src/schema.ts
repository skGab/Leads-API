import { z } from 'zod';

export const clientSchema = z.object({
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
