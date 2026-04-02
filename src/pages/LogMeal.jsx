import { useState } from 'react';
import { useMeals } from '../hooks/useMeals';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { DatePicker } from '../components/ui/DatePicker';
import { Apple, Trash2, Calendar, Clock } from 'lucide-react';

export default function LogMeal() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { meals, addMeal, deleteMeal, loading } = useMeals(selectedDate);
  
  const [formData, setFormData] = useState({
    name: '',
    meal_type: 'breakfast',
    calories: '',
    protein_g: '',
    carbs_g: '',
    fat_g: ''
  });
  
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.calories) return;
    
    const calories = parseInt(formData.calories) || 0;
    const protein = parseFloat(formData.protein_g) || 0;
    const carbs = parseFloat(formData.carbs_g) || 0;
    const fat = parseFloat(formData.fat_g) || 0;

    if (calories < 0 || calories > 10000) {
      alert("Please enter a valid calorie amount.");
      return;
    }
    
    if (protein < 0 || carbs < 0 || fat < 0 || protein > 1000 || carbs > 1000 || fat > 1000) {
      alert("Please enter valid macro amounts.");
      return;
    }

    setSubmitting(true);
    try {
      await addMeal({
        ...formData,
        calories: calories,
        protein_g: protein,
        carbs_g: carbs,
        fat_g: fat,
        logged_at: selectedDate
      });
      setFormData({
        name: '',
        meal_type: formData.meal_type,
        calories: '',
        protein_g: '',
        carbs_g: '',
        fat_g: ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const mealTypesArr = [
    { label: 'Breakfast', value: 'breakfast' },
    { label: 'Lunch', value: 'lunch' },
    { label: 'Dinner', value: 'dinner' },
    { label: 'Snack', value: 'snack' }
  ];

  const groupedMeals = meals.reduce((acc, meal) => {
    acc[meal.meal_type] = acc[meal.meal_type] || [];
    acc[meal.meal_type].push(meal);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
            <Apple className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold tracking-tight">Log Meal</h1>
            <p className="text-text-secondary font-medium tracking-wide">Fuel your body. Track your macros.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-bg-card/50 backdrop-blur-xl border-white/5 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[60px] pointer-events-none rounded-full"></div>
          <h2 className="text-xl font-heading font-bold tracking-tight mb-6 relative z-10">Manual Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <Input 
              label="Food Name" 
              placeholder="e.g. Grilled Chicken Breast" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required
            />
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Meal Type</label>
              <Select 
                options={mealTypesArr}
                value={formData.meal_type}
                onChange={(val) => setFormData({ ...formData, meal_type: val })}
              />
            </div>

            <Input 
              label="Calories (kcal)" 
              type="number" 
              value={formData.calories} 
              onChange={e => setFormData({...formData, calories: e.target.value})} 
              required
            />
            
            <div className="grid grid-cols-3 gap-4">
              <Input label="Protein (g)" type="number" step="0.1" value={formData.protein_g} onChange={e => setFormData({...formData, protein_g: e.target.value})} />
              <Input label="Carbs (g)" type="number" step="0.1" value={formData.carbs_g} onChange={e => setFormData({...formData, carbs_g: e.target.value})} />
              <Input label="Fat (g)" type="number" step="0.1" value={formData.fat_g} onChange={e => setFormData({...formData, fat_g: e.target.value})} />
            </div>

            <Button type="submit" fullWidth disabled={submitting} className="h-14 bg-accent hover:bg-accent/80 text-black font-black uppercase tracking-[0.2em] transition-all">
              {submitting ? 'Adding...' : 'Add to Log'}
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
          ) : meals.length === 0 ? (
            <div className="border border-dashed border-border/30 rounded-2xl p-16 text-center text-text-muted font-black uppercase tracking-widest text-[10px]">
              No meals logged for this day.
            </div>
          ) : (
            <div className="space-y-6">
              {['breakfast', 'lunch', 'dinner', 'snack'].map(type => {
                const group = groupedMeals[type] || [];
                if (group.length === 0) return null;
                
                return (
                  <div key={type} className="space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">{type}</h3>
                    <div className="space-y-2">
                      {group.map(meal => (
                        <div key={meal.id} className="group flex items-center justify-between p-4 rounded-2xl bg-bg-card/50 backdrop-blur-xl border border-white/5 hover:border-accent/30 transition-all">
                          <div className="flex-1">
                            <h4 className="font-bold text-white text-sm">{meal.name}</h4>
                            <div className="flex gap-3 text-[10px] font-black uppercase tracking-widest text-text-muted mt-2">
                              <span><span className="text-accent">P</span> {meal.protein_g || 0}g</span>
                              <span><span className="text-accent">C</span> {meal.carbs_g || 0}g</span>
                              <span><span className="text-accent">F</span> {meal.fat_g || 0}g</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-lg tracking-tight text-accent">{meal.calories}</span>
                            <button 
                              onClick={() => deleteMeal(meal.id)}
                              className="text-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
