'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../../../lib/api';

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const allInterests = [
    "Music", "Basketball", "Fitness", "Gymming", "Traveling", "Reading", 
    "Writing", "Coding", "Gaming", "Movies", "Cooking", "Photography"
];

export default function InterestPage() {
    const router = useRouter();
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const response = await getProfile();
                if (response.data.data.interests) {
                    setSelectedInterests(response.data.data.interests);
                }
            } catch (error) {
                console.error("Failed to fetch interests", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInterests();
    }, []);

    const handleToggleInterest = (interest: string) => {
        setSelectedInterests(prev => 
            prev.includes(interest) 
            ? prev.filter(i => i !== interest)
            : [...prev, interest]
        );
    };

    const handleSave = async () => {
        try {
            // First get the full profile, then update only the interests
            const profileRes = await getProfile();
            const profileData = profileRes.data.data;
            
            await updateProfile({ ...profileData, interests: selectedInterests });
            router.push('/profile');
        } catch (error) {
            console.error("Failed to save interests", error);
        }
    };
    
    if (loading) return <div className="flex justify-center items-center min-h-screen text-white">Loading...</div>;

    return (
        <div className="min-h-screen text-white p-4 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between h-12 shrink-0">
                <div className="flex items-center">
                    <button onClick={() => router.back()} className="p-2">
                        <BackIcon />
                    </button>
                </div>
                <button onClick={handleSave} className="font-semibold text-sm text-sky-400">
                    Save
                </button>
            </div>

            {/* Content */}
            <div className="flex-grow mt-16">
                <h2 className="text-xl font-bold text-yellow-300">
                    Tell everyone about yourself
                </h2>
                <h1 className="text-2xl font-bold mt-2">
                    What are your interests?
                </h1>
                
                <div className="mt-8 bg-black/20 p-4 rounded-xl">
                     <div className="flex flex-wrap gap-3">
                        {allInterests.map(interest => (
                            <button 
                                key={interest} 
                                onClick={() => handleToggleInterest(interest)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
                                    ${selectedInterests.includes(interest) 
                                        ? 'bg-yellow-400/30 text-yellow-300 border border-yellow-400' 
                                        : 'bg-gray-800 text-white border border-transparent'}`
                                }
                            >
                                {interest}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 