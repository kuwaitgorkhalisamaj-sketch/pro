
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Image as ImageIcon,
  Star,
  LifeBuoy,
  LogOut,
  Rss
} from "lucide-react";
import { useProfile } from '@/context/ProfileContext';
import { useToast } from "@/hooks/use-toast";


const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Announcements" },
  { href: "/dashboard/feeds", icon: Rss, label: "Feeds" },
  { href: "/dashboard/membership", icon: Users, label: "Membership" },
  { href: "/dashboard/events", icon: CalendarDays, label: "Events" },
  { href: "/dashboard/gallery", icon: ImageIcon, label: "Gallery" },
  { href: "/dashboard/partners", icon: Star, label: "Partner Benefits" },
];

function SidebarNav({ onLinkClick }: { onLinkClick: () => void }) {
    const pathname = usePathname();
    const { toast } = useToast();

    const supportNavItems = [
        { href: "/dashboard/support", icon: LifeBuoy, label: "Support" },
        { type: "button", icon: LogOut, label: "Logout", onClick: () => toast({ title: 'Logged Out', description: 'You have been successfully logged out.' }) },
    ];

    return (
        <div className="flex flex-col flex-grow p-2">
             <div className="flex-grow">
                <SidebarMenu>
                    {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                        asChild
                        variant="outline"
                        isActive={pathname === item.href || (item.href === "/dashboard" && pathname === "/")}
                        tooltip={item.label}
                        onClick={onLinkClick}
                        className="text-base py-3"
                        >
                        <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                        </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </div>
            <SidebarFooter>
                <SidebarMenu>
                    {supportNavItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                        {item.type === 'button' ? (
                        <SidebarMenuButton
                            variant="outline"
                            tooltip={item.label}
                            onClick={item.onClick}
                            className="text-base py-3"
                        >
                            <item.icon />
                            <span>{item.label}</span>
                        </SidebarMenuButton>
                        ) : (
                        <SidebarMenuButton
                            asChild
                            variant="outline"
                            isActive={pathname === item.href}
                            tooltip={item.label}
                            onClick={onLinkClick}
                            className="text-base py-3"
                        >
                            <Link href={item.href!}>
                            <item.icon />
                            <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarFooter>
        </div>
    );
}

function SidebarLogo() {
    const { profile } = useProfile();
    return (
        <>
            <Image src={profile.logoUrl} width={40} height={40} alt="logo" data-ai-hint="logo" className="rounded-sm"/>
            <span className="text-xl font-semibold font-headline">KGS</span>
        </>
    )
}

function SidebarClientContent({ onLinkClick }: { onLinkClick: () => void }) {
    return (
        <>
            <SidebarHeader className="p-0">
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3">
                    <SidebarLogo />
                </Link>
            </SidebarHeader>
            <SidebarNav onLinkClick={onLinkClick} />
        </>
    );
}


export function AppSidebar({ sidebarRef }: { sidebarRef: React.Ref<{ setOpenMobile: (open: boolean) => void } | null> }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMobileLinkClick = () => {
    if (sidebarRef && 'current' in sidebarRef && sidebarRef.current) {
      sidebarRef.current.setOpenMobile(false);
    }
  };

  return (
      <Sidebar ref={sidebarRef}>
        <SidebarContent className="flex flex-col p-0">
            {isMounted ? <SidebarClientContent onLinkClick={handleMobileLinkClick} /> : null}
        </SidebarContent>
      </Sidebar>
  )
}
