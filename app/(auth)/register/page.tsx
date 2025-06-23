'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/app/lib/api';

const EyeOpenIcon = ({ onClick }: { onClick: () => void }) => (
  <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const EyeClosedIcon = ({ onClick }: { onClick: () => void }) => (
  <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const router = useRouter();

  // Efek pertama - hanya untuk menandai komponen sudah di-mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Efek kedua - untuk pengecekan token dengan delay
  useEffect(() => {
    // Hanya jalankan setelah komponen di-mount di client
    if (mounted) {
      // Gunakan setTimeout untuk menunda pengecekan token
      const checkAuthTimeout = setTimeout(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          setShouldRedirect(true);
        }
      }, 100); // Delay 100ms untuk mencegah kedipan

      return () => clearTimeout(checkAuthTimeout);
    }
  }, [mounted]);

  // Efek ketiga - untuk redirect setelah token ditemukan
  useEffect(() => {
    if (shouldRedirect) {
      router.replace('/profile');
    }
  }, [shouldRedirect, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await register({
        email,
        username,
        password,
      });
      
      router.push('/login');
    } catch (err: any) {
      console.error("Registration Error:", err.response || err.message);
      setError(err.response?.data?.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="flex items-center h-12">
        <button onClick={() => window.history.back()} className="p-2">
          <BackIcon />
        </button>
      </div>
      
      <div className="flex-grow flex flex-col justify-center items-center">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-white mb-8">Register</h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-input-bg rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Create username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-input-bg rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                required
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-input-bg rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {showPassword ? 
                  <EyeOpenIcon onClick={() => setShowPassword(false)} /> : 
                  <EyeClosedIcon onClick={() => setShowPassword(true)} />
                }
              </div>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-input-bg rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {showConfirmPassword ? 
                  <EyeOpenIcon onClick={() => setShowConfirmPassword(false)} /> : 
                  <EyeClosedIcon onClick={() => setShowConfirmPassword(true)} />
                }
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 relative group disabled:opacity-70"
            >
              {/* Glow effect */}
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-l from-teal-300/50 to-blue-500/50 rounded-lg blur-md group-hover:blur-lg transition-all duration-300"></div>
              {/* Main button */}
              <div className="absolute inset-0 h-12 bg-gradient-to-l from-teal-300 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-center text-white text-base font-bold">
                  {loading ? 'Registering...' : 'Register'}
                </span>
              </div>
            </button>
          </form>
        </div>
      </div>
      <div className="text-center pb-4">
        <p className="text-gray-400">
          Have an account?{' '}
          <Link href="/login" className="text-brand-primary hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
} 