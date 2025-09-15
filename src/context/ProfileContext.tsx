
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ProfileData = {
    fullName: string;
    email: string;
    phone: string;
    bloodGroup: string;
    address: string;
    avatarUrl: string;
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    headlineFont: string;
    bodyFont: string;
    cornerRadius: number;
    spacing: number;
};

type ProfileContextType = {
    profile: ProfileData;
    setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
};

const initialProfileData: ProfileData = {
    fullName: "Ashok Thapa",
    email: "ashok.member@email.com",
    phone: "+965 1234 5678",
    bloodGroup: "A+",
    address: "Block 1, Street 1, Building 1, Abbasiya",
    avatarUrl: "https://images.unsplash.com/photo-1710974481447-fb001ad9ad5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxwZXJzb24lMjBmYWNlfGVufDB8fHx8MTc1NzE2ODk0OHww&ixlib=rb-4.1.0&q=80&w=1080",
    logoUrl: "https://firebasestudio.app/Studio-Assistant/API-Playground/g-41c37b83-a417-4a46-bb18-87cfc9388e62/crops/2_300x300.png",
    primaryColor: '#2563eb',
    secondaryColor: '#f1f5f9',
    accentColor: '#db2777',
    headlineFont: 'pt-sans',
    bodyFont: 'pt-sans',
    cornerRadius: 0.5,
    spacing: 4,
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<ProfileData>(initialProfileData);

    useEffect(() => {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            const parsedProfile = JSON.parse(savedProfile);
            // Ensure all theme properties have defaults if missing from older localStorage data
            const completeProfile = { ...initialProfileData, ...parsedProfile };
            setProfile(completeProfile);
        } else {
             // On first load for a new user, use Ashok's profile
             setProfile(initialProfileData);
        }
    }, []);

    useEffect(() => {
        // Prevent writing to localStorage on the initial render before data is loaded.
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile !== JSON.stringify(profile)) {
          localStorage.setItem('userProfile', JSON.stringify(profile));
        }
    }, [profile]);

    return (
        <ProfileContext.Provider value={{ profile, setProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};
