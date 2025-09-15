
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DigitalIdCard } from "@/components/digital-id-card";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/context/ProfileContext";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
    const { profile, setProfile } = useProfile();
    const { toast } = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [id]: value,
        }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prevProfile => ({
                    ...prevProfile,
                    avatarUrl: reader.result as string,
                }));
            }
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = () => {
        localStorage.setItem('userProfile', JSON.stringify(profile));
        toast({
            title: "Profile Updated",
            description: "Your information has been successfully saved.",
        });
    };

  return (
    <>
      <div className="grid grid-cols-1 gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>You can view and edit your profile details here. This information is private.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <DigitalIdCard 
                    name={profile.fullName}
                    email={profile.email}
                    bloodGroup={profile.bloodGroup}
                    avatarUrl={profile.avatarUrl}
                    onAvatarChange={handleAvatarChange}
                    role="Admin"
                />
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" value={profile.fullName} onChange={handleInputChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value={profile.email} onChange={handleInputChange} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" value={profile.phone} onChange={handleInputChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Input id="bloodGroup" value={profile.bloodGroup} onChange={handleInputChange} />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="address">Address in Kuwait</Label>
                    <Input id="address" value={profile.address} onChange={handleInputChange} />
                </div>
                <div className="flex justify-end pt-2">
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
