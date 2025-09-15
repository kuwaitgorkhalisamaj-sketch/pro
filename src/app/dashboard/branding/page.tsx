
'use client';

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { UploadCloud } from "lucide-react";
import Image from "next/image";
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/context/ProfileContext';

// This would be controlled by a real authentication and role system.
const currentRole = "Platform Administrator";
const isPlatformAdmin = currentRole === "Platform Administrator";

function hexToHsl(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '0 0% 0%';
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function ColorPicker({ label, color, setColor }: { label: string, color: string, setColor: (color: string) => void }) {
    return (
        <div className="flex items-center justify-between">
            <Label>{label}</Label>
            <div className="flex items-center gap-2">
                <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 p-1" disabled={!isPlatformAdmin} />
                <Input value={color} onChange={(e) => setColor(e.target.value)} className="w-24" disabled={!isPlatformAdmin} />
            </div>
        </div>
    )
}

export default function BrandingPage() {
    const { profile, setProfile } = useProfile();
    const { toast } = useToast();

    const handleProfileChange = (field: string, value: any) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newLogoUrl = e.target?.result as string;
                handleProfileChange('logoUrl', newLogoUrl);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSaveChanges = async () => {
        // This is a simulation of saving the CSS file. In a real app,
        // this would be an API call to a backend service.
        // For this prototype, we are just logging it to the console
        // and updating the live CSS variables for immediate feedback.
        console.log("Saving theme settings to localStorage via context...");

        document.documentElement.style.setProperty('--primary', hexToHsl(profile.primaryColor));
        document.documentElement.style.setProperty('--secondary', hexToHsl(profile.secondaryColor));
        document.documentElement.style.setProperty('--accent', hexToHsl(profile.accentColor));
        document.documentElement.style.setProperty('--radius', `${profile.cornerRadius}rem`);
        
        toast({
            title: "Changes Saved!",
            description: "Your branding and theme settings have been updated.",
        });
    };


    return (
        <>
            <PageHeader
                title="App Branding & Theme Control"
                description="Customize the look and feel of the application for all users."
            >
                <Button onClick={handleSaveChanges} disabled={!isPlatformAdmin}>
                    Save Changes
                </Button>
            </PageHeader>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>App Logo & Icons</CardTitle>
                            <CardDescription>Upload your brand's logo and favicon.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <Image src={profile.logoUrl} alt="current logo" width={100} height={100} className="rounded-lg" data-ai-hint="app logo" />
                                <div className="flex-1 w-full">
                                    <Label htmlFor="logo-upload">App Logo</Label>
                                    <div className="mt-2 flex flex-col sm:flex-row items-center gap-4">
                                        <Input id="logo-upload" type="file" className="hidden" disabled={!isPlatformAdmin} onChange={handleLogoUpload} accept="image/*" />
                                        <Button variant="outline" asChild={isPlatformAdmin} disabled={!isPlatformAdmin} className="w-full sm:w-auto">
                                            <label htmlFor="logo-upload" className="cursor-pointer disabled:cursor-not-allowed flex items-center justify-center">
                                                <UploadCloud className="mr-2 h-4 w-4" /> Upload Logo
                                            </label>
                                        </Button>
                                        <p className="text-xs text-muted-foreground mt-2 sm:mt-0">PNG, JPG, SVG up to 5MB.</p>
                                    </div>
                                     {!isPlatformAdmin && <p className="text-xs text-destructive mt-2">Only administrators can change the app logo.</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Color Scheme</CardTitle>
                            <CardDescription>Define the primary and secondary colors for the app's theme.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ColorPicker label="Primary Color" color={profile.primaryColor} setColor={(value) => handleProfileChange('primaryColor', value)} />
                            <ColorPicker label="Secondary Color" color={profile.secondaryColor} setColor={(value) => handleProfileChange('secondaryColor', value)} />
                            <ColorPicker label="Accent Color" color={profile.accentColor} setColor={(value) => handleProfileChange('accentColor', value)} />
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Typography</CardTitle>
                            <CardDescription>Select the fonts for headings and body text.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="font-headline">Headline Font</Label>
                                <Select value={profile.headlineFont} onValueChange={(value) => handleProfileChange('headlineFont', value)} disabled={!isPlatformAdmin}>
                                    <SelectTrigger id="font-headline">
                                        <SelectValue placeholder="Select a font" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pt-sans">PT Sans</SelectItem>
                                        <SelectItem value="inter">Inter</SelectItem>
                                        <SelectItem value="roboto">Roboto</SelectItem>
                                        <SelectItem value="lato">Lato</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="font-body">Body Font</Label>
                                <Select value={profile.bodyFont} onValueChange={(value) => handleProfileChange('bodyFont', value)} disabled={!isPlatformAdmin}>
                                    <SelectTrigger id="font-body">
                                        <SelectValue placeholder="Select a font" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pt-sans">PT Sans</SelectItem>
                                        <SelectItem value="inter">Inter</SelectItem>
                                        <SelectItem value="roboto">Roboto</SelectItem>
                                        <SelectItem value="lato">Lato</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Layout Preferences</CardTitle>
                            <CardDescription>Control general layout settings like spacing and corner radius.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <Label>Card Corner Radius</Label>
                                <Slider value={[profile.cornerRadius]} onValueChange={(value) => handleProfileChange('cornerRadius', value[0])} max={2} step={0.1} disabled={!isPlatformAdmin} />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Sharp</span>
                                    <span>Rounded</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label>Spacing</Label>
                                <Slider value={[profile.spacing]} onValueChange={(value) => handleProfileChange('spacing', value[0])} max={8} step={1} disabled={!isPlatformAdmin} />
                                 <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Compact</span>
                                    <span>Comfortable</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
                <div className="space-y-8 lg:col-span-1">
                     <Card>
                        <CardHeader>
                            <CardTitle>Mobile Preview</CardTitle>
                            <CardDescription>See how your changes will look on a mobile device.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full max-w-[280px] mx-auto bg-background rounded-[2rem] p-4 shadow-2xl ring-4 ring-muted">
                                <div 
                                    className="bg-card rounded-lg aspect-[9/19.5] overflow-hidden border"
                                    style={{ 
                                        fontFamily: profile.bodyFont === 'pt-sans' ? '"PT Sans", sans-serif' : profile.bodyFont, 
                                        '--preview-radius': `${profile.cornerRadius}rem`, 
                                        '--preview-spacing': `${profile.spacing * 2}px`,
                                        '--preview-primary': profile.primaryColor,
                                        '--preview-secondary': profile.secondaryColor
                                    } as React.CSSProperties}
                                >
                                     <div className="p-4 text-center font-bold text-lg" style={{ backgroundColor: 'var(--preview-primary)', color: '#FFFFFF', fontFamily: profile.headlineFont === 'pt-sans' ? '"PT Sans", sans-serif' : profile.headlineFont }}>App Preview</div>
                                     <div className="p-4 flex flex-col" style={{ gap: `var(--preview-spacing)`}}>
                                        <div className="bg-card p-3 shadow-sm border" style={{ borderRadius: `var(--preview-radius)`}}>
                                            <p style={{ fontFamily: profile.headlineFont === 'pt-sans' ? '"PT Sans", sans-serif' : profile.headlineFont }} className="text-card-foreground font-semibold">Sample Card</p>
                                            <p className="text-sm text-muted-foreground mt-1">This is a preview.</p>
                                        </div>
                                         <div className="bg-card p-3 shadow-sm border" style={{ borderRadius: `var(--preview-radius)`}}>
                                            <p style={{ fontFamily: profile.headlineFont === 'pt-sans' ? '"PT Sans", sans-serif' : profile.headlineFont }} className="text-card-foreground font-semibold">Another Card</p>
                                            <p className="text-sm text-muted-foreground mt-1">Changes are reflected here.</p>
                                        </div>
                                         <Button className="w-full" style={{ backgroundColor: 'var(--preview-primary)', color: '#FFFFFF', borderRadius: `var(--preview-radius)` }}>Primary Button</Button>
                                         <Button variant="secondary" className="w-full" style={{ backgroundColor: 'var(--preview-secondary)', borderRadius: `var(--preview-radius)` }}>Secondary Button</Button>
                                     </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
