import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '../hooks/useProfile';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    height_cm: '',
    weight_kg: '',
    gender: 'male',
    goal: '',
    activity_level: '',
    daily_calorie_target: 2000
  });
  
  const { updateProfile, loading } = useProfile();
  const navigate = useNavigate();

  // Mifflin-St Jeor Formula
  useEffect(() => {
    if (step === 4) {
      const { age, height_cm, weight_kg, gender, goal, activity_level } = formData;
      if (!age || !height_cm || !weight_kg) return;

      let bmr = (10 * parseFloat(weight_kg)) + (6.25 * parseFloat(height_cm)) - (5 * parseInt(age));
      bmr += (gender === 'male' ? 5 : -161);

      const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        very_active: 1.725
      };
      
      let tdee = bmr * (activityMultipliers[activity_level] || 1.2);
      
      // Goal adjustment
      if (goal === 'Lose Weight') tdee -= 500;
      if (goal === 'Build Muscle') tdee += 300;
      
      setFormData(prev => ({ ...prev, daily_calorie_target: Math.round(tdee) }));
    }
  }, [step, formData.age, formData.height_cm, formData.weight_kg, formData.gender, formData.goal, formData.activity_level]);

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleComplete = async () => {
    try {
      await updateProfile({
        age: parseInt(formData.age),
        height_cm: parseInt(formData.height_cm),
        weight_kg: parseFloat(formData.weight_kg),
        gender: formData.gender,
        goal: formData.goal,
        activity_level: formData.activity_level,
        daily_calorie_target: parseInt(formData.daily_calorie_target)
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const goals = ['Lose Weight', 'Build Muscle', 'Maintain', 'Improve Endurance'];
  const activityLevels = [
    { id: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
    { id: 'light', label: 'Light', desc: 'Exercise 1-3 days/week' },
    { id: 'moderate', label: 'Moderate', desc: 'Exercise 3-5 days/week' },
    { id: 'very_active', label: 'Very Active', desc: 'Hard exercise 6-7 days/week' }
  ];

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl relative">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between text-xs text-text-secondary uppercase tracking-widest font-bold mb-4">
            <span>Step {step} of 4</span>
          </div>
          <div className="h-1 bg-bg-surface w-full rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-accent relative"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/40 to-transparent shadow-[0_0_10px_2px_rgba(255,255,255,0.2)]"></div>
            </motion.div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <h2 className="text-4xl font-heading font-bold mb-2 tracking-tight">Vitals</h2>
                <p className="text-text-secondary font-medium tracking-wide">Tell us about your physical baselines.</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Input label="Age" type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-text-secondary">Gender</label>
                  <select 
                    className="bg-bg-surface border border-border rounded-sm h-12 px-4 text-text-primary focus:outline-none focus:border-accent"
                    value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <Input label="Height (cm)" type="number" value={formData.height_cm} onChange={e => setFormData({...formData, height_cm: e.target.value})} />
                <Input label="Weight (kg)" type="number" value={formData.weight_kg} onChange={e => setFormData({...formData, weight_kg: e.target.value})} />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <h2 className="text-4xl font-heading font-bold mb-2 tracking-tight">Your Goal</h2>
                <p className="text-text-secondary font-medium tracking-wide">What are you striving for?</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {goals.map(goal => (
                  <motion.button
                    key={goal}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({...formData, goal})}
                    className={`p-6 rounded-lg border text-left transition-all cursor-pointer ${
                      formData.goal === goal 
                        ? 'bg-accent border-accent text-bg-base shadow-[0_0_20px_rgba(200,240,96,0.3)]' 
                        : 'bg-bg-card border-border hover:border-accent hover:shadow-[0_0_15px_rgba(200,240,96,0.1)]'
                    }`}
                  >
                    <h3 className="text-xl font-heading font-bold tracking-tight">{goal}</h3>
                    <div className={`mt-2 h-1 w-8 rounded-full transition-all ${formData.goal === goal ? 'bg-bg-base/30' : 'bg-accent/20'}`}></div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <h2 className="text-4xl font-heading font-bold mb-2 tracking-tight">Activity Level</h2>
                <p className="text-text-secondary font-medium tracking-wide">How active is your lifestyle?</p>
              </div>
              <div className="flex flex-col gap-4">
                {activityLevels.map(level => (
                  <motion.button
                    key={level.id}
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setFormData({...formData, activity_level: level.id})}
                    className={`p-5 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                      formData.activity_level === level.id 
                        ? 'bg-accent border-accent text-bg-base shadow-[0_0_20px_rgba(200,240,96,0.3)]' 
                        : 'bg-bg-card border-border hover:border-accent hover:shadow-[0_0_15px_rgba(200,240,96,0.1)]'
                    }`}
                  >
                    <div>
                      <h3 className="text-lg font-heading font-bold tracking-tight">{level.label}</h3>
                      <p className={`text-sm mt-1 ${formData.activity_level === level.id ? 'text-bg-base/70' : 'text-text-secondary'}`}>{level.desc}</p>
                    </div>
                    {formData.activity_level === level.id && (
                      <div className="h-6 w-6 rounded-full bg-bg-base flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-accent"></div>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <h2 className="text-4xl font-heading font-bold mb-2 tracking-tight">Your Target</h2>
                <p className="text-text-secondary font-medium tracking-wide">Calculated based on your vitals and goal. You can adjust this.</p>
              </div>
              <Card className="text-center py-12">
                <div className="text-6xl font-heading font-black tracking-tighter text-accent mb-4">
                  {formData.daily_calorie_target}
                </div>
                <div className="text-sm text-text-secondary uppercase tracking-widest font-bold">Kcal / Day</div>
                
                <div className="mt-8 max-w-xs mx-auto">
                  <Input 
                    type="number" 
                    value={formData.daily_calorie_target} 
                    onChange={e => setFormData({...formData, daily_calorie_target: parseInt(e.target.value) || 0})}
                    className="text-center"
                  />
                  <p className="text-xs text-text-muted mt-3">Manual adjustment</p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-12 gap-4">
          <Button variant="ghost" onClick={handleBack} disabled={step === 1} className="w-32">
            Back
          </Button>
          {step < 4 ? (
            <Button 
              onClick={handleNext} 
              className="w-32 tracking-wide font-bold"
              disabled={
                (step === 1 && (!formData.age || !formData.height_cm || !formData.weight_kg)) ||
                (step === 2 && !formData.goal) ||
                (step === 3 && !formData.activity_level)
              }
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={loading} className="w-48 tracking-wide font-bold">
              {loading ? 'Saving...' : 'Finish Setup'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
