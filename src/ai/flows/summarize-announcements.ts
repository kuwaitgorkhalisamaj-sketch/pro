
'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing lengthy announcements.
 *
 * - summarizeAnnouncement - A function that summarizes an announcement if it exceeds a certain length.
 * - SummarizeAnnouncementInput - The input type for the summarizeAnnouncement function, containing the announcement text.
 * - SummarizeAnnouncementOutput - The return type for the summarizeAnnouncement function, containing the summary or the original text.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAnnouncementInputSchema = z.object({
  announcementText: z.string().describe('The text of the announcement to be summarized.'),
});
export type SummarizeAnnouncementInput = z.infer<typeof SummarizeAnnouncementInputSchema>;

const SummarizeAnnouncementOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the announcement, or the original text if no summary is needed.'),
});
export type SummarizeAnnouncementOutput = z.infer<typeof SummarizeAnnouncementOutputSchema>;

export async function summarizeAnnouncement(input: SummarizeAnnouncementInput): Promise<SummarizeAnnouncementOutput> {
  return summarizeAnnouncementFlow(input);
}

const shouldSummarizeTool = ai.defineTool({
  name: 'shouldSummarize',
  description: 'Determines if an announcement is long enough to warrant summarization.',
  inputSchema: z.object({
    text: z.string().describe('The announcement text.'),
    maxLength: z.number().describe('The maximum length of the announcement before summarization is needed.').default(100),
  }),
  outputSchema: z.boolean().describe('True if the announcement should be summarized, false otherwise.'),
}, async (input) => {
  return input.text.length > input.maxLength;
});

const summarizePrompt = ai.definePrompt({
  name: 'summarizeAnnouncementPrompt',
  input: {schema: SummarizeAnnouncementInputSchema},
  output: {schema: SummarizeAnnouncementOutputSchema},
  tools: [shouldSummarizeTool],
  system: `You are an expert summarizer who can create concise summaries of announcements.

  Your task is to decide if a summary is needed and then act accordingly.

  1.  Call the \`shouldSummarize\` tool with the provided announcement text.
  2.  If the tool returns \`true\`, you MUST generate a concise and informative summary of the text and return it in the \`summary\` field.
  3.  If the tool returns \`false\`, you MUST return the original, unmodified announcement text in the \`summary\` field.
  `,
  prompt: `Announcement: {{{announcementText}}}`,
});

const summarizeAnnouncementFlow = ai.defineFlow(
  {
    name: 'summarizeAnnouncementFlow',
    inputSchema: SummarizeAnnouncementInputSchema,
    outputSchema: SummarizeAnnouncementOutputSchema,
  },
  async input => {
    const {output} = await summarizePrompt(input);
    return output!;
  }
);
