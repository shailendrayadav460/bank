import { useState } from 'react';
import { 
  X, ArrowRight, ArrowLeft, Check, User, Mail, Briefcase, 
  Phone, Lock, Building, Calendar, Shield, Heart, Hash, Loader2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import authService from '../services/authService';
import { toast } from 'react-toastify';

// InputField defined OUTSIDE to prevent focus loss issues
const InputField = ({ icon: Icon, label, type, name, placeholder, options, formData, handleChange, loading, T }) => (
  <div className="flex flex-col gap-1.5 mb-4">
    <label className="text-[11px] font-semibold tracking-wide uppercase" style={{ color: T.textSub }}>{label}</label>
    <div className="relative flex items-center">
      <div className="absolute left-3 flex items-center justify-center pointer-events-none">
        {Icon ? <Icon size={16} color={T.textSub} /> : null}
      </div>
      {options ? (
        <select 
          name={name} value={formData[name]} onChange={handleChange} disabled={loading}
          className="w-full pl-10 pr-4 py-2.5 text-[13px] rounded-lg border outline-none appearance-none cursor-pointer transition-all disabled:opacity-50"
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
          autoComplete={type === 'password' ? 'new-password' : 'off'}
          className="w-full pl-10 pr-4 py-2.5 text-[13px] rounded-lg border outline-none transition-all placeholder-opacity-50 disabled:opacity-50"
          style={{ backgroundColor: T.inputBg, borderColor: T.border, color: T.text }}
          onFocus={(e) => e.target.style.borderColor = T.primary}
          onBlur={(e) => e.target.style.borderColor = T.border}
        />
      )}
    </div>
  </div>
);

// Custom icons
const StethoscopeIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>;
const GraduationCapIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21.42 10.922a2 2 0 0 1-.01 2.82l-7.53 7.39a2 2 0 0 1-2.79 0l-7.53-7.39a2 2 0 0 1-.01-2.82l7.53-7.39a2 2 0 0 1 2.8 0l7.53 7.39h0z"/><path d="M12 21.94v-7"/><path d="m3.1 11.23 7.53-7.38a2 2 0 0 1 2.76 0l7.52 7.38"/><path d="M14 19.5v-2"/><path d="M10 19.5v-2"/></svg>;

const RegisterUserModal = ({ isOpen, onClose, onUserRegistered }) => {
  const { theme: T } = useTheme();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: 'Student',
    firstName: '', lastName: '', email: '', password: '',
    phone: '',
    specialization: '', licenseNo: '', experience: '',
    university: '', year: '1st Year', major: '',
    age: '', gender: 'Male', bloodGroup: 'O+', address: '',
    department: '', employeeId: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePrev = () => setStep(1);

  const resetForm = () => {
    setStep(1);
    setLoading(false);
    setFormData({
      role: 'Student', firstName: '', lastName: '', email: '', password: '',
      phone: '', specialization: '', licenseNo: '', experience: '',
      university: '', year: '1st Year', major: '', age: '', gender: 'Male', bloodGroup: 'O+', address: '', department: '', employeeId: ''
    });
  };

  const handleClose = () => {
    if (loading) return;
    resetForm();
    onClose();
  };

  const handleNextOrSubmit = async () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        toast.warning('Please fill all basic fields');
        return;
      }
      setStep(2);
    } else {
      setLoading(true);
      try {
        const payload = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role === 'Doctor' ? 'admin' : formData.role.toLowerCase(),
          phone: formData.phone,
          gender: formData.gender.toLowerCase(),
          blood_group: formData.bloodGroup,
          address: formData.address,
          specialization: formData.specialization,
          license_number: formData.licenseNo,
          hospital_name: 'TTOOLECG Medical Center',
          university: formData.university,
          institution: formData.university,
          year: formData.year,
          roll_number: formData.employeeId || formData.major,
        };

        const result = await authService.register(payload);
        toast.success(result.message || 'User registered successfully');
        if (onUserRegistered) onUserRegistered(result.user);
        handleClose();
      } catch (err) {
        toast.error(err.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      handleNextOrSubmit();
    }
  };

  const roles = [
    { id: 'Doctor', icon: StethoscopeIcon, color: '#10b981', desc: 'Medical staff' },
    { id: 'Patient', icon: Heart, color: '#f43f5e', desc: 'Subject records' },
    { id: 'Student', icon: GraduationCapIcon, color: '#3b82f6', desc: 'Module access' },
  ];

  const commonProps = { formData, handleChange, loading, T };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-[3px]" style={{ backgroundColor: 'rgba(10, 13, 20, 0.8)' }}>
      <div 
        className="relative flex flex-col w-full max-w-[480px] overflow-hidden border shadow-2xl rounded-2xl" 
        style={{ backgroundColor: T.card, borderColor: T.border }}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: T.border, backgroundColor: T.bg }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: T.text }}>Register New User</h2>
            <p className="text-[13px] mt-1.5" style={{ color: T.textSub }}>
              {step === 1 ? 'Step 1: Account Credentials' : `Step 2: ${formData.role} Info`}
            </p>
          </div>
          <button onClick={handleClose} disabled={loading} className="p-2 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50" style={{ backgroundColor: T.name === 'dark' ? '#1a2545' : '#e2eaf7', color: T.textSub }}>
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-5">
                <label className="block text-[10px] font-semibold tracking-wide uppercase mb-2.5" style={{ color: T.textSub }}>Select User Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map(r => (
                    <div 
                      key={r.id} onClick={() => !loading && setFormData({ ...formData, role: r.id })}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${formData.role === r.id ? 'ring-2 ring-opacity-50 shadow-md' : ''} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{ backgroundColor: formData.role === r.id ? (T.name === 'dark' ? '#161f36' : '#f8faff') : T.inputBg, borderColor: formData.role === r.id ? r.color : T.border }}
                    >
                      <div className="flex items-center justify-center p-2 rounded-lg text-white mt-0.5" style={{ backgroundColor: r.color }}><r.icon size={16} /></div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[12px] font-bold" style={{ color: T.text }}>{r.id}</span>
                        <span className="text-[9px] font-medium mt-0.5 truncate" style={{ color: T.textSub }}>{r.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField icon={User} label="First Name" type="text" name="firstName" placeholder="First Name" {...commonProps} />
                <InputField icon={User} label="Last Name" type="text" name="lastName" placeholder="Last Name" {...commonProps} />
              </div>
              <InputField icon={Mail} label="Email Address" type="email" name="email" placeholder="email@example.com" {...commonProps} />
              <InputField icon={Lock} label="Secure Password" type="password" name="password" placeholder="••••••••" {...commonProps} />
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 min-h-[340px]">
              <InputField icon={Phone} label="Primary Phone" type="text" name="phone" placeholder="+1 (555) 000-0000" {...commonProps} />
              <div className="mt-4 pt-4 border-t border-dashed" style={{ borderColor: T.border }}>
                <h3 className="text-[13px] font-bold tracking-wide uppercase mb-4" style={{ color: T.primary }}>{formData.role} Details</h3>
                {formData.role === 'Doctor' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField icon={Briefcase} label="Specialization" type="text" name="specialization" placeholder="Cardiology" {...commonProps} />
                      <InputField icon={Calendar} label="Experience" type="number" name="experience" placeholder="e.g. 5" {...commonProps} />
                    </div>
                    <InputField icon={Lock} label="Medical License" type="text" name="licenseNo" placeholder="MD-59329402" {...commonProps} />
                  </>
                )}
                {formData.role === 'Student' && (
                  <>
                    <InputField icon={User} label="University" type="text" name="university" placeholder="University" {...commonProps} />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField icon={Calendar} label="Year" type="text" name="year" options={['1st Year', '2nd Year', '3rd Year', '4th Year', 'Intern']} {...commonProps} />
                      <InputField icon={Briefcase} label="Major" type="text" name="major" placeholder="Medicine" {...commonProps} />
                    </div>
                  </>
                )}
                {formData.role === 'Patient' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField icon={Calendar} label="Age" type="number" name="age" placeholder="Age" {...commonProps} />
                      <InputField icon={User} label="Gender" type="text" name="gender" options={['Male', 'Female', 'Other']} {...commonProps} />
                    </div>
                    <InputField icon={Heart} label="Blood Group" type="text" name="bloodGroup" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} {...commonProps} />
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-5 pt-4 border-t" style={{ borderColor: T.border }}>
            {step === 1 ? (
              <span className="text-[10px] font-semibold px-2" style={{ color: T.textSub }}>ALL FIELDS REQUIRED</span>
            ) : (
              <button disabled={loading} onClick={handlePrev} className="flex items-center gap-2 px-4 py-2 text-[12px] font-semibold rounded-lg transition-all hover:-translate-x-1 disabled:opacity-50" style={{ color: T.textSub, backgroundColor: T.name === 'dark' ? '#1a2545' : '#e2eaf7' }}>
                <ArrowLeft size={14} /> Previous
              </button>
            )}
            
            <button 
              onClick={handleNextOrSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-[12px] font-bold text-white rounded-lg transition-all shadow-md hover:scale-105 disabled:bg-gray-500"
              style={{ backgroundColor: step === 1 ? T.primary : '#10b981' }}
            >
              {loading ? <Loader2 className="animate-spin" size={14} /> : null}
              {step === 1 ? (loading ? 'Processing...' : 'Continue Setup') : (loading ? 'Saving...' : 'Complete Registration')}
              {!loading && (step === 1 ? <ArrowRight size={14} /> : <Check size={14} />)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterUserModal;
