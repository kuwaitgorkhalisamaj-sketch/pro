
'use server';

import { summarizeAnnouncement } from '@/ai/flows/summarize-announcements';
import type { SummarizeAnnouncementInput, SummarizeAnnouncementOutput } from '@/ai/flows/summarize-announcements';

export async function getSummary(input: SummarizeAnnouncementInput): Promise<string> {
  const output = await summarizeAnnouncement(input);
  return output.summary;
}
