import { useState } from 'react';
import {
  Search, X, Edit2, Trash2, Save,
  Mail, Phone, Shield, Target,
  Users as UsersIcon, MapPin, Plus,
  Building2, CheckCircle, Clock, FileText, Download,
  Star, TrendingUp, Briefcase, CreditCard, Lock,
  AlertTriangle, ChevronRight, Eye, User, Globe,
  XCircle, Check, AlertCircle, Hash, Calendar,
  Landmark, DollarSign, BarChart2, Layers, Bell,
  Settings, LogOut, Menu, Activity, Filter
} from 'lucide-react';

const T = {
  bg: '#0a0e27',
  bgLight: '#141b3d',
  card: '#1a2142',
  cardHover: '#222952',
  border: '#2d3555',
  borderLight: '#3d4666',
  text: '#ffffff',
  textSub: '#8b92b8',
  textMuted: '#5a6189',
  primary: '#3b82f6',
  primaryDark: '#2563eb',
  primaryLight: '#60a5fa',
  primaryBg: 'rgba(59, 130, 246, 0.1)',
  primaryBorder: 'rgba(59, 130, 246, 0.3)',
  success: '#10b981',
  successBg: 'rgba(16, 185, 129, 0.1)',
  successBorder: 'rgba(16, 185, 129, 0.3)',
  warning: '#f59e0b',
  warningBg: 'rgba(245, 158, 11, 0.1)',
  warningBorder: 'rgba(245, 158, 11, 0.3)',
  danger: '#ef4444',
  dangerBg: 'rgba(239, 68, 68, 0.1)',
  dangerBorder: 'rgba(239, 68, 68, 0.3)',
  purple: '#8b5cf6',
  purpleBg: 'rgba(139, 92, 246, 0.1)',
};

const MOCK_AGENTS = [
  { id: 'AC', name: 'Adrian Cole', role: 'Senior Relationship Manager', department: 'Private Wealth · West', email: 'adrian.cole@aurelia.bank', phone: '+1 415 555 0114', status: 'Active', initials: 'AC', color: '#3b82f6', joinDate: 'Mar 15, 2022', address: '88 Montgomery St, San Francisco, CA', experience: '9 Years', clients: 142, revenue: '$4.2M', region: 'West Coast', qualification: 'MBA, CFA', gender: 'Male', nationality: 'American', fullName: 'Adrian Cole' },
  { id: 'MT', name: 'Maya Tahir', role: 'Relationship Manager', department: 'APAC Desk', email: 'maya.tahir@aurelia.bank', phone: '+65 8123 4421', status: 'Active', initials: 'MT', color: '#10b981', joinDate: 'Jul 02, 2021', address: '1 Raffles Place, Singapore', experience: '6 Years', clients: 98, revenue: '$2.8M', region: 'Asia Pacific', qualification: 'BBA, CISI', gender: 'Female', nationality: 'Singaporean', fullName: 'Maya Tahir' },
  { id: 'JR', name: 'Jonas Reyes', role: 'Senior Relationship Manager', department: 'LATAM Desk', email: 'jonas.reyes@aurelia.bank', phone: '+52 55 4422 0918', status: 'On Leave', initials: 'JR', color: '#f59e0b', joinDate: 'Jan 18, 2020', address: 'Paseo de la Reforma 222, CDMX', experience: '12 Years', clients: 210, revenue: '$6.1M', region: 'Latin America', qualification: 'MBA, FRM', gender: 'Male', nationality: 'Mexican', fullName: 'Jonas Reyes' },
  { id: 'PA', name: 'Priya Anand', role: 'Relationship Manager', department: 'EMEA Desk', email: 'priya.anand@aurelia.bank', phone: '+44 20 7946 0011', status: 'Active', initials: 'PA', color: '#8b5cf6', joinDate: 'Sep 10, 2022', address: '30 St Mary Axe, London, UK', experience: '5 Years', clients: 77, revenue: '$1.9M', region: 'EMEA', qualification: 'MSc Finance', gender: 'Female', nationality: 'British-Indian', fullName: 'Priya Anand' },
  { id: 'HL', name: 'Hugo Lambert', role: 'Private Banking Director', department: 'Private Wealth · East', email: 'hugo.lambert@aurelia.bank', phone: '+1 212 555 0188', status: 'Active', initials: 'HL', color: '#3b82f6', joinDate: 'Feb 28, 2019', address: '383 Madison Ave, New York, NY', experience: '18 Years', clients: 310, revenue: '$12.4M', region: 'East Coast', qualification: 'MBA, CFP', gender: 'Male', nationality: 'French-American', fullName: 'Hugo Lambert' },
  { id: 'SB', name: 'Sophia Berg', role: 'Wealth Advisor', department: 'Family Office', email: 'sophia.berg@aurelia.bank', phone: '+41 44 215 5500', status: 'Active', initials: 'SB', color: '#ec4899', joinDate: 'Nov 03, 2023', address: 'Bahnhofstrasse 45, Zurich', experience: '3 Years', clients: 22, revenue: '$890K', region: 'Switzerland', qualification: 'MSc, CWMA', gender: 'Female', nationality: 'Swiss', fullName: 'Sophia Berg' },
];

const MOCK_CHECKERS = [
  { id: 1, name: 'Eliza M.', fullName: 'Eliza Martinez', role: 'Checker', department: 'Compliance · Americas', email: 'eliza.martinez@aurelia.bank', phone: '+1 212 555 0199', status: 'Active', initials: 'EM', color: '#3b82f6', joinDate: 'Aug 14, 2021', audits: 1842, accuracy: '99.2%', clearanceLevel: 'Level 3', gender: 'Female', address: '145 Park Ave, New York, NY', qualification: 'CAMS, CFE', experience: '7 Years' },
  { id: 2, name: 'Rafael T.', fullName: 'Rafael Torres', role: 'Senior Checker', department: 'Compliance · EMEA', email: 'rafael.torres@aurelia.bank', phone: '+34 91 555 0234', status: 'Active', initials: 'RT', color: '#10b981', joinDate: 'Mar 01, 2020', audits: 3201, accuracy: '98.7%', clearanceLevel: 'Level 4', gender: 'Male', address: 'Calle Serrano 41, Madrid', qualification: 'CAMS, ACCA', experience: '10 Years' },
  { id: 3, name: 'Lena W.', fullName: 'Lena Weber', role: 'Checker', department: 'Compliance · APAC', email: 'lena.weber@aurelia.bank', phone: '+65 6222 8800', status: 'On Leave', initials: 'LW', color: '#f59e0b', joinDate: 'Jun 19, 2022', audits: 742, accuracy: '97.9%', clearanceLevel: 'Level 2', gender: 'Female', address: '1 Marina Blvd, Singapore', qualification: 'CAMS', experience: '4 Years' },
  { id: 4, name: 'Kwame A.', fullName: 'Kwame Asante', role: 'Lead Checker', department: 'Audit & Control', email: 'kwame.asante@aurelia.bank', phone: '+233 30 222 4400', status: 'Active', initials: 'KA', color: '#3b82f6', joinDate: 'Jan 07, 2018', audits: 6104, accuracy: '99.8%', clearanceLevel: 'Level 5', gender: 'Male', address: 'Ring Road Central, Accra', qualification: 'CIA, CAMS, ACCA', experience: '14 Years' },
];

