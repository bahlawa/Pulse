import { motion } from 'framer-motion';

export function MacroBar({ protein = 0, carbs = 0, fat = 0 }) {
  const total = protein + carbs + fat;
  const pPct = total ? (protein / total) * 100 : 0;
  const cPct = total ? (carbs / total) * 100 : 0;
  const fPct = total ? (fat / total) * 100 : 0;

  return (
    <div className="w-full flex-col flex gap-2">
      <div className="flex justify-between text-xs text-text-secondary">
        <div className="flex gap-1 items-center">
          <div className="w-2 h-2 rounded-full bg-success"></div>
          {protein}g PRO
        </div>
        <div className="flex gap-1 items-center">
          <div className="w-2 h-2 rounded-full bg-accent"></div>
          {carbs}g CRB
        </div>
        <div className="flex gap-1 items-center">
          <div className="w-2 h-2 rounded-full bg-orange-400"></div>
          {fat}g FAT
        </div>
      </div>
      <div className="h-2 flex rounded-sm overflow-hidden bg-bg-surface border border-border">
        {pPct > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${pPct}%` }} transition={{ duration: 0.8 }} className="bg-success h-full" />}
        {cPct > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${cPct}%` }} transition={{ duration: 0.8 }} className="bg-accent h-full" />}
        {fPct > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${fPct}%` }} transition={{ duration: 0.8 }} className="bg-orange-400 h-full" />}
      </div>
    </div>
  );
}
