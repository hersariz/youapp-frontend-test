'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile, updateProfile } from '../../lib/api';
import { getZodiacSign, getChineseZodiac } from '../../lib/zodiac';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Fungsi untuk menghasilkan gambar hasil crop
function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): Promise<string> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return Promise.reject(new Error('No 2d context'));
  }

  // Gambar crop ke canvas
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  // Gunakan toDataURL untuk langsung mendapatkan base64 string
  // Ini lebih aman daripada URL.createObjectURL untuk React
  try {
    const base64Image = canvas.toDataURL('image/jpeg', 0.95);
    return Promise.resolve(base64Image);
  } catch (e) {
    return Promise.reject(new Error('Canvas export failed'));
  }
}

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

// --- Icons ---
const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="5" r="2" fill="white"/>
    <circle cx="12" cy="12" r="2" fill="white"/>
    <circle cx="12" cy="19" r="2" fill="white"/>
  </svg>
);
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Komponen placeholder foto
const PhotoPlaceholder = ({ name, username }: { name?: string, username?: string }) => {
  console.log("PhotoPlaceholder rendered with name:", name, "username:", username); // Logging untuk debugging
  
  // Mengambil inisial dari nama (jika ada) atau username (jika nama tidak ada) atau default 'YA'
  const initials = name 
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : username 
      ? username.substring(0, 2).toUpperCase()
      : 'YA';
  
  // Warna latar belakang acak tapi konsisten untuk nama yang sama
  const getColorFromName = (text: string) => {
    const colors = [
      'bg-blue-600', 'bg-purple-600', 'bg-pink-600', 
      'bg-indigo-600', 'bg-teal-600', 'bg-green-600'
    ];
    
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  // Gunakan nama atau username untuk warna latar belakang
  const textForColor = name || username || 'default';
  const bgColorClass = getColorFromName(textForColor);
  
  return (
    <div className={`w-full h-full flex items-center justify-center ${bgColorClass}`} style={{zIndex: 10}}>
      <span className="text-white text-4xl font-bold">{initials}</span>
    </div>
  );
};

// Tambahkan CSS untuk animasi di bagian atas file
const glowingBorderStyle = `
  @keyframes rotate-glow {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  .profile-container {
    position: relative;
    border-radius: 1rem;
    padding: 3px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
    background-size: 300% 300%;
    animation: rotate-glow 3s linear infinite;
    overflow: hidden;
  }
  
  .profile-content {
    position: relative;
    background: #374151;
    border-radius: 0.9rem;
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .profile-content img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  @keyframes slideInFromTop {
    0% {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .animate-in {
    animation: slideInFromTop 0.2s ease-out forwards;
  }

  .slide-in-from-top-2 {
    transform-origin: top right;
  }

  .fade-in {
    animation: slideInFromTop 0.2s ease-out forwards;
  }

  @keyframes smoothDropdown {
    0% {
      opacity: 0;
      transform: translateY(-5px) scale(0.98);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .menu-dropdown {
    animation: smoothDropdown 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    transform-origin: top right;
  }
  
  /* Perbaikan untuk dropdown */
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: #1F2937 !important;
    color: white !important;
  }
  
  select option {
    background-color: #1F2937;
    color: white;
    padding: 10px;
  }
  
  /* Untuk Firefox */
  select:-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 white;
  }
  
  /* Untuk Chrome dan Safari */
  select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
`;

interface UserProfile {
  name: string;
  birthday: string;
  height: number;
  weight: number;
  interests: string[];
  about?: string;
  email?: string;
  username?: string;
  zodiac?: string;
  horoscope?: string;
  gender?: string;
}

const inputClass = "w-full px-4 py-3 bg-input-bg rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-primary";

// Custom Dropdown Component
interface CustomDropdownProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  name: string;
  id: string;
}

