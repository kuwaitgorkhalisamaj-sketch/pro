
'use client';

import { useMemo, useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, MapPin, Calendar as CalendarIcon, Filter, UploadCloud, ImageIcon } from "lucide-react";
import Image from 'next/image';
import { useSearch } from '@/context/SearchContext';

const initialEvents = [
  {
    title: "Annual General Meeting 2024",
    date: "August 25, 2024",
    location: "Community Hall, Abbasiya",
    description: "Discussing yearly progress and future plans. Election for the new committee will be held.",
    mediaUrl: "https://picsum.photos/seed/event1/800/400",
    mediaType: "image",
    imageHint: "community meeting hall"
  },
  {
    title: "Cultural Event & Blood Donation",
    date: "September 5, 2024",
    location: "Indian Central School, Abbasiya",
    description: "Celebrate our heritage and contribute to a noble cause.",
    mediaUrl: "https://picsum.photos/seed/event2/800/400",
    mediaType: "image",
    imageHint: "cultural festival"
  },
  {
    title: "Dashain & Tihar Celebration",
    date: "October 20, 2024",
    location: "Fintas Park",
    description: "Join us for a grand celebration of our biggest festivals with food, music, and family fun.",
    mediaUrl: "https://picsum.photos/seed/event3/800/400",
    mediaType: "image",
    imageHint: "outdoor festival park"
  }
];

type Event = typeof initialEvents[0];

export default function EventsPage() {
  const { searchQuery } = useSearch();
  const [events, setEvents] = useState(initialEvents);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', location: '', mediaUrl: '', mediaType: 'image', imageHint: '' });
  const { toast } = useToast();

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.location) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please fill out all fields to add a new event.",
        });
        return;
    }
    setEvents([newEvent, ...events]);
    setNewEvent({ title: '', description: '', date: '', location: '', mediaUrl: '', mediaType: 'image', imageHint: '' });
    setIsAddDialogOpen(false);
    toast({
        title: "Event Added",
        description: "The new event has been successfully added.",
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewEvent({
          ...newEvent,
          mediaUrl: e.target?.result as string,
          mediaType: file.type.startsWith('image') ? 'image' : 'video',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const sortEvents = () => {
    const sortedEvents = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setEvents(sortedEvents);
    toast({
      title: "Events Sorted",
      description: "Events have been sorted from newest to oldest.",
    });
  };

  const showToast = (title: string, description: string) => {
    toast({ title, description });
  };
  
  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailDialogOpen(true);
  };


  const filteredEvents = useMemo(() => {
    if (!searchQuery) {
      return events;
    }
    return events.filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, events]);

  return (
    <>
      <PageHeader
        title="Events"
        description="Find and register for upcoming community events."
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={sortEvents}>
            <Filter className="mr-2" />
            Filter
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new community event.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="col-span-3"
                    placeholder="Event Title"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="col-span-3"
                    placeholder="Describe the event..."
                    rows={4}
                  />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="col-span-3"
                    placeholder="e.g., November 15, 2024"
                  />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="col-span-3"
                    placeholder="e.g., Fintas Park"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="event-image-upload" className="text-right">Image</Label>
                    <div className="col-span-3">
                         <Button variant="outline" asChild>
                            <label htmlFor="event-image-upload" className="cursor-pointer flex items-center w-full justify-center">
                                <UploadCloud className="mr-2 h-4 w-4" /> Upload Image
                            </label>
                        </Button>
                        <Input id="event-image-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </div>
                </div>
                {newEvent.mediaUrl && (
                     <div className="grid grid-cols-4 items-center gap-4">
                        <div className="col-start-2 col-span-3">
                           <Image src={newEvent.mediaUrl} alt="Event preview" width={100} height={100} className="rounded-md object-cover" />
                        </div>
                    </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddEvent}>Create Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold font-headline">Upcoming Events</h2>
            {filteredEvents.length > 0 ? filteredEvents.map((event, index) => (
              <Card key={index}>
                {event.mediaUrl && (
                  <CardContent className="p-0">
                    <Image
                      src={event.mediaUrl}
                      alt={event.title}
                      width={800}
                      height={400}
                      data-ai-hint={event.imageHint}
                      className="w-full aspect-video object-cover"
                    />
                  </CardContent>
                )}
                <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground pt-2">
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="line-clamp-2">{event.description}</p>
                </CardContent>
                <CardFooter className="flex-wrap gap-2">
                    <Button onClick={() => handleViewDetails(event)}>View Details</Button>
                    <Button variant="outline" className="ml-auto sm:ml-2" onClick={() => showToast('Added to Calendar', 'This event has been added to your device calendar.')}>Add to Calendar</Button>
                </CardFooter>
              </Card>
            )) : (
              <Card>
                <CardContent>
                  <p className="text-muted-foreground py-4 text-center">No events found matching your search.</p>
                </CardContent>
              </Card>
            )}
        </div>
        <div className="space-y-6 lg:col-span-1">
             <h2 className="text-xl font-semibold font-headline">Event Calendar</h2>
             <Card className="flex justify-center">
                <Calendar
                    mode="single"
                    className="p-0"
                />
             </Card>
        </div>
      </div>

       <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedEvent.title}</DialogTitle>
                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{selectedEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedEvent.location}</span>
                    </div>
                </div>
              </DialogHeader>
              <div className="py-4 space-y-4">
                {selectedEvent.mediaUrl && (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={selectedEvent.mediaUrl}
                      alt={selectedEvent.title}
                      fill
                      className="object-cover"
                      data-ai-hint={selectedEvent.imageHint}
                    />
                  </div>
                )}
                <p className="text-foreground/80 whitespace-pre-wrap">
                  {selectedEvent.description}
                </p>
              </div>
               <DialogFooter className="flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => showToast('Added to Calendar', 'This event has been added to your device calendar.')}>Add to Calendar</Button>
                  <Button onClick={() => setIsDetailDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
