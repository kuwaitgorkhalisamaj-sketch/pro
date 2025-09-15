
'use client';

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Shield, Ambulance } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


const emergencyContacts = [
    { name: "KGS Helpline", number: "+965 9876 5432", icon: Shield },
    { name: "Embassy of India", number: "+965 2532 1604", icon: Phone },
    { name: "Kuwait Emergency (Police/Ambulance)", number: "112", icon: Ambulance },
]

export default function SupportPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!subject || !message) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill out both the subject and message.',
      });
      return;
    }

    // In a real app, this would send the data to a backend service.
    // For this prototype, we'll just show a confirmation.
    toast({
      title: 'Feedback Submitted',
      description: "Thank you! We've received your message.",
    });

    // Clear the form
    setSubject('');
    setMessage('');
  };


  return (
    <>
      <PageHeader
        title="Support & Help Desk"
        description="Find emergency contacts or send us your feedback."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Feedback & Support Form</CardTitle>
                    <CardDescription>Have a question, suggestion, or need help? Let us know.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input 
                            id="subject" 
                            placeholder="e.g., Membership Inquiry" 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea 
                            id="message" 
                            placeholder="Please describe your issue or feedback in detail." 
                            rows={6} 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSubmit}>Submit</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div>
            <h2 className="text-xl font-semibold font-headline mb-4">Emergency Contacts</h2>
            <Card>
                <CardContent className="p-4 space-y-4">
                    {emergencyContacts.map((contact, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <contact.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold">{contact.name}</p>
                                <a href={`tel:${contact.number}`} className="text-muted-foreground hover:text-primary transition-colors">
                                    {contact.number}
                                </a>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}
