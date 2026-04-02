import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useWorkouts(date) {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchWorkouts() {
      try {
        setLoading(true);
        const query = supabase
          .from('workouts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        const targetDate = date ? new Date(date).toISOString().split('T')[0] : null;
        if (targetDate) {
          query.eq('logged_at', targetDate);
        } else {
          query.limit(10);
        }

        const { data, error } = await query;
        if (error) throw error;
        
        setWorkouts(data || []);
      } catch (err) {
        console.error('Error fetching workouts:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkouts();
  }, [user, date]);

  const addWorkout = async (workoutData) => {
    const { data, error } = await supabase
      .from('workouts')
      .insert({ ...workoutData, user_id: user.id })
      .select()
      .single();
      
    if (error) throw error;
    setWorkouts([data, ...workouts]);
    return data;
  };

  const deleteWorkout = async (id) => {
    const { error } = await supabase.from('workouts').delete().eq('id', id);
    if (error) throw error;
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  return { workouts, addWorkout, deleteWorkout, loading };
}
