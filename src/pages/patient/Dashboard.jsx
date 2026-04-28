import { Heart, Activity, FileText, Calendar, Plus, Share2 } from 'lucide-react';

const PatientDashboard = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Personal Health Hub</h1>
          <p className="text-slate-500 font-medium">Your heart's journey, monitored and secure.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 rounded-2xl text-white font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 active:scale-95">
          <Plus className="w-5 h-5" /> New ECG Test
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="card-modern">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 uppercase tracking-widest text-xs">Latest Reading</h3>
            <span className="p-2 bg-emerald-50 rounded-xl text-emerald-500"><Heart className="w-5 h-5" /></span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-black text-slate-900">72</span>
            <span className="text-slate-400 font-black">BPM</span>
          </div>
          <p className="text-sm font-bold text-emerald-500 flex items-center gap-1.5 mt-4">
            <Activity className="w-4 h-4 animate-pulse" /> Normal Rhythmn detected
          </p>
        </div>

        <div className="card-modern lg:col-span-2">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              Recent Cardiologist Reviews
            </h3>
            <button className="text-indigo-600 text-sm font-black uppercase tracking-widest hover:underline">View All</button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold">Dr</div>
                <div>
                  <p className="text-sm font-bold text-slate-900 tracking-tight uppercase">Dr. Angela Parker</p>
                  <p className="text-xs font-bold text-slate-400">Regular Check-up Report</p>
                </div>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter italic">Oct 24, 2023</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
