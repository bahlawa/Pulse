import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Flame, Droplets, Trophy, Activity, Plus, Zap, Heart, Wind } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useMeals } from '../hooks/useMeals';
import { useWorkouts } from '../hooks/useWorkouts';
import { Card } from '../components/ui/Card';
import { ProgressRing } from '../components/ui/ProgressRing';
import { MacroBar } from '../components/ui/MacroBar';
import { Button } from '../components/ui/Button';
import { WeeklyCalorieChart } from '../components/charts/WeeklyCalorieChart';

export default function Dashboard() {
  const { profile, loading: profileLoading } = useProfile();
  const { meals, loading: mealsLoading } = useMeals();
  const { workouts, loading: workoutsLoading } = useWorkouts();

  const [water, setWater] = useState(0);

  if (profileLoading || mealsLoading || workoutsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Activity className="h-8 w-8 text-accent" />
        </motion.div>
      </div>
    );
  }

  const targetCalories = profile?.daily_calorie_target || 3000;
  const consumedCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const protein = meals.reduce((sum, meal) => sum + Number(meal.protein_g), 0);
  const carbs = meals.reduce((sum, meal) => sum + Number(meal.carbs_g), 0);
  const fat = meals.reduce((sum, meal) => sum + Number(meal.fat_g), 0);
  const burnedCalories = workouts.reduce((sum, w) => sum + w.calories_burned, 0);

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-700">
      
      {/* 4-Column Metric Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          { icon: Zap, label: 'Active Energy', value: `${burnedCalories}`, unit: 'kcal', color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { icon: Droplets, label: 'Hydration', value: `${water}`, unit: 'glasses', color: 'text-blue-500', bg: 'bg-blue-500/10', onClick: () => setWater(w => w + 1) },
          { icon: Heart, label: 'Heart Rate', value: '--', unit: 'bpm', color: 'text-red-500', bg: 'bg-red-500/10' },
          { icon: Wind, label: 'VO2 Max', value: '--', unit: 'ml/kg', color: 'text-purple-500', bg: 'bg-purple-500/10' }
        ].map((stat, i) => (
          <Card key={i} animate index={i} className="p-4 flex flex-col gap-3 hover:border-accent/20 transition-all cursor-pointer group" onClick={stat.onClick}>
            <div className={`w-10 h-10 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">{stat.label}</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white italic">{stat.value}</span>
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{stat.unit}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* BIG PROGRESS RING SECTION */}
        <Card animate index={4} className="lg:col-span-2 flex flex-col items-center justify-center p-8 lg:p-12 relative overflow-hidden bg-gradient-to-br from-bg-card to-bg-base">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 blur-[120px] pointer-events-none rounded-full" />
          
          <div className="text-center mb-8 relative z-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">Today's Consumption</h2>
            <div className="text-3xl font-black text-white italic tracking-tighter">Energy Balance</div>
          </div>
          
          <div className="relative group flex items-center justify-center">
            <ProgressRing 
              value={consumedCalories} 
              max={targetCalories} 
              size={320} 
              strokeWidth={24} 
              color="#4dff8d" 
              bgStroke="rgba(255,255,255,0.05)"
            >
              <div className="flex flex-col items-center justify-center pointer-events-none">
                <span className="text-6xl font-black text-white tracking-tighter italic mr-2">
                  {targetCalories - consumedCalories}
                </span>
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-2">Kcal Left</span>
              </div>
            </ProgressRing>
          </div>

          <div className="grid grid-cols-3 gap-12 mt-12 w-full max-w-md relative z-10">
            <div className="text-center">
              <div className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Target</div>
              <div className="text-xl font-black text-white italic">{targetCalories}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] font-black uppercase tracking-widest text-accent mb-1">Eaten</div>
              <div className="text-xl font-black text-accent italic">{consumedCalories}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-1">Burned</div>
              <div className="text-xl font-black text-orange-500 italic">{burnedCalories}</div>
            </div>
          </div>
        </Card>

        {/* MACROS & STREAK */}
        <div className="space-y-6 lg:space-y-8 flex flex-col">
          <Card animate index={5} className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-text-muted">Macros Breakdown</h2>
              <Link to="/log-meal">
                <Plus className="h-4 w-4 text-accent hover:scale-125 transition-transform" />
              </Link>
            </div>
            
            <div className="space-y-8">
              {[
                { label: 'Protein', value: Math.round(protein), unit: 'g', color: 'bg-accent' },
                { label: 'Carbs', value: Math.round(carbs), unit: 'g', color: 'bg-blue-500' },
                { label: 'Fat', value: Math.round(fat), unit: 'g', color: 'bg-orange-500' }
              ].map((macro, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{macro.label}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-white italic">{macro.value}</span>
                      <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">{macro.unit}</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((macro.value / 200) * 100, 100)}%` }}
                      className={`h-full ${macro.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card animate index={6} className="bg-gradient-to-br from-bg-card to-bg-surface border-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Consistency</h3>
                <div className="text-4xl font-black text-accent italic tracking-tighter flex items-center gap-2">
                  <Trophy className="h-6 w-6" />
                  -- <span className="text-sm font-black text-white uppercase tracking-widest">Days</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Flame className="h-6 w-6 text-accent" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Weekly Chart */}
        <Card animate index={7} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-text-muted">Weekly Progress</h2>
            <div className="text-sm font-black text-white italic tracking-tighter">Avg {Math.round(consumedCalories*0.8)} kcal</div>
          </div>
          <WeeklyCalorieChart target={targetCalories} />
        </Card>

        {/* RECENT WORKOUTS */}
        <Card animate index={8} className="flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-text-muted">Latest Sessions</h2>
            <Link to="/log-workout" className="text-[9px] font-black uppercase tracking-widest text-accent hover:underline">View All</Link>
          </div>
          
          {workouts.length > 0 ? (
            <div className="space-y-3">
              {workouts.slice(0, 3).map(workout => (
                <div key={workout.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/30 transition-all flex justify-between items-center group">
                  <div>
                    <div className="text-sm font-black text-white uppercase tracking-tight">{workout.name}</div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-text-muted mt-1">{workout.duration_minutes}m • {workout.type}</div>
                  </div>
                  <div className="text-sm font-black text-accent italic">
                    {workout.calories_burned}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center border border-dashed border-white/5 rounded-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-4">No sessions logged</p>
              <Link to="/log-workout">
                <Button variant="ghost" size="sm" className="border border-white/5 text-[9px]">Log First</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
