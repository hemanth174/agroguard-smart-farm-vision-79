
import { useState, useCallback, useEffect } from 'react';
import { User } from '@/types/app';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const signIn = useCallback((name: string, mobile: string) => {
    try {
      // Simulate location detection
      const mockLocation = 'Telangana, India';
      const newUser = { name, mobile, location: mockLocation };
      
      // Set user state
      setUser(newUser);
      
      // Persist user data and login time to localStorage
      localStorage.setItem('villageeye-user', JSON.stringify(newUser));
      localStorage.setItem('villageeye-login-time', Date.now().toString());
      
      console.log('✅ User signed in and data persisted:', newUser);
      
      toast({
        title: "Welcome to VillageEye!",
        description: `Signed in successfully as ${name}`,
      });
    } catch (error) {
      console.error('Error during sign in:', error);
      toast({
        title: "Sign In Error",
        description: "Failed to save login data. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const signOut = useCallback(() => {
    try {
      setUser(null);
      // Clear persisted data
      localStorage.removeItem('villageeye-user');
      localStorage.removeItem('villageeye-login-time');
      
      console.log('✅ User signed out and data cleared');
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  }, [toast]);

  const initializeAuth = useCallback(() => {
    try {
      // Load saved user data
      const savedUser = localStorage.getItem('villageeye-user');
      const savedLoginTime = localStorage.getItem('villageeye-login-time');
      
      if (savedUser && savedLoginTime) {
        const loginTime = parseInt(savedLoginTime);
        const currentTime = Date.now();
        const timeDiff = currentTime - loginTime;
        
        // Keep user logged in for 30 days (30 * 24 * 60 * 60 * 1000 ms)
        const maxSessionTime = 30 * 24 * 60 * 60 * 1000;
        
        if (timeDiff < maxSessionTime) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          console.log('✅ User auto-logged in:', parsedUser.name);
        } else {
          // Session expired, clear stored data
          localStorage.removeItem('villageeye-user');
          localStorage.removeItem('villageeye-login-time');
          console.log('⚠️ User session expired, cleared data');
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      // Clear corrupted data
      localStorage.removeItem('villageeye-user');
      localStorage.removeItem('villageeye-login-time');
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    user,
    setUser,
    signIn,
    signOut,
    initializeAuth,
    isSignedIn: !!user,
    isAdmin: user?.name === 'admin'
  };
};
