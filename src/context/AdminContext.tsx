import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup, signOut } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface AdminContextType {
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  isAdmin: boolean;
  user: User | null;
  login: (number: string, pass: string) => boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_NUMBER = "01874816789";
const ADMIN_PASSWORD = "TANJIMRIACHAT@";
const ADMIN_EMAIL = "tanjimriachat@gmail.com";

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem('trivonix_admin') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u?.email === ADMIN_EMAIL) {
        setIsAdmin(true);
        localStorage.setItem('trivonix_admin', 'true');
      }
    });
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Login failed:", error);
    }
  };

  const login = (number: string, pass: string) => {
    if (number === ADMIN_NUMBER && pass === ADMIN_PASSWORD) {
      setIsAdmin(true);
      try {
        localStorage.setItem('trivonix_admin', 'true');
      } catch (e) {}
      return true;
    }
    return false;
  };

  const logout = async () => {
    setIsAdmin(false);
    setIsEditMode(false);
    try {
      localStorage.removeItem('trivonix_admin');
      await signOut(auth);
    } catch (e) {}
  };

  return (
    <AdminContext.Provider value={{ isEditMode, setIsEditMode, isAdmin, user, login, loginWithGoogle, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
