
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Sparkles, LoaderCircle } from 'lucide-react';
import { getSummary } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from './ui/badge';

type AnnouncementCardProps = {
  title: string;
  author: string;
  date: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | string;
  imageHint?: string;
};

const ANNOUNCEMENT_LENGTH_THRESHOLD = 500; // Characters

export function AnnouncementCard({ title, author, date, content, mediaUrl, mediaType, imageHint }: AnnouncementCardProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getSummary({ announcementText: content });
      setSummary(result);
    } catch (e) {
      setError('Failed to generate summary.');
    } finally {
      setIsLoading(false);
    }
  };

  const isLongAnnouncement = content.length > ANNOUNCEMENT_LENGTH_THRESHOLD;
  const displayText = summary || content;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Posted by {author} on {date}
        </CardDescription>
      </CardHeader>
       {mediaUrl && (
        <CardContent className="p-0">
          {mediaType === 'image' ? (
            <Image
              src={mediaUrl}
              alt={title}
              width={800}
              height={400}
              data-ai-hint={imageHint || 'announcement image'}
              className="w-full aspect-video object-cover"
            />
          ) : (
            <video
              src={mediaUrl}
              controls
              className="w-full aspect-video"
            />
          )}
        </CardContent>
      )}
      <CardContent className="prose prose-sm dark:prose-invert max-w-none text-foreground/80 whitespace-pre-wrap pt-6">
        <p>{displayText}</p>
        {summary && (
          <Badge variant="secondary" className="mt-4">
            <Sparkles className="mr-2 h-3 w-3 text-yellow-400" />
            Summarized by AI
          </Badge>
        )}
        {error && <p className="text-destructive mt-2 text-sm">{error}</p>}
      </CardContent>
      <CardFooter>
        {isLongAnnouncement && !summary && (
          <Button onClick={handleSummarize} disabled={isLoading} size="sm">
            {isLoading ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Summarizing...' : 'Summarize with AI'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
