import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useWorkouts } from '../hooks/useWorkouts';
import { supabase } from '../lib/supabase';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { LineChart as ChartIcon, Upload, Calendar } from 'lucide-react';

export default function Progress() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { workouts } = useWorkouts();
  
  // Weights Data Processing
  const demoWeightLogs = Array.from({ length: 30 }, (_, i) => ({
    id: `demo-weight-${i}`,
    weight_kg: 82.5 - (i * 0.1) + (Math.sin(i) * 0.5),
    logged_at: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0]
  }));

  const [weightLogs, setWeightLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newWeight, setNewWeight] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statsRange, setStatsRange] = useState('7d');
  const [weightRange, setWeightRange] = useState('30d');
  
  const [measurements, setMeasurements] = useState(() => {
    const saved = localStorage.getItem('pulse_measurements');
    return saved ? JSON.parse(saved) : { chest: '', waist: '', arms: '', thighs: '' };
  });
  const [savingMetrics, setSavingMetrics] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchWeightLogs() {
      if (!user) return;
      const { data } = await supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: true })
        .limit(30);
      
      const realData = data || [];
      setWeightLogs([...demoWeightLogs, ...realData]);
      setLoading(false);
    }
    fetchWeightLogs();

    async function fetchPhotos() {
      if (!user) return;
      const { data } = await supabase
        .from('progress_photos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      setPhotos(data || []);
    }
    fetchPhotos();
  }, [user]);

  // Aggregate Data for Stats Chart
  const statsData = useMemo(() => {
    const dataMap = {};
    const days = statsRange === '7d' ? 7 : 30;
    const dateArray = Array.from({ length: days }, (_, i) => {
      const d = new Date(Date.now() - (days - 1 - i) * 86400000);
      return d.toISOString().split('T')[0];
    });

    dateArray.forEach(date => {
      dataMap[date] = { date: date.split('-')[1] + '/' + date.split('-')[2], workouts: 0, minutes: 0, kcal: 0 };
    });

    workouts.forEach(w => {
      if (dataMap[w.logged_at]) {
        dataMap[w.logged_at].workouts += 1;
        dataMap[w.logged_at].minutes += w.duration_minutes || 0;
        dataMap[w.logged_at].kcal += w.calories_burned || 0;
      }
    });

    return Object.values(dataMap);
  }, [workouts, statsRange]);

  const weightChartData = useMemo(() => {
    const now = new Date();
    return weightLogs.filter(log => {
      if (weightRange === 'all') return true;
      const logDate = new Date(log.logged_at);
      const diffDays = (now - logDate) / 86400000;
      if (weightRange === '30d') return diffDays <= 30;
      if (weightRange === '90d') return diffDays <= 90;
      return true;
    }).map(log => ({
      date: new Date(log.logged_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: parseFloat(log.weight_kg.toFixed(1))
    }));
  }, [weightLogs, weightRange]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Please keep the image under 5MB.');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('progress').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('progress').getPublicUrl(fileName);
      const { data, error: dbError } = await supabase.from('progress_photos').insert({ user_id: user.id, photo_url: publicUrl }).select().single();
      if (dbError) throw dbError;
      setPhotos([data, ...photos]);
    } catch (err) {
      console.error(err);
      alert('Upload failed. Check storage configurations.');
    } finally {
      setUploading(false);
    }
  };

  const currentWeight = weightLogs[weightLogs.length - 1]?.weight_kg || 0;

  const handleSaveMetrics = () => {
    setSavingMetrics(true);
    setTimeout(() => {
      localStorage.setItem('pulse_measurements', JSON.stringify(measurements));
      setSavingMetrics(false);
    }, 600);
  };

  const handleLogWeight = async (e) => {
    e.preventDefault();
    if (!newWeight) return;
    try {
      const { data, error } = await supabase
        .from('weight_logs')
        .insert({ user_id: user.id, weight_kg: parseFloat(newWeight), logged_at: new Date().toISOString().split('T')[0] })
        .select().single();
      if (error) throw error;
      setWeightLogs([...weightLogs, data]);
      setNewWeight('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 p-4 lg:p-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-heading font-bold tracking-tight text-white mb-2">Progress</h1>
          <p className="text-text-secondary font-medium tracking-wide">Detailed insights into your evolution.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <form onSubmit={handleLogWeight} className="flex gap-2">
            <input 
              type="number" 
              step="0.1"
              placeholder="Latest weight..." 
              className="bg-bg-surface border border-white/5 rounded-full px-5 h-11 text-sm font-bold text-white w-32 focus:outline-none focus:border-accent"
              value={newWeight}
              onChange={e => setNewWeight(e.target.value)}
            />
            <Button type="submit" className="h-11 px-6 rounded-full bg-accent hover:bg-accent/80 text-black font-bold uppercase text-[10px] tracking-widest transition-all">Log</Button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* STATISTICS SECTION */}
          <Card className="p-6 bg-bg-card/50 backdrop-blur-xl border-white/5 shadow-2xl relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] pointer-events-none rounded-full"></div>
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h2 className="text-2xl font-bold tracking-tight text-white focus:outline-none">Statistics</h2>
              <Select 
                options={[
                  { label: "This Week", value: "7d" },
                  { label: "This Month", value: "30d" }
                ]}
                value={statsRange} 
                onChange={setStatsRange}
                className="w-[140px]"
              />
            </div>

            <div className="flex gap-6 mb-8 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-10 h-1 rounded-full bg-[#ff4d4d]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Workouts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-1 rounded-full bg-[#4dff4d]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-1 rounded-full bg-[#ffaa00]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Kcal</span>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={statsData}>
                  <defs>
                    <linearGradient id="colorWorkouts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff4d4d" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ff4d4d" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4dff4d" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4dff4d" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorKcal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffaa00" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ffaa00" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }} 
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px', fontWeight: '900' }}
                    itemStyle={{ padding: '2px 0' }}
                  />
                  <Area type="monotone" dataKey="workouts" stroke="#ff4d4d" strokeWidth={3} fillOpacity={1} fill="url(#colorWorkouts)" />
                  <Area type="monotone" dataKey="minutes" stroke="#4dff4d" strokeWidth={3} fillOpacity={1} fill="url(#colorMinutes)" />
                  <Area type="monotone" dataKey="kcal" stroke="#ffaa00" strokeWidth={3} fillOpacity={1} fill="url(#colorKcal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* WEIGHT SECTION */}
          <Card className="p-6 bg-bg-card/50 backdrop-blur-xl border-white/5 shadow-2xl relative">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-white focus:outline-none">Weight</h2>
              <Select 
                options={[
                  { label: "Last Month", value: "30d" },
                  { label: "Last 3 Months", value: "90d" },
                  { label: "All Time", value: "all" }
                ]}
                value={weightRange} 
                onChange={setWeightRange}
                className="w-[160px]"
              />
            </div>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightChartData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4dff4d" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4dff4d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }} 
                    dy={15}
                  />
                  <YAxis 
                    domain={['dataMin - 5', 'dataMax + 5']}
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }} 
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#4dff4d" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorWeight)" 
                    dot={{ fill: '#4dff4d', strokeWidth: 4, r: 4, stroke: '#111' }}
                    activeDot={{ r: 8, fill: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          {/* PROGRESS PHOTOS */}
          <Card className="p-6 bg-bg-card/50 backdrop-blur-xl border-white/5 shadow-2xl">
            <h2 className="text-xl font-bold tracking-tight text-white mb-6">Gallery</h2>
            <div className="grid grid-cols-2 gap-3">
              <label className={`aspect-[3/4] bg-white/5 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all group ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
                <Upload className="h-5 w-5 text-accent group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest mt-2 text-text-muted group-hover:text-accent">Add</span>
              </label>

              {photos.slice(0, 5).map((photo, index) => (
                <div key={photo.id} className="aspect-[3/4] rounded-2xl border border-white/5 overflow-hidden relative group">
                  <img src={photo.photo_url} alt={`Progress ${index}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                    <span className="text-[10px] text-white font-black uppercase tracking-widest text-center">
                      {new Date(photo.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* MEASUREMENTS SECTION */}
          <Card className="p-6 bg-bg-card/50 backdrop-blur-xl border-white/5 shadow-2xl">
            <h2 className="text-xl font-bold tracking-tight text-white mb-6">Body Metrics</h2>
            <div className="space-y-4">
              {['chest', 'waist', 'arms', 'thighs'].map(metric => (
                <div key={metric} className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
                  <span className="text-xs font-black uppercase tracking-widest text-text-muted">{metric}</span>
                  <input 
                    type="number"
                    value={measurements[metric]}
                    onChange={(e) => setMeasurements(prev => ({ ...prev, [metric]: e.target.value }))}
                    placeholder="-- cm"
                    className="w-20 bg-transparent text-right text-sm font-bold text-white focus:outline-none placeholder:text-text-muted/50"
                  />
                </div>
              ))}
              <Button 
                variant="ghost" 
                fullWidth 
                onClick={handleSaveMetrics}
                disabled={savingMetrics}
                className="text-[10px] font-black uppercase tracking-[0.2em] border border-white/5 rounded-full mt-4 hover:bg-white/5 transition-all"
              >
                {savingMetrics ? 'Saving...' : 'Update All'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