const MOCK_CLIENTS = [
  {
    id: 'CL001', initials: 'TF', color: '#3b82f6',
    name: 'Thornton Family Trust', type: 'Corporate Trust',
    accountNo: 'AUR-0042-TFT', assignedAgent: 'Adrian Cole',
    submittedDate: 'Apr 18, 2026', status: 'Pending', riskLevel: 'Medium',
    contact: { name: 'Edward Thornton', email: 'e.thornton@thorntongroup.com', phone: '+1 415 822 0044', address: '1200 Pacific Ave, San Francisco, CA 94109' },
    financials: { initialDeposit: '$1,800,000', expectedAUM: '$4.2M', sourceOfFunds: 'Business Revenue & Inheritance', annualIncome: '$620,000' },
    kyc: { passportNo: 'US7842910', nationality: 'American', dob: 'Mar 12, 1965', pep: 'No', sanctionCheck: 'Clear', amlScore: '18 / 100', idVerified: true, addressVerified: true, incomeVerified: true },
    documents: ['Passport Copy', 'Proof of Address', 'Source of Funds Declaration', 'Trust Deed'],
    notes: 'High-net-worth client. Trust established 2012. Previously banked with UBS. Low activity risk profile.',
  },
  {
    id: 'CL002', initials: 'OH', color: '#10b981',
    name: 'Okafor Holdings LLC', type: 'Limited Liability Company',
    accountNo: 'AUR-0059-OHL', assignedAgent: 'Priya Anand',
    submittedDate: 'Apr 20, 2026', status: 'Pending', riskLevel: 'High',
    contact: { name: 'Adaeze Okafor', email: 'a.okafor@okaforholdings.ng', phone: '+234 1 740 5500', address: 'Plot 14, Adeola Odeku St, Victoria Island, Lagos' },
    financials: { initialDeposit: '$940,000', expectedAUM: '$2.1M', sourceOfFunds: 'Real Estate & Trade Finance', annualIncome: '$380,000' },
    kyc: { passportNo: 'NG88201043', nationality: 'Nigerian', dob: 'Jul 28, 1978', pep: 'Yes — Disclosed', sanctionCheck: 'Under Review', amlScore: '54 / 100', idVerified: true, addressVerified: false, incomeVerified: true },
    documents: ['Passport Copy', 'CAC Registration', 'Source of Funds Declaration', 'PEP Disclosure Form'],
    notes: 'PEP disclosure filed. Enhanced due diligence required per AML policy §4.2. Address verification pending.',
  },
  {
    id: 'CL003', initials: 'DF', color: '#8b5cf6',
    name: 'Delacroix Foundation', type: 'Non-Profit Foundation',
    accountNo: 'AUR-0031-DLF', assignedAgent: 'Hugo Lambert',
    submittedDate: 'Apr 10, 2026', status: 'Approved', riskLevel: 'Low',
    contact: { name: 'Isabelle Delacroix', email: 'i.delacroix@dlfoundation.fr', phone: '+33 1 47 90 12 44', address: '22 Rue du Faubourg Saint-Honoré, Paris 75008' },
    financials: { initialDeposit: '$2,400,000', expectedAUM: '$5.8M', sourceOfFunds: 'Endowment & Donations', annualIncome: '$1,100,000' },
    kyc: { passportNo: 'FR44820191', nationality: 'French', dob: 'Nov 02, 1961', pep: 'No', sanctionCheck: 'Clear', amlScore: '9 / 100', idVerified: true, addressVerified: true, incomeVerified: true },
    documents: ['Passport Copy', 'Foundation Charter', 'Annual Report 2023', 'Board Resolution'],
    notes: 'Established philanthropic institution. Full documentation received. Approved by compliance board.',
  },
  {
    id: 'CL004', initials: 'SI', color: '#f59e0b',
    name: 'Shah Investments', type: 'Private Investment Vehicle',
    accountNo: 'AUR-0074-SHI', assignedAgent: 'Maya Tahir',
    submittedDate: 'Apr 22, 2026', status: 'Rejected', riskLevel: 'High',
    contact: { name: 'Rohan Shah', email: 'r.shah@shahinv.com', phone: '+91 22 4001 7700', address: 'Nariman Point, Mumbai 400021' },
    financials: { initialDeposit: '$620,000', expectedAUM: '$1.4M', sourceOfFunds: 'Equity Trading', annualIncome: '$290,000' },
    kyc: { passportNo: 'IN8830221', nationality: 'Indian', dob: 'Sep 15, 1980', pep: 'No', sanctionCheck: 'Flagged', amlScore: '77 / 100', idVerified: true, addressVerified: true, incomeVerified: false },
    documents: ['Passport Copy', 'SEBI Registration', 'Demat Account Statement'],
    notes: 'Sanction screening returned a partial match. Income verification could not be completed. Application rejected pending re-submission.',
  },
  {
    id: 'CL005', initials: 'MG', color: '#ec4899',
    name: 'Mercer-Galvan Family', type: 'Individual / Joint Account',
    accountNo: 'AUR-0088-MGF', assignedAgent: 'Jonas Reyes',
    submittedDate: 'Apr 24, 2026', status: 'Pending', riskLevel: 'Low',
    contact: { name: 'Carlos Mercer-Galvan', email: 'c.mercer@mgfamily.mx', phone: '+52 55 8801 2200', address: 'Lomas de Chapultepec, CDMX 11000' },
    financials: { initialDeposit: '$550,000', expectedAUM: '$1.2M', sourceOfFunds: 'Family Business Sale', annualIncome: '$210,000' },
    kyc: { passportNo: 'MX99201834', nationality: 'Mexican', dob: 'Feb 19, 1975', pep: 'No', sanctionCheck: 'Clear', amlScore: '22 / 100', idVerified: true, addressVerified: true, incomeVerified: true },
    documents: ['Passport Copy', 'Proof of Address', 'Business Sale Agreement', 'Tax Returns 2023'],
    notes: 'Clean profile. All documents submitted. Awaiting final checker approval.',
  },
  {
    id: 'CL006', initials: 'AV', color: '#06b6d4',
    name: 'Arevalo Ventures', type: 'Venture Capital Fund',
    accountNo: 'AUR-0096-AVF', assignedAgent: 'Sophia Berg',
    submittedDate: 'Apr 23, 2026', status: 'Pending', riskLevel: 'Medium',
    contact: { name: 'Lucia Arevalo', email: 'l.arevalo@arevalovc.com', phone: '+34 93 481 7722', address: 'Passeig de Gràcia 88, Barcelona 08008' },
    financials: { initialDeposit: '$1,200,000', expectedAUM: '$3.5M', sourceOfFunds: 'VC Fund Returns', annualIncome: '$480,000' },
    kyc: { passportNo: 'ES77301228', nationality: 'Spanish', dob: 'Jun 04, 1983', pep: 'No', sanctionCheck: 'Clear', amlScore: '31 / 100', idVerified: true, addressVerified: true, incomeVerified: false },
    documents: ['Passport Copy', 'Fund Prospectus', 'Audited Accounts 2023', 'LP Agreement'],
    notes: 'Income verification in progress. Fund audited by PwC Barcelona. Low risk history.',
  },
];

const STATUS_FILTERS = ['All', 'Pending', 'Approved', 'Rejected'];

const statusColor = (s) => {
  if (s === 'Active' || s === 'Approved' || s === 'Clear' || s === 'Cleared') return { bg: T.successBg, color: T.success, border: T.successBorder };
  if (s === 'On Leave' || s === 'Pending' || s === 'Under Review') return { bg: T.warningBg, color: T.warning, border: T.warningBorder };
  if (s === 'Blocked' || s === 'Rejected' || s === 'Flagged' || s === 'Inactive') return { bg: T.dangerBg, color: T.danger, border: T.dangerBorder };
  return { bg: T.card, color: T.textSub, border: T.border };
};

const riskColor = (r) => {
  if (r === 'Low') return { bg: T.successBg, color: T.success, border: T.successBorder };
  if (r === 'Medium') return { bg: T.warningBg, color: T.warning, border: T.warningBorder };
  if (r === 'High') return { bg: T.dangerBg, color: T.danger, border: T.dangerBorder };
  return { bg: T.card, color: T.textSub, border: T.border };
};

/* ── Add Staff Modal ─────────────────────────────────────────── */
const emptyMember = () => ({ fullName: '', email: '', phone: '', role: '', department: '', status: 'Active' });

