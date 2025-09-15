
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Camera } from "lucide-react";
import Image from 'next/image';

type DigitalIdCardProps = {
  name?: string;
  email?: string;
  bloodGroup?: string;
  avatarUrl?: string;
  onAvatarChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  role?: string;
};

export function DigitalIdCard({
  name = "Member Name",
  email = "member@email.com",
  bloodGroup = "O+",
  avatarUrl = "https://picsum.photos/200/200",
  onAvatarChange,
  role = "Admin",
}: DigitalIdCardProps) {
  const memberId = "KGS-2024-12345";
  const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${name}
ORG:Kuwait Gorkhali Samaj
TITLE:Member
EMAIL:${email}
NOTE:Member ID: ${memberId}\\nBlood Group: ${bloodGroup}
END:VCARD`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(vCardData)}`;

  return (
    <Card className="max-w-md mx-auto overflow-hidden">
      <div className="bg-primary/10 relative p-4 md:p-6">
         <div 
            className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.1%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M0%2040L40%200H20L0%2020M40%2040V20L20%2040%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')]"
         ></div>
        <div className="flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            <span className="font-semibold text-primary font-headline text-sm md:text-base">Kuwait Gorkhali Samaj</span>
          </div>
          <span className="text-xs font-semibold text-primary/80">MEMBER</span>
        </div>
      </div>
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="relative group flex-shrink-0">
            <div className="relative h-28 w-28">
              <Image src={avatarUrl} fill sizes="7rem" objectFit="cover" className="rounded-md" alt="Member Photo" data-ai-hint="person face" />
            </div>
            <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-8 w-8 text-white" />
            </label>
            <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={onAvatarChange} />
          </div>
          <div className="sm:ml-4">
            <p className="text-sm font-medium text-muted-foreground tracking-wider">DIGITAL ID</p>
            <h2 className="text-xl font-bold font-headline">{name}</h2>
            <p className="text-muted-foreground text-sm">{email}</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Member ID</p>
            <p className="font-semibold">{memberId}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Blood Group</p>
            <p className="font-semibold">{bloodGroup}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Member Since</p>
            <p className="font-semibold">Jan 20, 2022</p>
          </div>
          <div>
            <p className="text-muted-foreground">Role</p>
            <p className="font-semibold">{role}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
            <Image src={qrCodeUrl} data-ai-hint="qr code" alt="QR Code for member verification" width="120" height="120" />
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">Scan for verification</p>
      </CardContent>
    </Card>
  );
}
