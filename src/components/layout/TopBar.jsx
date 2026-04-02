import { Bell } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';

export function TopBar() {
  const { profile } = useProfile();
  const userName = profile?.full_name?.split(' ')[0] || 'Athlete';
  
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="flex items-center justify-between p-4 lg:p-8 bg-transparent z-40">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-heading font-bold tracking-tight text-white">
          Dashboard
        </h1>
        <p className="text-sm text-text-secondary uppercase tracking-widest font-semibold flex items-center gap-2">
          {today}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="relative flex items-center justify-center h-12 w-12 rounded-full bg-bg-surface border border-white/5 hover:border-white/10 transition-colors text-text-secondary hover:text-text-primary">
          <Bell className="h-5 w-5" />
          <span className="absolute top-3 right-3 h-2 w-2 bg-accent rounded-full border border-bg-base"></span>
        </button>
        
        {/* User Card */}
        <div className="hidden md:flex items-center gap-3 bg-bg-surface border border-white/5 pl-2 pr-4 h-12 rounded-full cursor-pointer hover:border-white/10 transition-colors">
          <div className="h-8 w-8 rounded-full bg-[#111] overflow-hidden flex items-center justify-center border border-white/10">
            <span className="font-bold text-xs text-white">{userName.charAt(0)}</span>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-sm font-bold text-white leading-tight">{userName}</span>
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
