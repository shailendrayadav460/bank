import { Link } from 'react-router-dom';
import { User, Mail, Lock, HeartPulse } from 'lucide-react';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4fb] font-['DM_Sans',sans-serif] relative overflow-hidden px-4">
      {/* Pattern Backgrounds */}
      <div className="absolute inset-0 opacity-40 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#e2eaf7 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(27, 111, 222, 0.06) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(27, 111, 222, 0.06) 0%, transparent 70%)' }} />

      <div className="max-w-xl w-full bg-[#ffffff] border border-[#e2eaf7] p-10 rounded-[2.5rem] shadow-[0_2px_12px_rgba(27,111,222,0.06)] relative z-10 my-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#f0f4fb] text-[#1b6fde] rounded-2xl mb-4 shadow-sm transform -rotate-6 transition-transform hover:rotate-12 duration-500 border border-[#e2eaf7]">
            <HeartPulse className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-[#0d1530] mb-2 tracking-tighter">Join ECG Portal</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Create your professional profile today.</p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 col-span-1">
            <label className="text-sm font-bold text-slate-500 ml-1 uppercase tracking-tighter">First Name</label>
            <input type="text" placeholder="John" className="w-full bg-[#f0f4fb] border-2 border-[#e2eaf7] rounded-2xl py-3.5 px-6 text-[#0d1530] placeholder-slate-400 focus:outline-none focus:bg-[#ffffff] focus:ring-1 focus:ring-[#1b6fde] focus:border-[#1b6fde] transition-all duration-300 font-bold" />
          </div>
          <div className="space-y-2 col-span-1">
            <label className="text-sm font-bold text-slate-500 ml-1 uppercase tracking-tighter">Last Name</label>
            <input type="text" placeholder="Doe" className="w-full bg-[#f0f4fb] border-2 border-[#e2eaf7] rounded-2xl py-3.5 px-6 text-[#0d1530] placeholder-slate-400 focus:outline-none focus:bg-[#ffffff] focus:ring-1 focus:ring-[#1b6fde] focus:border-[#1b6fde] transition-all duration-300 font-bold" />
          </div>

          <div className="space-y-2 col-span-full">
            <label className="text-sm font-bold text-slate-500 ml-1 uppercase tracking-tighter">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-12 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-[#1b6fde]">
                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-[#1b6fde]" />
              </div>
              <input type="email" placeholder="john@example.com" className="w-full bg-[#f0f4fb] border-2 border-[#e2eaf7] rounded-2xl py-3.5 pl-20 pr-6 text-[#0d1530] placeholder-slate-400 focus:outline-none focus:bg-[#ffffff] focus:ring-1 focus:ring-[#1b6fde] focus:border-[#1b6fde] transition-all duration-300 font-bold" />
            </div>
          </div>

          <div className="space-y-2 col-span-full">
            <label className="text-sm font-bold text-slate-500 ml-1 uppercase tracking-tighter">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-12 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-[#1b6fde]">
                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-[#1b6fde]" />
              </div>
              <input type="password" placeholder="••••••••" className="w-full bg-[#f0f4fb] border-2 border-[#e2eaf7] rounded-2xl py-3.5 pl-20 pr-6 text-[#0d1530] placeholder-slate-400 focus:outline-none focus:bg-[#ffffff] focus:ring-1 focus:ring-[#1b6fde] focus:border-[#1b6fde] transition-all duration-300 font-bold" />
            </div>
          </div>

          <button
            type="button"
            className="w-full col-span-full bg-[#1b6fde] text-[#ffffff] font-black py-5 rounded-[1.5rem] mt-4 hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-300 shadow-xl active:scale-95 uppercase tracking-widest text-sm"
          >
            Create Free Account
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#e2eaf7] pt-8">
          <p className="text-slate-500 font-medium">Already have an account? <Link to="/login" className="text-[#1b6fde] font-black hover:underline ml-1">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
