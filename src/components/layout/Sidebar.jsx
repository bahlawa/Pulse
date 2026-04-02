import { NavLink } from 'react-router-dom';
import { Activity, Apple, Dumbbell, LineChart, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { icon: Activity, label: 'Dashboard', path: '/dashboard' },
  { icon: Apple, label: 'Log Meal', path: '/log-meal' },
  { icon: Dumbbell, label: 'Log Workout', path: '/log-workout' },
  { icon: LineChart, label: 'Progress', path: '/progress' },
  { icon: User, label: 'Profile', path: '/profile' }
];

export function Sidebar() {
  const { signOut } = useAuth();

  return (
    <aside className="flex flex-col h-full bg-bg-surface border-r border-border p-6">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-8 h-8 rounded-sm bg-accent flex items-center justify-center">
          <Activity className="h-5 w-5 text-bg-base" strokeWidth={3} />
        </div>
        <span className="text-2xl font-heading font-bold text-text-primary tracking-tight">Pulse.</span>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-4 px-5 py-3.5 rounded-full transition-all duration-300 group font-bold tracking-wide ${
                isActive 
                  ? 'text-bg-base bg-accent shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`h-5 w-5 ${isActive ? 'text-bg-base' : ''}`} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-border pt-4">
        <button
          onClick={signOut}
          className="flex items-center gap-3 w-full px-4 py-3 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-md transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
