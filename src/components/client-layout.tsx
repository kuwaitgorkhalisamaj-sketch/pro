
'use client';

import Link from "next/link";
import React, { useState } from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Search,
  Settings,
  Moon,
  Sun,
  Bell,
  Palette,
  ChevronRight,
  LogOut,
  UserCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/context/ProfileContext';
import { useSearch } from '@/context/SearchContext';
import { useTheme } from "@/hooks/use-theme";
import { AppSidebar } from "./app-sidebar";


function SettingsDialog({ onLinkClick }: { onLinkClick: () => void }) {
    const { theme, setTheme } = useTheme();
    const isPlatformAdmin = true; // Simplified for public access

    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your app settings, including theme and notifications.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="theme" className="flex items-center gap-2">
                    <Sun className="h-5 w-5" />
                    <span>Light / Dark Mode</span>
                    <Moon className="h-5 w-5" />
                </Label>
                <Switch
                    id="theme"
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    <span>Push Notifications</span>
                </Label>
                <Switch id="notifications" />
            </div>
            {isPlatformAdmin && (
              <>
                <Separator />
                <h3 className="text-sm font-medium text-muted-foreground">Admin Controls</h3>
                 <Link href="/dashboard/branding" onClick={onLinkClick} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary">
                    <div className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        <span>Branding & Theme</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                </Link>
              </>
            )}
        </div>
      </DialogContent>
    );
  }

function Header() {
    const { setSearchQuery } = useSearch();
    const { profile } = useProfile();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { toast } = useToast();

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="relative flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-4 md:ml-auto md:grow-0">
                <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="overflow-hidden rounded-full"
                            >
                                <Avatar>
                                    <AvatarImage src={profile.avatarUrl} alt="User Avatar" data-ai-hint="person face" />
                                    <AvatarFallback>{profile.fullName.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{profile.fullName}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="text-base py-3 cursor-pointer">
                                <Link href="/dashboard/profile"><UserCircle className="mr-2"/>Profile</Link>
                            </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => setIsSettingsOpen(true)} className="text-base py-3 cursor-pointer">
                                <Settings className="mr-2"/>Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => toast({ title: 'Logged Out', description: 'You have been successfully logged out.' })} className="text-base py-3 cursor-pointer">
                                <LogOut className="mr-2" /> Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <SettingsDialog onLinkClick={() => setIsSettingsOpen(false)} />
                </Dialog>
            </div>
        </header>
    );
}

export function ClientLayout({ children }: { children: React.ReactNode}) {
    const sidebarRef = React.useRef<{ setOpenMobile: (open: boolean) => void } | null>(null);
    return (
        <SidebarProvider>
            <AppSidebar sidebarRef={sidebarRef} />
            <SidebarInset>
                <Header />
                <main className="flex-1 p-4 md:p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
