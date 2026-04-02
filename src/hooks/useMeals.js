import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useMeals(date) {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchMeals() {
      try {
        setLoading(true);
        const todayStr = new Date().toISOString().split('T')[0];
        const targetDate = date ? new Date(date).toISOString().split('T')[0] : todayStr;
        
        const { data, error } = await supabase
          .from('meals')
          .select('*')
          .eq('user_id', user.id)
          .eq('logged_at', targetDate)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMeals(data || []);
      } catch (err) {
        console.error('Error fetching meals:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMeals();
  }, [user, date]);

  const addMeal = async (mealData) => {
    const { data, error } = await supabase
      .from('meals')
      .insert({ ...mealData, user_id: user.id })
      .select()
      .single();
      
    if (error) throw error;
    setMeals([data, ...meals]);
    return data;
  };

  const deleteMeal = async (id) => {
    const { error } = await supabase.from('meals').delete().eq('id', id);
    if (error) throw error;
    setMeals(meals.filter(m => m.id !== id));
  };

  return { meals, addMeal, deleteMeal, loading };
}
