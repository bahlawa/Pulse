import { NavLink } from 'react-router-dom';
import { Activity, Apple, Dumbbell, User, LineChart } from 'lucide-react';

const mobileNavItems = [
  { icon: Activity, label: 'Dashboard', path: '/dashboard' },
  { icon: Apple, label: 'Meals', path: '/log-meal' },
  { icon: Dumbbell, label: 'Workouts', path: '/log-workout' },
  { icon: LineChart, label: 'Progress', path: '/progress' },
  { icon: User, label: 'Profile', path: '/profile' }
];

export function BottomNav() {
  return (
    <nav className="flex justify-around items-center h-16">
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => 
            `flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[4rem]
            ${isActive ? 'text-accent' : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'}`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon className={`h-6 w-6 stroke-2 ${isActive ? 'stroke-accent fill-accent/10' : ''}`} />
              <span className={`text-[10px] uppercase font-bold tracking-widest mt-1 ${isActive ? 'text-accent' : ''}`}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
