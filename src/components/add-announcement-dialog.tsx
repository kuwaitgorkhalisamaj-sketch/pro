
'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AddAnnouncementForm } from '@/components/add-announcement-form';


export function AddAnnouncementDialog() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2" />
          Add Announcement
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Announcement</DialogTitle>
          <DialogDescription>
            Create a new announcement to share with the community.
          </DialogDescription>
        </DialogHeader>
        <AddAnnouncementForm setDialogOpen={setIsDialogOpen} />
      </DialogContent>
    </Dialog>
  );
}
