import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export function DatePicker({ value, onChange, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(value || Date.now()));
  const containerRef = useRef(null);

  const selectedDate = new Date(value || Date.now());
  selectedDate.setHours(0, 0, 0, 0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onChange(newDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const renderDays = () => {
    const days = [];
    const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const startOffset = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

    // Padding for start of month
    for (let i = 0; i < startOffset; i++) {
      days.push(<div key={`pad-${i}`} className="h-8 w-8" />);
    }

    for (let d = 1; d <= totalDays; d++) {
      const isSelected = selectedDate.getDate() === d &&
        selectedDate.getMonth() === viewDate.getMonth() &&
        selectedDate.getFullYear() === viewDate.getFullYear();

      const isToday = new Date().getDate() === d &&
        new Date().getMonth() === viewDate.getMonth() &&
        new Date().getFullYear() === viewDate.getFullYear();

      days.push(
        <button
          key={d}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDateClick(d);
          }}
          className={`h-9 w-9 rounded-xl flex items-center justify-center text-[11px] font-black transition-all
            ${isSelected
              ? 'bg-accent text-black shadow-[0_0_15px_rgba(77,255,141,0.4)]'
              : isToday
                ? 'border border-accent/40 text-white'
                : 'text-text-secondary hover:bg-white/5 hover:text-white'}`}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest text-accent hover:border-accent/30 transition-all active:scale-95 w-full justify-center"
      >
        <span>{selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        <CalendarIcon className="h-3 w-3" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute z-[100] mt-3 p-4 bg-bg-card/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl w-[280px] left-1/2 -translate-x-1/2"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="h-8 w-8 flex items-center justify-center text-[9px] font-black uppercase tracking-widest text-text-muted">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {renderDays()}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-center">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent">
                {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} selected
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
