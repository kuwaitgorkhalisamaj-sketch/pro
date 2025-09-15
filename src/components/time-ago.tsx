
'use client';

import { useState, useEffect } from 'react';

function calculateTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    let interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      const days = Math.floor(interval);
      return days === 1 ? "1 day ago" : `${days} days ago`;
    }
    interval = seconds / 3600;
    if (interval > 1) {
        const hours = Math.floor(interval);
        return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    }
    interval = seconds / 60;
    if (interval > 1) {
        const minutes = Math.floor(interval);
        return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    }
    return "Just now";
}

export function TimeAgo({ dateString }: { dateString: string }) {
    const [timeAgo, setTimeAgo] = useState<string | null>(null);

    useEffect(() => {
        // These will only run on the client, after initial hydration
        setTimeAgo(calculateTimeAgo(dateString));

        // Optional: set an interval to update the time periodically
        const intervalId = setInterval(() => {
            setTimeAgo(calculateTimeAgo(dateString));
        }, 60000); // update every minute

        return () => clearInterval(intervalId);
    }, [dateString]);
    
    return <>{timeAgo}</>;
}
