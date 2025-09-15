
'use client';

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ImageIcon, VideoIcon } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { DialogFooter } from './ui/dialog';

export function AddAnnouncementForm({ setDialogOpen }: { setDialogOpen: (open: boolean) => void }) {
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', mediaUrl: '', mediaType: '' });
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewAnnouncement({
          ...newAnnouncement,
          mediaUrl: e.target?.result as string,
          mediaType: file.type.startsWith('image') ? 'image' : 'video',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return;
    
    // In a real app, you'd call a server action here to persist the announcement.
    console.log("Adding announcement:", newAnnouncement);

    setNewAnnouncement({ title: '', content: '', mediaUrl: '', mediaType: '' });
    setDialogOpen(false);
  };

  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title
          </Label>
          <Input
            id="title"
            value={newAnnouncement.title}
            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
            className="col-span-3"
            placeholder="Announcement Title"
          />
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="content" className="text-right pt-2">
            Content
          </Label>
          <Textarea
            id="content"
            value={newAnnouncement.content}
            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
            className="col-span-3"
            placeholder="Write the announcement details here."
            rows={6}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Media</Label>
          <div className="col-span-3 flex gap-2">
              <input type="file" ref={photoInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <input type="file" ref={videoInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />
              <Button variant="outline" size="sm" onClick={() => photoInputRef.current?.click()}>
                  <ImageIcon className="mr-2" /> Add Photo
              </Button>
               <Button variant="outline" size="sm" onClick={() => videoInputRef.current?.click()}>
                  <VideoIcon className="mr-2" /> Add Video
              </Button>
          </div>
        </div>
         {newAnnouncement.mediaUrl && (
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right"></Label>
                  <div className="col-span-3">
                    {newAnnouncement.mediaType === 'image' ? (
                      <Image src={newAnnouncement.mediaUrl} alt="Preview" width={100} height={100} className="rounded-md object-cover" />
                    ) : (
                      <div className="text-sm text-muted-foreground">Video selected.</div>
                    )}
                  </div>
              </div>
          )}
      </div>
      <DialogFooter>
        <Button type="submit" onClick={handleAddAnnouncement}>Post Announcement</Button>
      </DialogFooter>
    </>
  );
}
