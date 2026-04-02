import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { supabase } from '../lib/supabase';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      const { data, error: signUpError } = await signUp(email, password);
      if (signUpError) throw signUpError;
      
      if (data?.user) {
        // Create profile first
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ id: data.user.id, full_name: fullName });
        
        if (profileError) console.error("Profile creation error:", profileError);

        // If user is already logged in (auto-confirm enabled), navigate to dashboard
        if (data.session) {
          navigate('/dashboard');
        } else {
          setError('Signup successful! Please check your email for a confirmation link.');
          setLoading(false);
        }
      } else {
        setError('Signup failed.');
      }
    } catch (err) {
      setError(err.message || 'Failed to sign up');
      setLoading(false);
    } finally {
      // Don't set loading false here if navigating
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg-base text-text-primary">
      {/* Left side editorial */}
      <div className="hidden md:flex flex-1 relative items-center justify-center border-r border-border p-12 bg-bg-surface overflow-hidden group">
        <div className="absolute inset-0 z-0 bg-cover bg-center opacity-[0.03]" />
        <div className="relative z-10 max-w-2xl w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <h1 className="text-6xl lg:text-8xl font-heading font-black tracking-tighter leading-[0.9] text-white">
              Forge<br/>
              yourself.<br/>
              <span className="text-accent underline decoration-4 underline-offset-8">No excuses.</span>
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-6 md:p-12 lg:p-24 bg-bg-base relative min-h-screen">
        <div className="w-full max-w-sm mx-auto mb-10 md:hidden">
          <span className="text-2xl font-heading font-bold tracking-tight text-white px-2 border-l-4 border-accent">Pulse.</span>
        </div>

        <motion.div 
          className="w-full max-w-sm mx-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mb-10">
            <h2 className="text-4xl font-heading font-bold mb-3 tracking-tight text-white leading-tight">Create your account</h2>
            <p className="text-text-secondary font-medium tracking-wide">Join the high-performance movement.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {error && (
              <div className="p-3 bg-danger/10 border border-danger/20 rounded-sm text-sm text-danger font-semibold">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth disabled={loading} className="mt-8 text-lg py-5 tracking-wide uppercase transition-all duration-300">
              {loading ? 'Creating...' : 'Sign Up'}
            </Button>
          </form>

          <p className="mt-8 text-center text-text-secondary font-medium tracking-wide text-sm pb-10">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:text-accent-dim underline decoration-2 underline-offset-4 transition-colors">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
