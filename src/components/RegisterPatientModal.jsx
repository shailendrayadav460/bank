import { useState } from 'react';
import { 
  X, Check, User, Mail, 
  Phone, Lock, Calendar, Heart, Loader2,
  Stethoscope, MapPin, Activity
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import authService from '../services/authService';
import { toast } from 'react-toastify';

const InputField = ({ icon: Icon, label, type, name, placeholder, options, formData, handleChange, loading, T }) => (
  <div className="flex flex-col gap-1.5 mb-4">
    <label className="text-[11px] font-black tracking-wide uppercase" style={{ color: T.textSub }}>{label}</label>
    <div className="relative flex items-center">
      <div className="absolute left-3 flex items-center justify-center pointer-events-none">
        {Icon ? <Icon size={16} color={T.textSub} /> : null}
      </div>
      {options ? (
        <select 
          name={name} value={formData[name]} onChange={handleChange} disabled={loading}
          className="w-full pl-10 pr-4 py-2.5 text-[13px] rounded-lg border outline-none appearance-none cursor-pointer transition-all disabled:opacity-50 font-bold"
          style={{ backgroundColor: T.inputBg, borderColor: T.border, color: T.text }}
          onFocus={(e) => e.target.style.borderColor = T.primary}
          onBlur={(e) => e.target.style.borderColor = T.border}
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input 
          type={type} name={name} placeholder={placeholder} 
          value={formData[name]} onChange={handleChange} disabled={loading}
          className="w-full pl-10 pr-4 py-2.5 text-[13px] rounded-lg border outline-none transition-all placeholder-opacity-50 disabled:opacity-50 font-bold"
          style={{ backgroundColor: T.inputBg, borderColor: T.border, color: T.text }}
          onFocus={(e) => e.target.style.borderColor = T.primary}
          onBlur={(e) => e.target.style.borderColor = T.border}
        />
      )}
    </div>
  </div>
);

const RegisterPatientModal = ({ isOpen, onClose, onPatientRegistered }) => {
  const { theme: T } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '',
    phone: '', age: '', gender: 'Male', bloodGroup: 'O+', 
    address: '', condition: 'Stable'
  });

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setLoading(false);
    setFormData({
      firstName: '', lastName: '', email: '', password: '',
      phone: '', age: '', gender: 'Male', bloodGroup: 'O+', 
      address: '', condition: 'Stable'
    });
  };

  const handleClose = () => {
    if (loading) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.warning('Core credentials are required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: 'patient',
        phone: formData.phone,
        gender: formData.gender.toLowerCase(),
        blood_group: formData.bloodGroup,
        address: formData.address,
        hospital_name: 'TTOOLECG Medical Center',
        // Optional clinical data can be sent as additional fields or handled by backend
      };

      const result = await authService.register(payload);
      toast.success(result.message || 'Patient registered successfully');
      if (onPatientRegistered) onPatientRegistered(result.user);
      handleClose();
    } catch (err) {
      toast.error(err.message || 'Patient registration failed');
    } finally {
      setLoading(false);
    }
  };

  const commonProps = { formData, handleChange, loading, T };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
      <div 
        className="relative flex flex-col w-full max-w-[500px] max-h-[90vh] overflow-hidden border shadow-2xl rounded-2xl animate-in zoom-in-95 duration-300" 
        style={{ backgroundColor: T.card, borderColor: T.border }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: T.border, backgroundColor: T.bg }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: T.primary }}>
               <Heart size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight" style={{ color: T.text }}>Patient Registration</h2>
              <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: T.textSub }}>Hospital Management System</p>
            </div>
          </div>
          <button onClick={handleClose} disabled={loading} className="p-2 rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50" style={{ color: T.textSub }}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <InputField icon={User} label="First Name" type="text" name="firstName" placeholder="John" {...commonProps} />
            <InputField icon={User} label="Last Name" type="text" name="lastName" placeholder="Doe" {...commonProps} />
          </div>
          
          <InputField icon={Mail} label="Email Identity" type="email" name="email" placeholder="john.doe@example.com" {...commonProps} />
          <InputField icon={Lock} label="Access Password" type="password" name="password" placeholder="••••••••" {...commonProps} />

          <div className="my-6 border-t border-dashed" style={{ borderColor: T.border }} />
          
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2" style={{ color: T.primary }}>
            <Activity size={14} /> Clinical Profile
          </h3>

          <div className="grid grid-cols-2 gap-4">
             <InputField icon={Phone} label="Primary Phone" type="text" name="phone" placeholder="+91 90000 00000" {...commonProps} />
             <InputField icon={Calendar} label="Patient Age" type="number" name="age" placeholder="e.g. 45" {...commonProps} />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <InputField icon={User} label="Gender" type="text" name="gender" options={['Male', 'Female', 'Other']} {...commonProps} />
             <InputField icon={Heart} label="Blood Group" type="text" name="bloodGroup" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} {...commonProps} />
          </div>

          <InputField icon={MapPin} label="Home Address" type="text" name="address" placeholder="Full address details..." {...commonProps} />
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t flex items-center justify-between" style={{ borderColor: T.border, backgroundColor: T.bg }}>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: T.primary }} />
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>Ready for sync</span>
           </div>
           <div className="flex gap-3">
              <button onClick={handleClose} disabled={loading} className="px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all" style={{ color: T.textSub }}>Cancel</button>
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-white text-[11px] font-black uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                style={{ backgroundColor: T.primary, boxShadow: `0 10px 15px -3px ${T.primary}40` }}
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                {loading ? 'Processing...' : 'Register Patient'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPatientModal;
