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

// Fungsi untuk mendapatkan styling berdasarkan interest
const getInterestStyle = (interest: string, isSelected: boolean) => {
    if (!isSelected) return "bg-gray-800 text-white border border-transparent";
    
    switch (interest) {
        case "Music":
            return "bg-purple-400/30 text-purple-300 border border-purple-400";
        case "Basketball":
            return "bg-orange-400/30 text-orange-300 border border-orange-400";
        case "Fitness":
            return "bg-green-400/30 text-green-300 border border-green-400";
        case "Gymming":
            return "bg-blue-400/30 text-blue-300 border border-blue-400";
        case "Traveling":
            return "bg-pink-400/30 text-pink-300 border border-pink-400";
        case "Reading":
            return "bg-red-400/30 text-red-300 border border-red-400";
        case "Writing":
            return "bg-indigo-400/30 text-indigo-300 border border-indigo-400";
        case "Coding":
            return "bg-cyan-400/30 text-cyan-300 border border-cyan-400";
        case "Gaming":
            return "bg-violet-400/30 text-violet-300 border border-violet-400";
        case "Movies":
            return "bg-amber-400/30 text-amber-300 border border-amber-400";
        case "Cooking":
            return "bg-emerald-400/30 text-emerald-300 border border-emerald-400";
        case "Photography":
            return "bg-rose-400/30 text-rose-300 border border-rose-400";
        default:
            return "bg-yellow-400/30 text-yellow-300 border border-yellow-400";
    }
};

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
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                                    getInterestStyle(interest, selectedInterests.includes(interest))
                                }`}
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