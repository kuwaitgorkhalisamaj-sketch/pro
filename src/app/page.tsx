

'use client';

import React from 'react';
import { AnnouncementCard } from "@/components/announcement-card";
import { PageHeader } from "@/components/page-header";
import { AddAnnouncementDialog } from '@/components/add-announcement-dialog';
import { useSearch } from '@/context/SearchContext';


const initialAnnouncements = [
  {
    title: "Annual General Meeting 2024",
    author: "Admin",
    date: "July 15, 2024",
    content: `Dear Kuwait Gorkhali Samaj Members,\n\nWe are pleased to announce our Annual General Meeting for the year 2024. This meeting is a crucial event for our community where we will discuss the achievements of the past year, our financial status, and our plans for the future.\n\nDate: August 25, 2024\nTime: 4:00 PM - 7:00 PM\nVenue: Community Hall, Abbasiya\n\nAgenda:\n1. Welcome Speech by the President\n2. Presentation of the Annual Report 2023-2024\n3. Financial Report and Audit Statement\n4. Election of New Committee Members for 2024-2026\n5. Open discussion and Q&A session\n6. Closing remarks and refreshments\n\nYour presence and participation are highly valuable. It's an opportunity to voice your opinions, contribute to our community's growth, and elect the leaders who will guide us for the next two years. We encourage all members to attend and make this event a success. Please confirm your attendance by August 20th to help us with arrangements. Thank you for your continued support.`,
    mediaUrl: "https://picsum.photos/seed/meeting/800/400",
    mediaType: "image",
    imageHint: "community meeting"
  },
  {
    title: "Cultural Event & Blood Donation Drive",
    author: "Admin",
    date: "July 10, 2024",
    content: `Join us for a day of culture, community, and charity! We are organizing a grand cultural event followed by a blood donation drive. It's a chance to celebrate our heritage and give back to society.\n\nEvent Date: September 5, 2024\nVenue: Indian Central School, Abbasiya\n\nHighlights:\n- Traditional dance and music performances\n- Food stalls with authentic Nepali cuisine\n- Fun activities for children and families\n- Blood donation camp in collaboration with Kuwait Central Blood Bank\n\nWe invite all members and their families to participate. Let's come together to make a difference.`,
  },
   {
    title: "Membership Renewal Reminder",
    author: "Admin",
    date: "July 1, 2024",
    content: "This is a friendly reminder to all members that the annual membership fee is due. Please renew your membership by July 31st to continue enjoying the benefits and supporting our community activities. You can pay online through our app or contact the treasurer.",
  },
];

export default function DashboardPage() {
  const { searchQuery } = useSearch();
  const announcements = initialAnnouncements;
  
  const filteredAnnouncements = searchQuery
    ? announcements.filter(announcement =>
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : announcements;

  return (
    <>
      <PageHeader
        title="Announcements"
        description="Stay updated with the latest news and events."
      >
        <AddAnnouncementDialog />
      </PageHeader>
      <div className="grid gap-6">
        {filteredAnnouncements.map((announcement, index) => (
          <AnnouncementCard key={index} {...announcement} />
        ))}
      </div>
    </>
  );
}
