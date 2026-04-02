import { useState } from 'react';
import { useWorkouts } from '../hooks/useWorkouts';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { DatePicker } from '../components/ui/DatePicker';
import { Dumbbell, Trash2, Clock, Flame, Calendar } from 'lucide-react';

export default function LogWorkout() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { workouts, addWorkout, deleteWorkout, loading } = useWorkouts(selectedDate);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Strength',
    duration_minutes: '',
    calories_burned: '',
    notes: ''
  });
  
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.duration_minutes) return;
    
    const duration = parseInt(formData.duration_minutes) || 0;
    const calories = parseInt(formData.calories_burned) || 0;

    if (duration <= 0 || duration > 1440) {
      alert("Please enter a valid duration.");
      return;
    }
    
    if (calories < 0 || calories > 10000) {
      alert("Please enter a valid calorie amount.");
      return;
    }

    setSubmitting(true);
    try {
      await addWorkout({
        ...formData,
        duration_minutes: duration,
        calories_burned: calories,
        logged_at: new Date().toISOString().split('T')[0]
      });
      setFormData({
        name: '',
        type: 'Strength',
        duration_minutes: '',
        calories_burned: '',
        notes: ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const workoutTypes = [
    { label: 'Strength', value: 'Strength' },
    { label: 'Cardio', value: 'Cardio' },
    { label: 'Flexibility', value: 'Flexibility' },
    { label: 'Sports', value: 'Sports' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500">
            <Dumbbell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold tracking-tight">Log Workout</h1>
            <p className="text-text-secondary font-medium tracking-wide">Record your effort. Earn your rest.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-bg-card/50 backdrop-blur-xl border-white/5 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[60px] pointer-events-none rounded-full"></div>
          <h2 className="text-xl font-heading font-bold tracking-tight mb-6 relative z-10">New Session</h2>
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <Input 
              label="Workout Name" 
              placeholder="e.g. Upper Body Power" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required
            />
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Type</label>
              <Select 
                options={workoutTypes}
                value={formData.type}
                onChange={(val) => setFormData({ ...formData, type: val })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Duration (min)" 
                type="number" 
                placeholder="0"
                value={formData.duration_minutes} 
                onChange={e => setFormData({...formData, duration_minutes: e.target.value})} 
                required
              />
              <Input 
                label="Kcal Burned (est)" 
                type="number" 
                placeholder="0"
                value={formData.calories_burned} 
                onChange={e => setFormData({...formData, calories_burned: e.target.value})} 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-secondary">Notes (optional)</label>
              <textarea
                className="bg-bg-base border border-border/50 rounded-2xl p-5 text-text-primary focus:outline-none focus:border-accent focus:bg-bg-surface focus:ring-1 focus:ring-accent transition-all duration-300 min-h-[100px] resize-none placeholder:text-text-muted font-medium"
                placeholder="How did it feel?"
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>

            <Button type="submit" disabled={submitting} fullWidth className="h-14 bg-orange-500 hover:bg-orange-600 text-black font-black uppercase tracking-[0.2em]">
              {submitting ? 'Saving...' : 'Add Session'}
            </Button>
          </form>
        </Card>

        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-bold tracking-tight text-white focus:outline-none">Daily Log</h2>
            <DatePicker 
              value={selectedDate} 
              onChange={setSelectedDate} 
              className="w-[160px]"
            />
          </div>
          
          {loading ? (
            <div className="animate-pulse h-32 bg-bg-surface rounded-xl"></div>
          ) : workouts.length === 0 ? (
            <div className="border border-dashed border-border/30 rounded-2xl p-16 text-center text-text-muted font-black uppercase tracking-widest text-[10px]">
              No sessions for this day.
            </div>
          ) : (
            <div className="space-y-4">
              {workouts.map(workout => (
                <div key={workout.id} className="group p-5 rounded-2xl bg-bg-card/50 backdrop-blur-xl border border-white/5 hover:border-accent/30 transition-all flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{workout.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted mt-1">
                        <span>{workout.duration_minutes} min</span>
                        <span>•</span>
                        <span>{workout.calories_burned} kcal</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => deleteWorkout(workout.id)}
                    className="p-2 text-text-muted opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
