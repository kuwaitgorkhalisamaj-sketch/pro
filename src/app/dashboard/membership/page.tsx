
'use client';

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useProfile } from "@/context/ProfileContext";
import { Separator } from "@/components/ui/separator";


// This would be controlled by a real authentication and role system.
// The "Platform Administrator" has the highest level of access.
const currentRole = "Platform Administrator"; 
const isPlatformAdmin = currentRole === "Platform Administrator";

const members = [
  {
    id: "KGS-ADMIN-001",
    name: "Admin User",
    avatarUrl: "https://picsum.photos/seed/k/100/100",
    avatarHint: "admin avatar",
    status: "Active",
    role: "President",
  },
  {
    id: "KGS-2024-12346",
    name: "John Doe",
    avatarUrl: "https://picsum.photos/seed/b/100/100",
    avatarHint: "man face",
    status: "Active",
    role: "Member",
  },
  {
    id: "KGS-2023-12347",
    name: "Jane Smith",
    avatarUrl: "https://picsum.photos/seed/c/100/100",
    avatarHint: "woman face",
    status: "Active",
    role: "Member",
  },
   {
    id: "KGS-2024-12348",
    name: "Peter Jones",
    avatarUrl: "https://picsum.photos/seed/d/100/100",
    avatarHint: "person glasses",
    status: "Inactive",
    role: "Member",
  },
];

function YourMembershipCard() {
    const { profile } = useProfile();
    const yourMemberInfo = {
        id: "KGS-2024-12345",
        name: profile.fullName,
        avatarUrl: profile.avatarUrl,
        avatarHint: "person avatar",
        status: "Active",
        role: "Member",
    };
    return (
        <MemberCard {...yourMemberInfo} isCurrentUser={true} />
    );
}

type MemberCardProps = {
    id: string;
    name: string;
    avatarUrl: string;
    avatarHint: string;
    status: string;
    role: string;
    isCurrentUser?: boolean;
}

function MemberCard({ id, name, avatarUrl, avatarHint, status, role, isCurrentUser = false }: MemberCardProps) {
    return (
        <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
                <Avatar>
                    <AvatarImage src={avatarUrl} data-ai-hint={avatarHint} />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-muted-foreground">{id}</p>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <Badge variant={status === 'Active' ? 'secondary' : 'outline'}
                        className={status === 'Active' 
                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                            : 'border-amber-500 text-amber-500'}>
                    {status}
                </Badge>
                {isCurrentUser && (
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard/profile">View</Link>
                    </Button>
                )}
            </div>
        </div>
    )
}

export default function MembershipPage() {
  return (
    <>
      <PageHeader
        title="Membership & Payments"
        description="Manage your membership details and view payment history."
      />
      <div className="grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Members Directory</CardTitle>
                <CardDescription>Browse the community member list.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-border">
                    <YourMembershipCard />
                    {members.map((member) => (
                        <MemberCard key={member.id} {...member} />
                    ))}
                </div>
            </CardContent>
        </Card>

        {isPlatformAdmin && (
           <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Funds</CardTitle>
                  <span className="text-xs text-muted-foreground font-bold">KD</span>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold">KWD 45,231.89</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold">+2350</div>
                  <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                </CardContent>
              </Card>
           </div>
        )}
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Your Membership</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                           <CheckCircle className="mr-2 h-4 w-4" /> Active
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Member Since</span>
                        <span>January 20, 2022</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Expires On</span>
                        <span>January 15, 2025</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Next Payment</CardTitle>
                    <CardDescription>Your next annual membership fee is due soon.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Due Date</span>
                        <span className="font-semibold">January 15, 2025</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-semibold">KWD 12.00</span>
                    </div>
                     <Button className="w-full">Pay Now</Button>
                </CardContent>
            </Card>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>A record of your past membership payments.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-border">
                    {paymentHistory.map((payment) => (
                    <div key={payment.id} className="p-4 grid grid-cols-3 gap-2 items-center">
                        <div className="col-span-2">
                            <p className="font-medium">{payment.id}</p>
                            <p className="text-sm text-muted-foreground">{payment.date}</p>
                        </div>
                        <div className="text-right">
                             <p className="font-semibold">{payment.amount}</p>
                             <Badge variant="outline" className="border-green-500 text-green-500 mt-1">{payment.status}</Badge>
                        </div>
                    </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </>
  );
}

const paymentHistory = [
  { id: "PAY-2024-001", date: "2024-01-15", amount: "KWD 12.00", status: "Paid" },
  { id: "PAY-2023-001", date: "2023-01-20", amount: "KWD 12.00", status: "Paid" },
  { id: "PAY-2022-001", date: "2022-01-18", amount: "KWD 10.00", status: "Paid" },
];

  