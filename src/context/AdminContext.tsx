import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AdminContextType {
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  isAdmin: boolean;
  login: (number: string, pass: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_NUMBER = "01874816789";
const ADMIN_PASSWORD = "TANJIMRIACHAT@";

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('trivonix_admin') === 'true');
  const [isEditMode, setIsEditMode] = useState(false);

  const login = (number: string, pass: string) => {
    if (number === ADMIN_NUMBER && pass === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem('trivonix_admin', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setIsEditMode(false);
    localStorage.removeItem('trivonix_admin');
  };

  return (
    <AdminContext.Provider value={{ isEditMode, setIsEditMode, isAdmin, login, logout }}>
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
