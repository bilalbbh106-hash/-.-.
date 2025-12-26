import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from './SupabaseContext';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      try {
        const { data, error } = await supabase
          .from('admins')
          .select('*')
          .eq('password_hash', token)
          .single();

        if (!error && data) {
          setAdmin(data);
        }
      } catch (error) {
        console.error('Error checking admin:', error);
      }
    }
    setLoading(false);
  };

  const login = async (password) => {
    try {
      if (password === '2009bbh2009') {
        const { data, error } = await supabase
          .from('admins')
          .select('*')
          .eq('username', 'admin')
          .eq('password_hash', password)
          .single();

        if (error) throw error;

        localStorage.setItem('admin_token', password);
        setAdmin(data);
        toast.success('تم تسجيل الدخول بنجاح!');
        return true;
      } else {
        toast.error('كلمة المرور غير صحيحة');
        return false;
      }
    } catch (error) {
      toast.error('خطأ في تسجيل الدخول');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setAdmin(null);
    toast.success('تم تسجيل الخروج');
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('يجب استخدام useAuth داخل AuthProvider');
  }
  return context;
};
