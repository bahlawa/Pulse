import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base text-text-primary p-4 relative overflow-hidden">
      
      {/* Premium Cinematic Background Elements */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-8 left-8">
        <span className="text-3xl font-heading font-bold tracking-tight text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent text-bg-base flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          Pulse.
        </span>
      </div>

      <motion.div 
        className="w-full max-w-[480px] z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="glass-card rounded-[32px] p-8 md:p-12 relative overflow-hidden border border-white/5">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
          
          <div className="mb-10">
            <h2 className="text-[2.5rem] font-heading font-bold mb-2 tracking-tight text-white">Sign In</h2>
            <p className="text-text-secondary font-medium tracking-wide">Enter your details to access your dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label=""
              type="email"
              placeholder="Email here"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              label=""
              type="password"
              placeholder="Password here"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="p-3 bg-danger/10 border border-danger/20 rounded-md text-sm text-danger font-semibold">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth disabled={loading} className="mt-8 text-bg-base text-lg py-7">
              {loading ? 'Logging in...' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-10 text-center text-text-secondary font-medium tracking-wide text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent font-bold hover:text-white transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
