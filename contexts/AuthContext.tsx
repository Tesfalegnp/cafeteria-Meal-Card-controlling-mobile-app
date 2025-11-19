// Mobile_app/TCSS-3/contexts/AuthContext.tsx
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

interface CouncilMember {
  id: string;
  student_id: string;
  working_type: string;
  position: string;
  academic_year: string;
  is_active: boolean;
  responsibilities: string[];
  start_date: string;
  end_date: string | null;
}

interface AuthContextType {
  student: Student | null;
  councilMember: CouncilMember | null;
  isLoading: boolean;
  login: (studentId: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshCouncilMember: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [councilMember, setCouncilMember] = useState<CouncilMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const studentId = await AsyncStorage.getItem('studentId');
      if (studentId) {
        await fetchStudentData(studentId);
        await fetchCouncilMemberData(studentId);
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

  const fetchCouncilMemberData = async (studentId: string) => {
    try {
      const currentYear = new Date().getFullYear().toString();
      
      const { data, error } = await supabase
        .from('council_members')
        .select('*')
        .eq('student_id', studentId)
        .eq('academic_year', currentYear)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw error;
      }
      
      setCouncilMember(data || null);
    } catch (error) {
      console.error('Error fetching council member data:', error);
      setCouncilMember(null);
    }
  };

  const refreshCouncilMember = async () => {
    if (student) {
      await fetchCouncilMemberData(student.student_id);
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
        await fetchCouncilMemberData(studentId.trim());
        return true;
      }

      // Normal login
      if (data.password === password) {
        await AsyncStorage.setItem('studentId', studentId.trim());
        setStudent(data);
        await fetchCouncilMemberData(studentId.trim());
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
      setCouncilMember(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      student, 
      councilMember, 
      isLoading, 
      login, 
      logout,
      refreshCouncilMember 
    }}>
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