function AddStaffModal({ open, onClose, type, onAdd }) {
  const [members, setMembers] = useState([emptyMember()]);
  const [saving, setSaving] = useState(false);
  if (!open) return null;

  const update = (i, field, val) => setMembers(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: val } : m));
  const addMember = () => setMembers(prev => [...prev, emptyMember()]);
  const removeMember = (i) => setMembers(prev => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    const valid = members.every(m => m.fullName && m.email && m.role);
    if (!valid) { alert('Full Name, Email and Role are required.'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    onAdd(members);
    setSaving(false);
    setMembers([emptyMember()]);
    onClose();
  };

  const isChecker = type === 'CHECKERS';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: 'rgba(10,14,39,0.85)', backdropFilter: 'blur(8px)' }}>
      <div style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 16, width: '100%', maxWidth: 680, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 48px rgba(0,0,0,0.4)' }}>
        <div style={{ padding: '24px 28px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: T.primaryBg, border: `1px solid ${T.primaryBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UsersIcon size={18} color={T.primary} />
              </div>
              <span style={{ fontSize: 20, fontWeight: 700, color: T.text }}>Add {isChecker ? 'Checker' : 'Agent'} Members</span>
            </div>
            <p style={{ fontSize: 13, color: T.textSub, marginLeft: 46 }}>Add one or more staff members at once.</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: T.textMuted }} onMouseEnter={e => e.currentTarget.style.color = T.text} onMouseLeave={e => e.currentTarget.style.color = T.textMuted}><X size={20} /></button>
        </div>
        <div style={{ overflowY: 'auto', padding: '24px 28px', flex: 1 }}>
          {members.map((m, i) => (
            <div key={i} style={{ border: `1px solid ${T.border}`, borderRadius: 12, padding: '20px', marginBottom: 16, position: 'relative', backgroundColor: T.bgLight }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{i + 1}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{isChecker ? 'Checker' : 'Staff'} #{i + 1}</span>
                </div>
                {members.length > 1 && <button onClick={() => removeMember(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.danger, padding: 4 }}><X size={16} /></button>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { label: 'Full Name', field: 'fullName', placeholder: 'e.g. Sophia Laurent', required: true, icon: <User size={14} /> },
                  { label: 'Email', field: 'email', placeholder: 'name@aurelia.bank', required: true, type: 'email', icon: <Mail size={14} /> },
                  { label: 'Phone', field: 'phone', placeholder: '+1 555 000 0000', icon: <Phone size={14} /> },
                  { label: isChecker ? 'Checker Level' : 'Role', field: 'role', placeholder: isChecker ? 'e.g. Senior Checker' : 'e.g. Relationship Manager', required: true, icon: <Briefcase size={14} /> },
                ].map(({ label, field, placeholder, required, type, icon }) => (
                  <div key={field}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
                      {label} {required && <span style={{ color: T.danger }}>*</span>}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: T.textMuted }}>{icon}</div>
                      <input type={type || 'text'} value={m[field]} onChange={e => update(i, field, e.target.value)} placeholder={placeholder}
                        style={{ width: '100%', padding: '11px 14px 11px 40px', border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 14, color: T.text, backgroundColor: T.card, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderColor = T.primary} onBlur={e => e.target.style.borderColor = T.border} />
                    </div>
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>Department</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: T.textMuted }}><Building2 size={14} /></div>
                    <input value={m.department} onChange={e => update(i, 'department', e.target.value)} placeholder="e.g. Compliance · EMEA"
                      style={{ width: '100%', padding: '11px 14px 11px 40px', border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 14, color: T.text, backgroundColor: T.card, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = T.primary} onBlur={e => e.target.style.borderColor = T.border} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>Status</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: T.textMuted }}><CheckCircle size={14} /></div>
                    <select value={m.status} onChange={e => update(i, 'status', e.target.value)}
                      style={{ width: '100%', padding: '11px 14px 11px 40px', border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 14, color: T.text, backgroundColor: T.card, outline: 'none', fontFamily: 'inherit', appearance: 'none', boxSizing: 'border-box', cursor: 'pointer' }}
                      onFocus={e => e.target.style.borderColor = T.primary} onBlur={e => e.target.style.borderColor = T.border}>
                      <option>Active</option><option>On Leave</option><option>Blocked</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addMember}
            style={{ width: '100%', padding: 14, border: `2px dashed ${T.border}`, borderRadius: 10, background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: T.textSub, fontFamily: 'inherit' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.color = T.primary; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSub; }}>
            <Plus size={16} /> Add another {isChecker ? 'checker' : 'staff member'}
          </button>
        </div>
        <div style={{ padding: '20px 28px', borderTop: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
          <button onClick={onClose} style={{ padding: '11px 24px', border: `1px solid ${T.border}`, borderRadius: 8, background: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: T.text, fontFamily: 'inherit' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = T.bgLight} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Cancel</button>
          <button onClick={handleSave} disabled={saving}
            style={{ padding: '11px 24px', backgroundColor: T.primary, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#fff', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8, opacity: saving ? 0.6 : 1 }}
            onMouseEnter={e => !saving && (e.currentTarget.style.backgroundColor = T.primaryDark)}
            onMouseLeave={e => !saving && (e.currentTarget.style.backgroundColor = T.primary)}>
            <UsersIcon size={16} />
            {saving ? 'Saving...' : `Save ${members.length} Member${members.length > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Field component ─────────────────────────────────────────── */
const Field = ({ label, name, value, type = 'text', options, isEditing, editData, setEditData }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: T.textMuted }}>{label}</div>
    {isEditing ? (
      options ? (
        <select name={name} value={editData[name] || ''} onChange={e => setEditData({ ...editData, [e.target.name]: e.target.value })}
          style={{ fontSize: 14, fontWeight: 500, backgroundColor: T.bgLight, border: `1px solid ${T.border}`, borderRadius: 6, outline: 'none', color: T.text, padding: '6px 8px', fontFamily: 'inherit' }}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input name={name} type={type} value={editData[name] || ''} onChange={e => setEditData({ ...editData, [e.target.name]: e.target.value })}
          style={{ fontSize: 14, fontWeight: 500, backgroundColor: 'transparent', border: 'none', borderBottom: `2px solid ${T.primary}`, outline: 'none', color: T.text, padding: '4px 0', fontFamily: 'inherit' }} />
      )
    ) : (
      <div style={{ fontSize: 14, fontWeight: 500, color: name === 'status' ? statusColor(value).color : T.text }}>{value || '—'}</div>
    )}
  </div>
);

/* ── KYC Badge ───────────────────────────────────────────────── */
const KycBadge = ({ ok, label }) => {
  const colors = ok ? { bg: T.successBg, border: T.successBorder, color: T.success } : { bg: T.dangerBg, border: T.dangerBorder, color: T.danger };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}>
      {ok ? <CheckCircle size={13} color={colors.color} /> : <XCircle size={13} color={colors.color} />}
      <span style={{ fontSize: 12, fontWeight: 600, color: colors.color }}>{label}</span>
    </div>
  );
};

/* ── Section ─────────────────────────────────────────────────── */
function Section({ title, icon, children, last }) {
  return (
    <div style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '20px 22px', marginBottom: last ? 0 : 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ color: T.primary }}>{icon}</div>
        <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: T.text }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

/* ── InfoRow ─────────────────────────────────────────────────── */
function InfoRow({ icon, label, value, highlight, colored }) {
  const col = colored ? statusColor(value).color : highlight ? T.primary : T.text;
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: T.textMuted, marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: T.textMuted }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: col }}>{value || '—'}</span>
      </div>
    </div>
  );
}

/* ── Client Detail Panel ─────────────────────────────────────── */
function ClientDetail({ client, isChecker, onApprove, onReject, onClose, onUpdate }) {
  const [isClientEditing, setIsClientEditing] = useState(false);
  const [clientEditData, setClientEditData] = useState({});

  const canAct = isChecker && client.status === 'Pending';
  const isPending = client.status === 'Pending';

  const editInputStyle = {
    fontSize: 13, fontWeight: 500, backgroundColor: 'transparent',
    border: 'none', borderBottom: `2px solid ${T.primary}`,
    outline: 'none', color: T.text, padding: '3px 0',
    fontFamily: 'inherit', width: '100%',
  };

  const handleClientEdit = () => {
    if (isClientEditing) {
      onUpdate && onUpdate(client.id, clientEditData);
      setIsClientEditing(false);
    } else {
      setClientEditData({
        contact: { ...client.contact },
        financials: { ...client.financials },
        kyc: { ...client.kyc },
        notes: client.notes,
        riskLevel: client.riskLevel,
        assignedAgent: client.assignedAgent,
      });
      setIsClientEditing(true);
    }
  };

  const updateContact = (field, val) =>
    setClientEditData(prev => ({ ...prev, contact: { ...prev.contact, [field]: val } }));
  const updateFinancials = (field, val) =>
    setClientEditData(prev => ({ ...prev, financials: { ...prev.financials, [field]: val } }));
  const updateKyc = (field, val) =>
    setClientEditData(prev => ({ ...prev, kyc: { ...prev.kyc, [field]: val } }));

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: client.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: client.color, border: `2px solid ${client.color}`, flexShrink: 0 }}>
            {client.initials}
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: T.text, marginBottom: 6 }}>{client.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: T.textSub, fontWeight: 500 }}>{client.type}</span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: T.textMuted, display: 'inline-block' }} />
              <span style={{ fontSize: 13, color: T.textMuted }}>{client.accountNo}</span>
              <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', ...statusColor(client.status) }}>{client.status}</span>
              {isClientEditing ? (
                <select
                  value={clientEditData.riskLevel || client.riskLevel}
                  onChange={e => setClientEditData(prev => ({ ...prev, riskLevel: e.target.value }))}
                  style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, backgroundColor: T.bgLight, border: `1px solid ${T.border}`, color: T.text, fontFamily: 'inherit', cursor: 'pointer' }}>
                  <option>Low</option><option>Medium</option><option>High</option>
                </select>
              ) : (
                <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', ...riskColor(client.riskLevel) }}>Risk: {client.riskLevel}</span>
              )}
            </div>
          </div>
        </div>

        {/* Edit + Close Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button
            onClick={handleClientEdit}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px',
              border: `1px solid ${isClientEditing ? T.primary : T.border}`,
              borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
              backgroundColor: isClientEditing ? T.primary : T.card,
              color: isClientEditing ? '#fff' : T.text,
              fontFamily: 'inherit', transition: 'all 0.2s',
            }}>
            {isClientEditing ? <><Save size={14} /> Save Changes</> : <><Edit2 size={14} /> Edit</>}
          </button>
          {isClientEditing && (
            <button
              onClick={() => setIsClientEditing(false)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', border: `1px solid ${T.border}`, borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, backgroundColor: T.card, color: T.textSub, fontFamily: 'inherit', transition: 'all 0.2s' }}>
              <X size={14} /> Cancel
            </button>
          )}
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textMuted, padding: 6, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = T.text} onMouseLeave={e => e.currentTarget.style.color = T.textMuted}>
            <X size={20} />
          </button>
        </div>
      </div>

      {/* ── Approve / Reject ── */}
      <div style={{ marginBottom: 24 }}>
        {!isChecker && isPending && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', backgroundColor: T.warningBg, border: `1px solid ${T.warningBorder}`, borderRadius: 10 }}>
            <Lock size={16} color={T.warning} />
            <span style={{ fontSize: 13, fontWeight: 500, color: T.warning }}>Approval actions are restricted to Checker roles only.</span>
          </div>
        )}
        {isChecker && (
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={canAct ? onApprove : undefined} disabled={!canAct}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', backgroundColor: canAct ? T.success : T.bgLight, border: 'none', borderRadius: 8, cursor: canAct ? 'pointer' : 'not-allowed', fontSize: 14, fontWeight: 600, color: canAct ? '#fff' : T.textMuted, fontFamily: 'inherit', opacity: canAct ? 1 : 0.5, transition: 'all 0.2s' }}>
              <Check size={16} /> Approve Client
            </button>
            <button onClick={canAct ? onReject : undefined} disabled={!canAct}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', backgroundColor: canAct ? T.danger : T.bgLight, border: 'none', borderRadius: 8, cursor: canAct ? 'pointer' : 'not-allowed', fontSize: 14, fontWeight: 600, color: canAct ? '#fff' : T.textMuted, fontFamily: 'inherit', opacity: canAct ? 1 : 0.5, transition: 'all 0.2s' }}>
              <XCircle size={16} /> Reject Application
            </button>
            {!isPending && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px', backgroundColor: T.bgLight, border: `1px solid ${T.border}`, borderRadius: 8 }}>
                <AlertCircle size={14} color={T.textSub} />
                <span style={{ fontSize: 13, fontWeight: 500, color: T.textSub }}>Application already {client.status.toLowerCase()}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Contact Information ── */}
      <Section title="Contact Information" icon={<User size={16} />}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {isClientEditing ? (
            [
              { label: 'Primary Contact', field: 'name', icon: <User size={13} /> },
              { label: 'Email', field: 'email', icon: <Mail size={13} /> },
              { label: 'Phone', field: 'phone', icon: <Phone size={13} /> },
              { label: 'Address', field: 'address', icon: <MapPin size={13} /> },
            ].map(({ label, field, icon }) => (
              <div key={field}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: T.textMuted, marginBottom: 6 }}>{label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: T.textMuted, flexShrink: 0 }}>{icon}</span>
                  <input value={clientEditData.contact?.[field] || ''} onChange={e => updateContact(field, e.target.value)} style={editInputStyle} />
                </div>
              </div>
            ))
          ) : (
            <>
              <InfoRow icon={<User size={13} />} label="Primary Contact" value={client.contact.name} />
              <InfoRow icon={<Mail size={13} />} label="Email" value={client.contact.email} />
              <InfoRow icon={<Phone size={13} />} label="Phone" value={client.contact.phone} />
              <InfoRow icon={<MapPin size={13} />} label="Address" value={client.contact.address} />
            </>
          )}
        </div>
      </Section>

      {/* ── Financial Profile ── */}
      <Section title="Financial Profile" icon={<DollarSign size={16} />}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {isClientEditing ? (
            [
              { label: 'Initial Deposit', field: 'initialDeposit', icon: <Landmark size={13} /> },
              { label: 'Expected AUM', field: 'expectedAUM', icon: <TrendingUp size={13} /> },
              { label: 'Annual Income', field: 'annualIncome', icon: <BarChart2 size={13} /> },
              { label: 'Source of Funds', field: 'sourceOfFunds', icon: <Layers size={13} /> },
            ].map(({ label, field, icon }) => (
              <div key={field}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: T.textMuted, marginBottom: 6 }}>{label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: T.textMuted, flexShrink: 0 }}>{icon}</span>
                  <input value={clientEditData.financials?.[field] || ''} onChange={e => updateFinancials(field, e.target.value)} style={editInputStyle} />
                </div>
              </div>
            ))
          ) : (
            <>
              <InfoRow icon={<Landmark size={13} />} label="Initial Deposit" value={client.financials.initialDeposit} highlight />
              <InfoRow icon={<TrendingUp size={13} />} label="Expected AUM" value={client.financials.expectedAUM} highlight />
              <InfoRow icon={<BarChart2 size={13} />} label="Annual Income" value={client.financials.annualIncome} />
              <InfoRow icon={<Layers size={13} />} label="Source of Funds" value={client.financials.sourceOfFunds} />
            </>
          )}
        </div>
      </Section>

      {/* ── KYC & Compliance ── */}
      <Section title="KYC & Compliance" icon={<Shield size={16} />}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {isClientEditing ? (
            <>
              {[
                { label: 'Passport / ID No.', field: 'passportNo', icon: <Hash size={13} /> },
                { label: 'Nationality', field: 'nationality', icon: <Globe size={13} /> },
                { label: 'Date of Birth', field: 'dob', icon: <Calendar size={13} /> },
                { label: 'PEP Status', field: 'pep', icon: <AlertTriangle size={13} /> },
                { label: 'AML Risk Score', field: 'amlScore', icon: <Target size={13} /> },
              ].map(({ label, field, icon }) => (
                <div key={field}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: T.textMuted, marginBottom: 6 }}>{label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: T.textMuted, flexShrink: 0 }}>{icon}</span>
                    <input value={clientEditData.kyc?.[field] || ''} onChange={e => updateKyc(field, e.target.value)} style={editInputStyle} />
                  </div>
                </div>
              ))}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: T.textMuted, marginBottom: 6 }}>Sanction Check</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Shield size={13} color={T.textMuted} />
                  <select value={clientEditData.kyc?.sanctionCheck || ''} onChange={e => updateKyc('sanctionCheck', e.target.value)}
                    style={{ fontSize: 13, fontWeight: 500, backgroundColor: T.bgLight, border: `1px solid ${T.border}`, borderRadius: 6, outline: 'none', color: T.text, padding: '4px 8px', fontFamily: 'inherit' }}>
                    <option>Clear</option><option>Under Review</option><option>Flagged</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              <InfoRow icon={<Hash size={13} />} label="Passport / ID No." value={client.kyc.passportNo} />
              <InfoRow icon={<Globe size={13} />} label="Nationality" value={client.kyc.nationality} />
              <InfoRow icon={<Calendar size={13} />} label="Date of Birth" value={client.kyc.dob} />
              <InfoRow icon={<AlertTriangle size={13} />} label="PEP Status" value={client.kyc.pep} />
              <InfoRow icon={<Shield size={13} />} label="Sanction Check" value={client.kyc.sanctionCheck} colored />
              <InfoRow icon={<Target size={13} />} label="AML Risk Score" value={client.kyc.amlScore} />
            </>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {isClientEditing ? (
            ['idVerified', 'addressVerified', 'incomeVerified'].map(field => {
              const labels = { idVerified: 'ID Verified', addressVerified: 'Address Verified', incomeVerified: 'Income Verified' };
              const checked = clientEditData.kyc?.[field];
              return (
                <button key={field} onClick={() => updateKyc(field, !checked)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, transition: 'all 0.2s', backgroundColor: checked ? T.successBg : T.dangerBg, border: `1px solid ${checked ? T.successBorder : T.dangerBorder}`, color: checked ? T.success : T.danger }}>
                  {checked ? <CheckCircle size={13} /> : <XCircle size={13} />} {labels[field]}
                </button>
              );
            })
          ) : (
            <>
              <KycBadge ok={client.kyc.idVerified} label="ID Verified" />
              <KycBadge ok={client.kyc.addressVerified} label="Address Verified" />
              <KycBadge ok={client.kyc.incomeVerified} label="Income Verified" />
            </>
          )}
        </div>
      </Section>

      {/* ── Submitted Documents ── */}
      <Section title="Submitted Documents" icon={<FileText size={16} />}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {client.documents.map((doc, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: T.bgLight, border: `1px solid ${T.border}`, borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: T.primaryBg, border: `1px solid ${T.primaryBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={14} color={T.primary} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{doc}.pdf</span>
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', border: `1px solid ${T.border}`, borderRadius: 6, background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: T.textSub, fontFamily: 'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = T.bgLight; e.currentTarget.style.color = T.text; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = T.textSub; }}>
                <Download size={12} /> Download
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Banker Notes ── */}
      <Section title="Banker Notes" icon={<Eye size={16} />} last>
        {isClientEditing ? (
          <textarea
            value={clientEditData.notes || ''}
            onChange={e => setClientEditData(prev => ({ ...prev, notes: e.target.value }))}
            rows={4}
            style={{ width: '100%', padding: '12px 14px', backgroundColor: T.bgLight, border: `1px solid ${T.primary}`, borderRadius: 10, fontSize: 13, color: T.text, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6 }} />
        ) : (
          <div style={{ padding: '14px 18px', backgroundColor: T.warningBg, border: `1px solid ${T.warningBorder}`, borderRadius: 10 }}>
            <p style={{ fontSize: 13, color: T.text, lineHeight: 1.6, margin: 0 }}>{client.notes}</p>
          </div>
        )}
        <div style={{ display: 'flex', gap: 20, marginTop: 14 }}>
          {isClientEditing ? (
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: T.textMuted, marginBottom: 6 }}>Assigned Agent</div>
              <input value={clientEditData.assignedAgent || ''} onChange={e => setClientEditData(prev => ({ ...prev, assignedAgent: e.target.value }))}
                style={{ ...editInputStyle, fontSize: 13 }} />
            </div>
          ) : (
            <>
              <InfoRow icon={<UsersIcon size={13} />} label="Assigned Agent" value={client.assignedAgent} />
              <InfoRow icon={<Calendar size={13} />} label="Submitted" value={client.submittedDate} />
            </>
          )}
        </div>
      </Section>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────── */
const Users = () => {
  const [agents, setAgents] = useState(MOCK_AGENTS);
  const [checkers, setCheckers] = useState(MOCK_CHECKERS);
  const [clients, setClients] = useState(MOCK_CLIENTS);

  const [search, setSearch] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [clientStatusFilter, setClientStatusFilter] = useState('All');
  const [leftTab, setLeftTab] = useState('AGENTS');
  const [selectedAgentId, setSelectedAgentId] = useState(MOCK_AGENTS[0]?.id || null);
  const [selectedCheckerId, setSelectedCheckerId] = useState(MOCK_CHECKERS[0]?.id || null);
  const [centerTab, setCenterTab] = useState('Profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [statuses, setStatuses] = useState(
    [...MOCK_AGENTS, ...MOCK_CHECKERS].reduce((a, u) => ({ ...a, [u.id]: u.status }), {})
  );

  const isAgent = leftTab === 'AGENTS';
  const list = isAgent ? agents : checkers;
  const selectedId = isAgent ? selectedAgentId : selectedCheckerId;
  const setSelectedId = isAgent ? setSelectedAgentId : setSelectedCheckerId;
  const selected = list.find(u => u.id === selectedId);
  const selectedClient = clients.find(c => c.id === selectedClientId);

  const activeCount = [...agents, ...checkers].filter(u => (statuses[u.id] || u.status) === 'Active').length;
  const pendingClients = clients.filter(c => c.status === 'Pending').length;
  const approvedClients = clients.filter(c => c.status === 'Approved').length;

  const filtered = list.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    (u.role || u.department || '').toLowerCase().includes(search.toLowerCase())
  );

  const filterCounts = {
    All: clients.length,
    Pending: clients.filter(c => c.status === 'Pending').length,
    Approved: clients.filter(c => c.status === 'Approved').length,
    Rejected: clients.filter(c => c.status === 'Rejected').length,
  };

  const filteredClients = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.type.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.assignedAgent.toLowerCase().includes(clientSearch.toLowerCase());
    const matchStatus = clientStatusFilter === 'All' || c.status === clientStatusFilter;
    return matchSearch && matchStatus;
  });

  const profileStats = isAgent ? [
    { label: 'Total Clients', value: isEditing ? editData.clients : selected?.clients, name: 'clients', icon: <UsersIcon size={18} />, color: T.primary },
    { label: 'AUM / Revenue', value: isEditing ? editData.revenue : selected?.revenue, name: 'revenue', icon: <TrendingUp size={18} />, color: T.success },
  ] : [
    { label: 'Total Audits', value: isEditing ? editData.audits : selected?.audits, name: 'audits', icon: <FileText size={18} />, color: T.primary },
    { label: 'Accuracy Rate', value: isEditing ? editData.accuracy : selected?.accuracy, name: 'accuracy', icon: <Target size={18} />, color: T.success },
  ];

  const handleEdit = () => {
    if (isEditing) {
      if (isAgent) setAgents(agents.map(a => a.id === selectedId ? { ...a, ...editData } : a));
      else setCheckers(checkers.map(c => c.id === selectedId ? { ...c, ...editData } : c));
      setIsEditing(false);
    } else {
      setEditData(selected || {});
      setIsEditing(true);
    }
  };

  const handleDelete = () => {
    if (!window.confirm(`Remove ${selected?.name} from staff?`)) return;
    if (isAgent) {
      const rem = agents.filter(a => a.id !== selectedId);
      setAgents(rem);
      setSelectedAgentId(rem[0]?.id || null);
    } else {
      const rem = checkers.filter(c => c.id !== selectedId);
      setCheckers(rem);
      setSelectedCheckerId(rem[0]?.id || null);
    }
    setIsEditing(false);
  };

  const handleAdd = (members) => {
    const newItems = members.map((m, i) => ({
      id: `NEW_${Date.now()}_${i}`,
      name: m.fullName.split(' ')[0] + (m.fullName.split(' ')[1] ? ' ' + m.fullName.split(' ')[1][0] + '.' : ''),
      fullName: m.fullName, role: m.role, department: m.department || 'General',
      email: m.email, phone: m.phone || '', status: m.status,
      initials: m.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      color: T.primary,
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      clients: isAgent ? 0 : undefined, audits: !isAgent ? 0 : undefined,
      accuracy: !isAgent ? '—' : undefined, experience: '< 1 Year',
      address: '', gender: '', qualification: '',
      clearanceLevel: !isAgent ? 'Level 1' : undefined,
      revenue: isAgent ? '$0' : undefined,
    }));
    if (isAgent) setAgents(prev => [...prev, ...newItems]);
    else setCheckers(prev => [...prev, ...newItems]);
    setStatuses(prev => {
      const upd = { ...prev };
      newItems.forEach(n => { upd[n.id] = n.status; });
      return upd;
    });
  };

  const handleClientApprove = (id) => {
    const targetId = id || selectedClientId;
    setClients(prev => prev.map(c => c.id === targetId ? { ...c, status: 'Approved' } : c));
  };

  const handleClientReject = (id) => {
    const targetId = id || selectedClientId;
    setClients(prev => prev.map(c => c.id === targetId ? { ...c, status: 'Rejected' } : c));
  };

  // ── NEW: handle client data update from edit ──
  const handleClientUpdate = (id, editData) => {
    setClients(prev => prev.map(c => {
      if (c.id !== id) return c;
      return {
        ...c,
        riskLevel: editData.riskLevel ?? c.riskLevel,
        assignedAgent: editData.assignedAgent ?? c.assignedAgent,
        notes: editData.notes ?? c.notes,
        contact: { ...c.contact, ...editData.contact },
        financials: { ...c.financials, ...editData.financials },
        kyc: { ...c.kyc, ...editData.kyc },
      };
    }));
  };

  const filterPillStyle = (filter) => {
    const isActive = clientStatusFilter === filter;
    if (!isActive) return { padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: `1px solid ${T.border}`, backgroundColor: 'transparent', color: T.textSub, fontFamily: 'inherit', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 5 };
    const colorMap = {
      All: { bg: T.primaryBg, border: T.primaryBorder, color: T.primary },
      Pending: { bg: T.warningBg, border: T.warningBorder, color: T.warning },
      Approved: { bg: T.successBg, border: T.successBorder, color: T.success },
      Rejected: { bg: T.dangerBg, border: T.dangerBorder, color: T.danger },
    };
    const c = colorMap[filter];
    return { padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: `1px solid ${c.border}`, backgroundColor: c.bg, color: c.color, fontFamily: 'inherit', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 5 };
  };

  return (
    <div style={{ display: 'flex', width: 'calc(100% + 64px)', height: '100vh', margin: '-32px', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", backgroundColor: T.bg, overflow: 'hidden' }}>

      {/* ── COL 1: LEFT SIDEBAR ── */}
      <div style={{ width: 280, flexShrink: 0, borderRight: `1px solid ${T.border}`, backgroundColor: T.card, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 20px 18px', borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: T.text, letterSpacing: '-0.01em' }}>TTOOLECG</div>
              <div style={{ fontSize: 11, color: T.textSub, fontWeight: 500 }}>SUPER ADMIN</div>
            </div>
          </div>
          <div style={{ display: 'flex', padding: 3, border: `1px solid ${T.border}`, borderRadius: 8, backgroundColor: T.bgLight }}>
            {['AGENTS', 'CHECKERS'].map(tab => (
              <div key={tab} onClick={() => { setLeftTab(tab); setIsEditing(false); setCenterTab('Profile'); setSelectedClientId(null); }}
                style={{ flex: 1, padding: '8px 0', fontSize: 12, fontWeight: 600, textAlign: 'center', letterSpacing: '0.02em', textTransform: 'uppercase', borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s', backgroundColor: leftTab === tab ? T.primary : 'transparent', color: leftTab === tab ? '#fff' : T.textSub }}>
                {tab}
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '16px 16px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', backgroundColor: T.bgLight, border: `1px solid ${T.border}`, borderRadius: 8 }}>
            <Search size={16} color={T.textMuted} />
            <input type="text" placeholder={`Search ${leftTab.toLowerCase()}...`} value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, fontSize: 14, background: 'transparent', border: 'none', outline: 'none', color: T.text, fontFamily: 'inherit' }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {filtered.map(u => {
            const active = selectedId === u.id;
            const sc = statusColor(statuses[u.id] || u.status);
            return (
              <div key={u.id} onClick={() => { setSelectedId(u.id); setIsEditing(false); setCenterTab('Profile'); setSelectedClientId(null); }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10, cursor: 'pointer', backgroundColor: active ? T.primaryBg : 'transparent', border: `1px solid ${active ? T.primaryBorder : 'transparent'}`, transition: 'all 0.2s' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: u.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: u.color, border: `2px solid ${u.color}` }}>{u.initials}</div>
                  <div style={{ position: 'absolute', bottom: -1, right: -1, width: 11, height: 11, borderRadius: '50%', backgroundColor: sc.color, border: `2px solid ${T.card}` }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: T.textSub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>{u.role || u.department}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ padding: '14px 16px', borderTop: `1px solid ${T.border}` }}>
          <button onClick={() => setAddModalOpen(true)}
            style={{ width: '100%', padding: 12, backgroundColor: T.primary, border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: '#fff', fontFamily: 'inherit', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = T.primaryDark}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = T.primary}>
            <Plus size={16} /> Add {isAgent ? 'Agent' : 'Checker'}
          </button>
        </div>
      </div>

      {/* ── COL 2: CENTER ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: T.bg, overflow: 'hidden' }}>
        {selectedClient ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32, padding: '0 32px', borderBottom: `1px solid ${T.border}`, backgroundColor: T.card, flexShrink: 0 }}>
              {['Verification Details', 'Documents', 'Activity'].map(tab => (
                <div key={tab} onClick={() => setCenterTab(tab)}
                  style={{ padding: '20px 0', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: centerTab === tab ? T.primary : T.textSub, position: 'relative', transition: 'color 0.2s', whiteSpace: 'nowrap' }}>
                  {tab}
                  {centerTab === tab && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, borderRadius: 2, backgroundColor: T.primary }} />}
                </div>
              ))}
            </div>
            <ClientDetail
              client={selectedClient}
              isChecker={!isAgent}
              onApprove={handleClientApprove}
              onReject={handleClientReject}
              onClose={() => setSelectedClientId(null)}
              onUpdate={handleClientUpdate}
            />
          </>
        ) : selected ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32, padding: '0 32px', borderBottom: `1px solid ${T.border}`, backgroundColor: T.card, flexShrink: 0 }}>
              {(isAgent ? ['Profile', 'Clients', 'Performance', 'Reports'] : ['Profile', 'Audits', 'Compliance', 'Reports']).map(tab => (
                <div key={tab} onClick={() => setCenterTab(tab)}
                  style={{ padding: '20px 0', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: centerTab === tab ? T.primary : T.textSub, position: 'relative', transition: 'color 0.2s', whiteSpace: 'nowrap' }}>
                  {tab}
                  {centerTab === tab && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, borderRadius: 2, backgroundColor: T.primary }} />}
                </div>
              ))}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {centerTab === 'Profile' && (
                <div style={{ width: '100%', maxWidth: 560, margin: '0 auto' }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 24, justifyContent: 'flex-end' }}>
                    <button onClick={handleEdit}
                      style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', border: `1px solid ${isEditing ? T.primary : T.border}`, borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, backgroundColor: isEditing ? T.primary : T.card, color: isEditing ? '#fff' : T.text, fontFamily: 'inherit', transition: 'all 0.2s' }}>
                      {isEditing ? <><Save size={15} /> Save</> : <><Edit2 size={15} /> Edit</>}
                    </button>
                    <button onClick={handleDelete}
                      style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', border: `1px solid ${T.border}`, borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, backgroundColor: T.card, color: T.danger, fontFamily: 'inherit', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = T.dangerBg; e.currentTarget.style.borderColor = T.dangerBorder; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = T.card; e.currentTarget.style.borderColor = T.border; }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: '32px 28px', marginBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: selected.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: selected.color, border: `3px solid ${selected.color}`, marginBottom: 16 }}>{selected.initials}</div>
                    {isEditing
                      ? <input name="fullName" value={editData.fullName || editData.name || ''} onChange={e => setEditData({ ...editData, fullName: e.target.value, name: e.target.value })}
                          style={{ fontSize: 24, fontWeight: 700, textAlign: 'center', border: 'none', borderBottom: `2px solid ${T.primary}`, outline: 'none', backgroundColor: 'transparent', color: T.text, fontFamily: 'inherit', width: '100%', marginBottom: 8 }} />
                      : <div style={{ fontSize: 24, fontWeight: 700, color: T.text, marginBottom: 6 }}>{selected.fullName || selected.name}</div>
                    }
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, backgroundColor: T.primaryBg, border: `1px solid ${T.primaryBorder}`, marginBottom: 20 }}>
                      {isAgent ? <Briefcase size={13} color={T.primary} /> : <Shield size={13} color={T.primary} />}
                      {isEditing
                        ? <input name="role" value={editData.role || ''} onChange={e => setEditData({ ...editData, [e.target.name]: e.target.value })}
                            style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', backgroundColor: 'transparent', border: 'none', outline: 'none', color: T.primary, width: 180, fontFamily: 'inherit' }} />
                        : <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', color: T.primary }}>{selected.role}</span>
                      }
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%' }}>
                      {profileStats.map(({ label, value, name, icon, color }) => (
                        <div key={label} style={{ backgroundColor: T.bgLight, border: `1px solid ${T.border}`, borderRadius: 14, padding: '18px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
                          {isEditing
                            ? <input name={name} value={value || ''} onChange={e => setEditData({ ...editData, [e.target.name]: e.target.value })}
                                style={{ fontSize: 20, fontWeight: 700, textAlign: 'center', border: 'none', borderBottom: `1px solid ${T.border}`, outline: 'none', backgroundColor: 'transparent', color: T.text, fontFamily: 'inherit', width: '100%' }} />
                            : <div style={{ fontSize: 20, fontWeight: 700, color: T.text }}>{value}</div>
                          }
                          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', color: T.textMuted }}>{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
                    {[
                      [
                        { label: 'Department', name: 'department', value: (isEditing ? editData : selected).department },
                        { label: isAgent ? 'Region' : 'Clearance Level', name: isAgent ? 'region' : 'clearanceLevel', value: (isEditing ? editData : selected)[isAgent ? 'region' : 'clearanceLevel'] },
                      ],
                      [
                        { label: 'Qualification', name: 'qualification', value: (isEditing ? editData : selected).qualification },
                        { label: 'Experience', name: 'experience', value: (isEditing ? editData : selected).experience },
                      ],
                      [
                        { label: 'Gender', name: 'gender', value: (isEditing ? editData : selected).gender, options: ['Male', 'Female', 'Other'] },
                        { label: 'Join Date', name: 'joinDate', value: (isEditing ? editData : selected).joinDate },
                      ],
                    ].map((row, ri) => (
                      <div key={ri} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: ri < 2 ? `1px solid ${T.border}` : 'none' }}>
                        {row.map((f, fi) => (
                          <div key={f.name} style={{ padding: '16px 20px', borderRight: fi === 0 ? `1px solid ${T.border}` : 'none' }}>
                            <Field label={f.label} name={f.name} value={f.value} options={f.options} isEditing={isEditing} editData={editData} setEditData={setEditData} />
                          </div>
                        ))}
                      </div>
                    ))}
                    <div style={{ padding: '16px 20px', borderTop: `1px solid ${T.border}` }}>
                      <Field label="Email" name="email" value={(isEditing ? editData : selected).email} isEditing={isEditing} editData={editData} setEditData={setEditData} />
                    </div>
                    <div style={{ padding: '16px 20px', borderTop: `1px solid ${T.border}` }}>
                      <Field label="Phone" name="phone" value={(isEditing ? editData : selected).phone} isEditing={isEditing} editData={editData} setEditData={setEditData} />
                    </div>
                    <div style={{ padding: '16px 20px', borderTop: `1px solid ${T.border}` }}>
                      <Field label="Address" name="address" value={(isEditing ? editData : selected).address} isEditing={isEditing} editData={editData} setEditData={setEditData} />
                    </div>
                  </div>
                  {isAgent && (
                    <div style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <Lock size={18} color={T.warning} style={{ flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 4 }}>Agent Permissions</div>
                        <div style={{ fontSize: 13, color: T.textSub, lineHeight: 1.5 }}>This agent can view and submit client applications. Client approval and rejection is restricted to <strong>Checker</strong> roles only.</div>
                      </div>
                    </div>
                  )}
                  <div style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em', color: T.text }}>Account Status</span>
                        <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em', backgroundColor: statusColor(statuses[selected.id] || selected.status).bg, color: statusColor(statuses[selected.id] || selected.status).color, border: `1px solid ${statusColor(statuses[selected.id] || selected.status).border}` }}>
                          {statuses[selected.id] || selected.status}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: T.textSub }}>Staff System Access Control</div>
                    </div>
                    <div onClick={() => setStatuses(prev => {
                        const cur = prev[selected.id] || selected.status;
                        const next = cur === 'Active' ? 'Blocked' : 'Active';
                        return { ...prev, [selected.id]: next };
                      })}
                      style={{ width: 48, height: 26, borderRadius: 13, cursor: 'pointer', position: 'relative', transition: 'background 0.3s', backgroundColor: (statuses[selected.id] || selected.status) === 'Active' ? T.success : T.borderLight, boxShadow: (statuses[selected.id] || selected.status) === 'Active' ? `0 0 12px ${T.success}60` : 'none' }}>
                      <div style={{ position: 'absolute', top: 3, left: (statuses[selected.id] || selected.status) === 'Active' ? 25 : 3, width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', transition: 'left 0.3s' }} />
                    </div>
                  </div>
                </div>
              )}
              {(centerTab === 'Clients' || centerTab === 'Audits') && (
                <div style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 24 }}>{isAgent ? 'Client Portfolio' : 'Recent Audits'}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {(isAgent ? [
                      { name: 'Thornton Family Trust', value: '$1.8M', status: 'Active', since: 'Mar 2020' },
                      { name: 'Okafor Holdings LLC', value: '$940K', status: 'Active', since: 'Aug 2021' },
                      { name: 'Delacroix Foundation', value: '$2.4M', status: 'Pending', since: 'Jan 2019' },
                      { name: 'Shah Investments', value: '$620K', status: 'Active', since: 'Nov 2022' },
                    ] : [
                      { name: 'Wire Transfer Batch #8821', value: '$4.2M', status: 'Cleared', since: '2 hrs ago' },
                      { name: 'SWIFT Compliance Check', value: '88 txns', status: 'Flagged', since: '1 day ago' },
                      { name: 'AML Screening — LATAM', value: '312 records', status: 'Cleared', since: '2 days ago' },
                      { name: 'Counterparty Risk Review', value: '22 entities', status: 'Cleared', since: '3 days ago' },
                    ]).map((item, i) => (
                      <div key={i} style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 4 }}>{item.name}</div>
                          <div style={{ fontSize: 13, color: T.textSub }}>{isAgent ? `Since ${item.since}` : item.since} • {item.value}</div>
                        </div>
                        <span style={{ padding: '5px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em', ...statusColor(item.status === 'Active' || item.status === 'Cleared' ? 'Active' : item.status === 'Flagged' ? 'Flagged' : 'Pending') }}>{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(centerTab === 'Performance' || centerTab === 'Compliance') && (
                <div style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 24 }}>{isAgent ? 'Performance Metrics' : 'Compliance Overview'}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
                    {(isAgent ? [
                      { label: 'YTD Revenue', value: selected.revenue, icon: <TrendingUp size={20} />, color: T.success },
                      { label: 'Client Retention', value: '96%', icon: <Star size={20} />, color: T.primary },
                    ] : [
                      { label: 'Audit Accuracy', value: selected.accuracy, icon: <Target size={20} />, color: T.success },
                      { label: 'Cases Cleared', value: `${selected.audits}`, icon: <CheckCircle size={20} />, color: T.primary },
                    ]).map((m, i) => (
                      <div key={i} style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: m.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color }}>{m.icon}</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: T.text }}>{m.value}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', color: T.textMuted }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', color: T.textSub, marginBottom: 14 }}>Recent Activity</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(isAgent ? [
                      { title: 'Q3 Portfolio Review completed', date: '3 days ago' },
                      { title: 'New client onboarded — Delacroix Foundation', date: '1 week ago' },
                      { title: 'Annual KYC renewal — 12 clients', date: '2 weeks ago' },
                    ] : [
                      { title: 'SWIFT batch #8821 cleared', date: '2 hours ago' },
                      { title: 'AML flag escalated — Case #CR-441', date: '1 day ago' },
                      { title: 'Quarterly compliance report submitted', date: '1 week ago' },
                    ]).map((a, i) => (
                      <div key={i} style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '15px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{a.title}</div>
                        <div style={{ fontSize: 13, color: T.textSub, whiteSpace: 'nowrap', marginLeft: 16 }}>{a.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {centerTab === 'Reports' && (
                <div style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 24 }}>Documents & Reports</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {['Annual Performance Summary 2023', 'Q3 Client Portfolio Report', 'KYC Compliance Certificate', 'Risk Assessment Review'].map((doc, i) => (
                      <div key={i} style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: T.primaryBg, border: `1px solid ${T.primaryBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileText size={18} color={T.primary} />
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{doc}.pdf</div>
                        </div>
                        <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', border: `1px solid ${T.border}`, borderRadius: 8, background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: T.textSub, fontFamily: 'inherit' }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = T.bgLight; e.currentTarget.style.color = T.text; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = T.textSub; }}>
                          <Download size={14} /> Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, color: T.textMuted }}>
            <Search size={48} opacity={0.2} />
            <div style={{ fontSize: 16, fontWeight: 600 }}>Select a {isAgent ? 'agent' : 'checker'}</div>
          </div>
        )}
      </div>

      {/* ── COL 3: RIGHT — Client Verification Panel ── */}
      <div style={{ width: 460, flexShrink: 0, borderLeft: `1px solid ${T.border}`, backgroundColor: T.card, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '20px 20px 0', flexShrink: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
            {[
              { label: 'TOTAL CLIENTS', value: clients.length, icon: <UsersIcon size={18} />, color: T.primary },
              { label: 'PENDING KYC', value: pendingClients, icon: <Clock size={18} />, color: T.warning },
              { label: 'APPROVED', value: approvedClients, icon: <CheckCircle size={18} />, color: T.success },
              { label: 'STAFF ACTIVE', value: activeCount, icon: <Shield size={18} />, color: T.purple },
            ].map(s => (
              <div key={s.label} style={{ backgroundColor: T.bgLight, border: `1px solid ${T.border}`, borderRadius: 12, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: s.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', color: T.textMuted, marginBottom: 3 }}>{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: T.text }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', backgroundColor: T.bgLight, border: `1px solid ${T.border}`, borderRadius: 10, marginBottom: 12 }}>
            <Search size={16} color={T.textMuted} />
            <input type="text" placeholder="Search clients by name, type, agent..." value={clientSearch} onChange={e => setClientSearch(e.target.value)}
              style={{ flex: 1, fontSize: 14, background: 'transparent', border: 'none', outline: 'none', color: T.text, fontFamily: 'inherit' }} />
            {clientSearch && (
              <button onClick={() => setClientSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textMuted, padding: 0, display: 'flex' }}><X size={14} /></button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {STATUS_FILTERS.map(filter => (
              <button key={filter} onClick={() => setClientStatusFilter(filter)} style={filterPillStyle(filter)}>
                {filter === 'Pending' && <Clock size={10} />}
                {filter === 'Approved' && <Check size={10} />}
                {filter === 'Rejected' && <XCircle size={10} />}
                {filter === 'All' && <Filter size={10} />}
                {filter}
                <span style={{ marginLeft: 2, padding: '1px 6px', borderRadius: 10, fontSize: 10, fontWeight: 700, backgroundColor: clientStatusFilter === filter ? 'rgba(255,255,255,0.2)' : T.bgLight, color: clientStatusFilter === filter ? 'inherit' : T.textMuted }}>
                  {filterCounts[filter]}
                </span>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>Client Verifications</div>
              <div style={{ fontSize: 12, color: T.textSub }}>
                {filteredClients.length} of {clients.length} clients
                {clientStatusFilter !== 'All' ? ` · ${clientStatusFilter.toLowerCase()}` : ''} · {pendingClients} pending review
              </div>
            </div>
            {!isAgent ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', backgroundColor: T.successBg, borderRadius: 8, border: `1px solid ${T.successBorder}` }}>
                <Shield size={12} color={T.success} />
                <span style={{ fontSize: 11, fontWeight: 600, color: T.success }}>Checker Access</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', backgroundColor: T.warningBg, borderRadius: 8, border: `1px solid ${T.warningBorder}` }}>
                <Lock size={12} color={T.warning} />
                <span style={{ fontSize: 11, fontWeight: 600, color: T.warning }}>View Only</span>
              </div>
            )}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 20px' }}>
          {filteredClients.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', gap: 12, color: T.textMuted }}>
              <Filter size={32} opacity={0.3} />
              <div style={{ fontSize: 14, fontWeight: 600 }}>No clients match this filter</div>
              <button onClick={() => { setClientStatusFilter('All'); setClientSearch(''); }}
                style={{ fontSize: 13, color: T.primary, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}>Clear filters</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredClients.map(client => {
                const sc = statusColor(client.status);
                const rc = riskColor(client.riskLevel);
                const isSelected = selectedClientId === client.id;
                const canQuickAct = !isAgent && client.status === 'Pending';
                return (
                  <div key={client.id}
                    onClick={() => { setSelectedClientId(client.id); setCenterTab('Verification Details'); }}
                    style={{ padding: '16px 18px', borderRadius: 12, border: `1px solid ${isSelected ? T.primaryBorder : T.border}`, backgroundColor: isSelected ? T.primaryBg : T.bgLight, cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: client.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: client.color, border: `2px solid ${client.color}`, flexShrink: 0 }}>{client.initials}</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 3 }}>{client.name}</div>
                          <div style={{ fontSize: 12, color: T.textSub }}>{client.type}</div>
                        </div>
                      </div>
                      <ChevronRight size={16} color={T.textMuted} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em', backgroundColor: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>{client.status}</span>
                      <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em', backgroundColor: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>Risk: {client.riskLevel}</span>
                      <span style={{ fontSize: 11, color: T.textMuted, marginLeft: 'auto' }}>Agent: {client.assignedAgent.split(' ')[0]}</span>
                    </div>
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <DollarSign size={12} color={T.textMuted} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{client.financials.initialDeposit}</span>
                        <span style={{ fontSize: 11, color: T.textSub }}>initial deposit</span>
                      </div>
                      <div style={{ fontSize: 11, color: T.textMuted }}>{client.submittedDate}</div>
                    </div>
                    {canQuickAct && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
                        <button
                          onClick={e => { e.stopPropagation(); handleClientApprove(client.id); }}
                          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 0', backgroundColor: T.successBg, border: `1px solid ${T.successBorder}`, borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: T.success, fontFamily: 'inherit', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = T.success; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = T.success; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = T.successBg; e.currentTarget.style.color = T.success; e.currentTarget.style.borderColor = T.successBorder; }}>
                          <Check size={13} /> Approve
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); handleClientReject(client.id); }}
                          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 0', backgroundColor: T.dangerBg, border: `1px solid ${T.dangerBorder}`, borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: T.danger, fontFamily: 'inherit', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = T.danger; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = T.danger; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = T.dangerBg; e.currentTarget.style.color = T.danger; e.currentTarget.style.borderColor = T.dangerBorder; }}>
                          <XCircle size={13} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AddStaffModal open={addModalOpen} onClose={() => setAddModalOpen(false)} type={leftTab} onAdd={handleAdd} />
    </div>
  );
};

export default Users;