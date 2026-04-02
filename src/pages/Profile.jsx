import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { User, LogOut, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const { user, signOut } = useAuth();
  const { profile, updateProfile, loading: profileLoading } = useProfile();
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    age: profile?.age || '',
    height_cm: profile?.height_cm || '',
    weight_kg: profile?.weight_kg || '',
    goal: profile?.goal || 'Maintain',
    avatar_url: profile?.avatar_url || ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        age: profile.age || '',
        height_cm: profile.height_cm || '',
        weight_kg: profile.weight_kg || '',
        goal: profile.goal || 'Maintain',
        avatar_url: profile.avatar_url || ''
      });
    }
  }, [profile]);
  
  const [submitting, setSubmitting] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [password, setPassword] = useState('');

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    try {
      await updateProfile({
        full_name: formData.full_name,
        age: parseInt(formData.age),
        height_cm: parseInt(formData.height_cm),
        weight_kg: parseFloat(formData.weight_kg),
        goal: formData.goal,
        avatar_url: formData.avatar_url
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecalculate = async () => {
    setCalculating(true);
    // Mifflin-St Jeor Formula (Approximate)
    const weight = parseFloat(formData.weight_kg) || 70;
    const height = parseInt(formData.height_cm) || 170;
    const age = parseInt(formData.age) || 25;
    
    // Base BMR for Male (common default)
    let bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    
    // TDEE with Moderate Activity (1.55 multiplier)
    let tdee = Math.round(bmr * 1.55);
    
    // Adjustment based on goal
    if (formData.goal === 'Lose Weight') tdee -= 500;
    if (formData.goal === 'Build Muscle') tdee += 300;

    try {
      await updateProfile({ daily_calorie_target: tdee });
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setCalculating(false), 800);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!password) return;
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setPassword('');
      alert('Password updated successfully');
    } catch (err) {
      alert(err.message);
    }
  };

  if (profileLoading && !profile) return <div className="p-8 text-center text-accent"><Loader2 className="animate-spin inline" /> Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 border-b border-border pb-6 justify-between">
        <div className="flex items-center gap-4">
          <div className="group relative w-16 h-16 rounded-2xl bg-bg-surface flex items-center justify-center border border-border overflow-hidden">
            {formData.avatar_url ? (
               <img src={formData.avatar_url} className="w-full h-full object-cover" alt="Profile" />
            ) : (
               <User className="h-8 w-8 text-text-primary" />
            )}
            <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
               <span className="text-[10px] font-black text-white uppercase tracking-widest">URL</span>
               <input 
                 type="button" 
                 className="absolute inset-0 opacity-0 cursor-pointer" 
                 onClick={() => setFormData({...formData, avatar_url: prompt('Enter Image URL', formData.avatar_url) || formData.avatar_url})}
               />
            </label>
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold tracking-tight">Your Profile</h1>
            <p className="text-text-secondary font-medium tracking-wide">Manage settings and physical baselines.</p>
          </div>
        </div>
        <button onClick={signOut} className="p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 font-black uppercase text-[10px] tracking-widest px-5 h-10 border border-red-500/20">
          <LogOut className="h-3 w-3" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-bg-card/50 backdrop-blur-xl border-white/5 relative">
          <h2 className="text-xl font-heading font-bold tracking-tight mb-6">Personal Info</h2>
          <form onSubmit={handleUpdate} className="space-y-6">
            <Input 
              label="Full Name" 
              value={formData.full_name} 
              onChange={e => setFormData({...formData, full_name: e.target.value})} 
            />
            
            <div className="grid grid-cols-3 gap-4">
              <Input label="Age" type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
              <Input label="Height (cm)" type="number" value={formData.height_cm} onChange={e => setFormData({...formData, height_cm: e.target.value})} />
              <Input label="Weight (kg)" type="number" step="0.1" value={formData.weight_kg} onChange={e => setFormData({...formData, weight_kg: e.target.value})} />
            </div>

            <div className="space-y-2 mt-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Current Goal</label>
              <Select 
                options={[
                  { label: "Lose Weight", value: "Lose Weight" },
                  { label: "Build Muscle", value: "Build Muscle" },
                  { label: "Maintain", value: "Maintain" },
                  { label: "Improve Endurance", value: "Improve Endurance" }
                ]}
                value={formData.goal}
                onChange={(val) => setFormData({ ...formData, goal: val })}
              />
            </div>

            <Button type="submit" fullWidth disabled={submitting} className="h-14 bg-accent hover:bg-accent/80 text-black font-black uppercase tracking-[0.2em] transition-all">
              {submitting ? 'Updating...' : 'Save Profile'}
            </Button>
          </form>
        </Card>

        <div className="space-y-8">
          <Card className="bg-bg-card/50 backdrop-blur-xl border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[60px] pointer-events-none rounded-full"></div>
            <h2 className="text-xl font-heading font-bold tracking-tight mb-6 flex items-center gap-2">
              Daily Target
              <Sparkles className="h-4 w-4 text-accent" />
            </h2>
            <div className="bg-black/20 border border-white/5 p-6 rounded-3xl flex flex-col gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Recommended Intake</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white tracking-tighter italic">{profile?.daily_calorie_target || 2000}</span>
                  <span className="text-xs font-black text-accent uppercase tracking-widest">Kcal</span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full h-12 rounded-2xl border border-white/5 font-black uppercase tracking-widest text-[10px] hover:bg-accent hover:text-black transition-all" 
                onClick={handleRecalculate}
                disabled={calculating}
              >
                {calculating ? 'Calculating...' : 'Recalculate'}
              </Button>
            </div>
          </Card>

          <Card className="bg-bg-card/50 backdrop-blur-xl border-white/5">
            <h2 className="text-xl font-heading font-bold tracking-tight mb-6 text-red-500">Security</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input 
                label="New Password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••"
                required
              />
              <Button type="submit" variant="ghost" className="w-full h-12 rounded-2xl border border-red-500/20 text-red-500 font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all">
                Update Password
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