const CustomDropdown = ({ options, value, onChange, placeholder, name, id }: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Find the selected option label
  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        className="w-full px-4 py-3 bg-input-bg rounded-lg text-white flex justify-between items-center focus:outline-none focus:ring-1 focus:ring-brand-primary"
        onClick={() => setIsOpen(!isOpen)}
        id={id}
      >
        <span className={value ? "text-white" : "text-gray-400"}>
          {value ? selectedOption?.label : placeholder}
        </span>
        <svg className={`w-4 h-4 fill-current text-white/50 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20">
          <path d="M5.516 7.548c.436-.446 1.144-.446 1.584 0L10 10.404l2.9-2.856c.44-.446 1.148-.446 1.584 0 .44.446.44 1.156 0 1.602l-3.692 3.62c-.44.446-1.148.446-1.584 0L5.516 9.15c-.436-.446-.436-1.156 0-1.602z"></path>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-auto animate-in fade-in" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)' }}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`w-full text-left px-4 py-3 transition-colors ${
                option.value === value 
                  ? 'bg-blue-600 text-white font-medium' 
                  : 'text-white hover:bg-gray-800'
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={value} />
    </div>
  );
};

// Modal untuk cropping gambar
const ImageCropModal = ({ 
  src, 
  onCropComplete, 
  onCancel 
}: { 
  src: string; 
  onCropComplete: (croppedImageUrl: string) => void; 
  onCancel: () => void 
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    
    // Buat crop awal tanpa aspect ratio yang tetap
    const initialCrop: Crop = {
      unit: '%',
      x: 5,
      y: 5,
      width: 90,
      height: 90
    };
    
    setCrop(initialCrop);
  }

  const handleComplete = async () => {
    if (imgRef.current && completedCrop) {
      try {
        const croppedImageUrl = await getCroppedImg(imgRef.current, completedCrop);
        onCropComplete(croppedImageUrl);
      } catch (e) {
        console.error('Error generating crop', e);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-5 max-w-lg w-full">
        <h3 className="text-lg font-bold mb-4">Sesuaikan Gambar Profil</h3>
        <p className="text-sm text-gray-300 mb-4">Geser dan sesuaikan gambar agar pas dengan frame profil. Anda bebas mengatur ukuran dan posisi crop.</p>
        
        <div className="mb-4">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            className="max-h-[60vh] mx-auto"
          >
            <img
              ref={imgRef}
              src={src}
              alt="Crop me"
              onLoad={onImageLoad}
              className="max-h-[60vh] mx-auto"
            />
          </ReactCrop>
        </div>
        
        <div className="flex justify-end gap-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleComplete}
            className="px-4 py-2 bg-gradient-to-l from-teal-300 to-blue-500 rounded-lg hover:opacity-90 transition-opacity"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  const handleUpdate = async () => {
    if (!profile) return;
    try {
      // Save image preview to localStorage if it exists
      if (imagePreview) {
        localStorage.setItem('profileImagePreview', imagePreview);
      }
      
      // Simpan gender dan about di localStorage karena API tidak mendukungnya
      localStorage.setItem('profileGender', profile.gender || '');
      localStorage.setItem('profileAbout', profile.about || '');
      
      // Pastikan data yang dikirim sesuai format API
      const updateData = {
        name: profile.name || '',
        birthday: profile.birthday || '',
        height: Number(profile.height) || 0,
        weight: Number(profile.weight) || 0,
        interests: profile.interests || []
      };
      
      console.log('Sending update data:', updateData);
      await updateProfile(updateData);
      
      // Refresh data setelah update
      await fetchProfile();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfile(prev => prev ? { ...prev, [e.target.name]: e.target.value } : null);
  };

  // Handler khusus untuk custom dropdown
  const handleCustomDropdownChange = (name: string, value: string) => {
    setProfile(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validasi tipe file
      if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
      }
      
      // Ukuran maksimum (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      // Buat URL untuk preview dan cropping
      const imageUrl = URL.createObjectURL(file);
      setCropSrc(imageUrl);
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    // Langsung konversi ke base64 untuk menghindari masalah dengan URL.createObjectURL
    fetch(croppedImageUrl)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          // Simpan di localStorage dan juga gunakan sebagai preview
          localStorage.setItem('profileImagePreview', base64String);
          setImagePreview(base64String);
          
          // Revoke URL object untuk mencegah memory leak
          URL.revokeObjectURL(croppedImageUrl);
        };
        reader.readAsDataURL(blob);
      })
      .catch(err => {
        console.error("Error converting blob URL to base64:", err);
      })
      .finally(() => {
        setCropSrc(null);
      });
  };

  const handleCropCancel = () => {
    setCropSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      const profileData = response.data.data;

      if (profileData && profileData.birthday) {
        const date = new Date(profileData.birthday);
        profileData.horoscope = getZodiacSign(date.getDate(), date.getMonth() + 1);
        profileData.zodiac = getChineseZodiac(date.getFullYear());
      }

      // Load image from localStorage if available
      const savedImage = localStorage.getItem('profileImagePreview');
      console.log("Saved image from localStorage:", savedImage ? "Found" : "Not found");
      
      if (savedImage) {
        // Jika savedImage adalah base64 string, gunakan langsung
        // Jika bukan (URL.createObjectURL), gunakan seperti biasa
        if (savedImage.startsWith('data:')) {
          setImagePreview(savedImage);
        } else {
          setImagePreview(savedImage);
        }
        console.log("Image preview set from localStorage");
      } else {
        console.log("No image in localStorage, using placeholder");
        setImagePreview(null); // Pastikan imagePreview adalah null agar PhotoPlaceholder ditampilkan
      }

      // Load gender dan about dari localStorage
      const savedGender = localStorage.getItem('profileGender');
      const savedAbout = localStorage.getItem('profileAbout');
      
      if (savedGender) {
        profileData.gender = savedGender;
      }
      
      if (savedAbout) {
        profileData.about = savedAbout;
      }

      setProfile(profileData);
      console.log("Profile data set:", profileData);
    } catch (err) {
      setError('Failed to fetch profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('profileImagePreview');
    localStorage.removeItem('profileGender');
    localStorage.removeItem('profileAbout');
    window.location.href = '/login';
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen text-white">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  if (!profile) return <div className="flex justify-center items-center min-h-screen text-white">No profile data.</div>;

  return (
    <div className="min-h-screen text-white p-4 space-y-5">
      {/* Tambahkan style untuk animasi */}
      <style jsx>{glowingBorderStyle}</style>
      
      {/* Image Crop Modal */}
      {cropSrc && (
        <ImageCropModal
          src={cropSrc}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between h-12">
        <button onClick={() => window.history.back()} className="p-2">
          <BackIcon />
        </button>
        <span className="font-semibold text-lg text-center">@{profile.username || 'username'}</span>
        <div className="relative" ref={menuRef}>
          <button onClick={() => setShowMenu(!showMenu)} className="p-2">
            <MenuIcon />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-10 mt-1 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-600 z-50 menu-dropdown">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left text-red-400 hover:bg-gray-800 rounded-lg flex items-center gap-3 transition-colors duration-150"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="relative bg-card-dark rounded-xl p-5">
          <div className="w-full h-52 mx-auto mb-4 profile-container overflow-hidden">
            <div className="profile-content flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full" data-testid="photo-placeholder">
                  <PhotoPlaceholder name={profile.name} username={profile.username} />
                </div>
              )}
            </div>
          </div>
          <h2 className="text-center text-xl font-bold">
            @{profile.name || 'Your Name'}
          </h2>
          <p className="text-center text-gray-400 mt-1">{profile.email}</p>
          <p className="text-center text-gray-300 mt-1">{profile.horoscope && profile.zodiac ? `${profile.horoscope} | ${profile.zodiac}` : ''}</p>
      </div>

      {/* About Section */}
      <div className="bg-card-dark rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-sm">About</h3>
          {isEditing ? (
            <button onClick={async () => { await handleUpdate(); setIsEditing(false); }} className="text-brand-primary font-semibold text-sm">
              Save & Update
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="p-2 -m-2">
              <EditIcon />
            </button>
          )}
        </div>
        
        {isEditing ? (
          <div className="space-y-4 pt-2">
            {/* Image Upload */}
            <div className="flex items-center">
              <label className="w-28 text-right text-sm text-white/70 shrink-0 pr-3"></label>
              <div className="relative">
                <div className="w-24 h-24 profile-container overflow-hidden">
                  <label htmlFor="image-upload" className="profile-content flex items-center justify-center cursor-pointer">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full relative" data-testid="edit-photo-placeholder">
                        <PhotoPlaceholder name={profile.name} username={profile.username} />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <span className="text-xs text-white px-2 text-center">Add image</span>
                        </div>
                      </div>
                    )}
                  </label>
                  <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} ref={fileInputRef} />
                </div>
              </div>
            </div>
            
            {/* About Me */}
            <div className="flex items-start">
              <label htmlFor="about" className="w-28 text-right text-sm text-white/70 shrink-0 pr-3 pt-3">About:</label>
              <textarea id="about" name="about" value={profile.about || ''} onChange={handleInputChange} placeholder="Tell us about yourself..." className={`${inputClass} min-h-[100px] resize-none flex-1`} />
            </div>

            {/* Display Name */}
            <div className="flex items-center">
                <label htmlFor="name" className="w-28 text-right text-sm text-white/70 shrink-0 pr-3">Display name:</label>
                <div className="relative flex-1">
                    <input id="name" type="text" name="name" value={profile.name || ''} onChange={handleInputChange} placeholder="Enter name" className={inputClass} />
                </div>
            </div>

            {/* Gender */}
            <div className="flex items-center">
                <label htmlFor="gender" className="w-28 text-right text-sm text-white/70 shrink-0 pr-3">Gender:</label>
                <div className="relative flex-1">
                    <CustomDropdown
                      options={[
                        { value: 'Male', label: 'Male' },
                        { value: 'Female', label: 'Female' }
                      ]}
                      value={profile.gender || ''}
                      onChange={(value) => handleCustomDropdownChange('gender', value)}
                      placeholder="Select Gender"
                      name="gender"
                      id="gender"
                    />
                </div>
            </div>

            {/* Birthday */}
            <div className="flex items-center">
                <label htmlFor="birthday" className="w-28 text-right text-sm text-white/70 shrink-0 pr-3">Birthday:</label>
                <div className="relative flex-1">
                    <input id="birthday" type="text" name="birthday" onFocus={(e) => e.target.type='date'} onBlur={(e) => e.target.type='text'} value={profile.birthday ? profile.birthday.split('T')[0] : ''} onChange={handleInputChange} placeholder="DD MM YYYY" className={`${inputClass} date-input`} />
                </div>
            </div>
            
            {/* Height */}
            <div className="flex items-center">
                <label htmlFor="height" className="w-28 text-right text-sm text-white/70 shrink-0 pr-3">Height:</label>
                <div className="relative flex-1">
                    <input id="height" type="number" name="height" value={profile.height || ''} onChange={handleInputChange} placeholder="Add height" className={inputClass} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white">cm</span>
                </div>
            </div>

            {/* Weight */}
            <div className="flex items-center">
                <label htmlFor="weight" className="w-28 text-right text-sm text-white/70 shrink-0 pr-3">Weight:</label>
                <div className="relative flex-1">
                    <input id="weight" type="number" name="weight" value={profile.weight || ''} onChange={handleInputChange} placeholder="Add weight" className={inputClass} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white">kg</span>
                </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm bg-gray-800/40 p-4 rounded-lg">
            {profile.about && <p className="text-white/70 mb-4">{profile.about}</p>}
            
            <div className="flex">
              <span className="w-24 text-white/50 shrink-0">Birthday:</span>
              <span className="text-white font-medium">{profile.birthday ? new Date(profile.birthday).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}</span>
            </div>
            <div className="flex">
              <span className="w-24 text-white/50 shrink-0">Gender:</span>
              <span className="text-white font-medium">{profile.gender || 'N/A'}</span>
            </div>
            <div className="flex">
              <span className="w-24 text-white/50 shrink-0">Horoscope:</span>
              <span className="text-white font-medium">{profile.horoscope || 'N/A'}</span>
            </div>
            <div className="flex">
              <span className="w-24 text-white/50 shrink-0">Zodiac:</span>
              <span className="text-white font-medium">{profile.zodiac || 'N/A'}</span>
            </div>
            <div className="flex">
              <span className="w-24 text-white/50 shrink-0">Height:</span>
              <span className="text-white font-medium">{profile.height ? `${profile.height} cm` : 'N/A'}</span>
            </div>
            <div className="flex">
              <span className="w-24 text-white/50 shrink-0">Weight:</span>
              <span className="text-white font-medium">{profile.weight ? `${profile.weight} kg` : 'N/A'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Interests Section */}
      <div className="bg-card-dark rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-sm">Interest</h3>
          <button onClick={() => router.push('/profile/interest')} className="p-2 -m-2">
            <EditIcon />
          </button>
        </div>
        
        <div className="flex flex-wrap gap-3 bg-gray-800/40 p-4 rounded-lg">
            {profile.interests.map((interest) => (
              <span key={interest} className={`rounded-full px-4 py-2 text-sm flex items-center gap-2 ${getInterestStyle(interest, true)}`}>
                {interest}
              </span>
            ))}
            {profile.interests.length === 0 && (
              <p className="text-sm font-medium text-white/50">Add in your interest to find a better match</p>
            )}
        </div>
      </div>
    </div>
  );
} 