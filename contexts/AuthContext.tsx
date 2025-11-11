import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabaseClient';

interface Student {
  id: string;
  student_id: string;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  department: string | null;
  year: string | null;
  photo_url: string | null;
  diet_type: string | null;
  qr_code: string | null;
  status: string | null;
  email: string | null;
}

interface AuthContextType {
  student: Student | null;
  isLoading: boolean;
  login: (studentId: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const studentId = await AsyncStorage.getItem('studentId');
      if (studentId) {
        await fetchStudentData(studentId);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentData = async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('student_id', studentId)
        .single();

      if (error) throw error;
      setStudent(data);
    } catch (error) {
      console.error('Error fetching student data:', error);
      await logout();
    }
  };

  const login = async (studentId: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('student_id', studentId.trim())
        .single();

      if (error || !data) {
        console.error('User not found');
        return false;
      }

      // Handle first-time login (no password set)
      if (!data.password) {
        if (!password) {
          return false;
        }
        // Update with new password
        const { error: updateError } = await supabase
          .from('students')
          .update({ password })
          .eq('student_id', studentId.trim());

        if (updateError) throw updateError;
        
        await AsyncStorage.setItem('studentId', studentId.trim());
        setStudent({ ...data, password });
        return true;
      }

      // Normal login
      if (data.password === password) {
        await AsyncStorage.setItem('studentId', studentId.trim());
        setStudent(data);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('studentId');
      setStudent(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ student, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}