import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setProfile(data);
        } else {
          // If no profile exists, return a blank template with minimal user info
          setProfile({
            id: user.id,
            email: user.email,
            full_name: '',
            age: 0,
            weight_kg: 0,
            height_cm: 0,
            daily_calorie_target: 2000,
            daily_protein: 0,
            daily_carbs: 0,
            daily_fats: 0
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      setError(null);
      const profileData = {
        id: user.id,
        ...updates,
      };

      const { data, error } = await supabase
        .from('profiles')
        .upsert(profileData)
        .select()
        .single();
        
      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { profile, updateProfile, loading, error };
}
