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
  Settings, LogOut, Menu, Activity, Filter, ArrowLeft
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
  // ── Adrian Cole (4 clients) ──────────────────────────────────
  { id: 'CL001', initials: 'TF', color: '#3b82f6', name: 'Thornton Family Trust', type: 'Corporate Trust', accountNo: 'AUR-0042-TFT', assignedAgent: 'Adrian Cole', submittedDate: 'Apr 18, 2026', status: 'Pending', riskLevel: 'Medium', contact: { name: 'Edward Thornton', email: 'e.thornton@thorntongroup.com', phone: '+1 415 822 0044', address: '1200 Pacific Ave, San Francisco, CA 94109' }, financials: { initialDeposit: '$1,800,000', expectedAUM: '$4.2M', sourceOfFunds: 'Business Revenue & Inheritance', annualIncome: '$620,000' }, kyc: { passportNo: 'US7842910', nationality: 'American', dob: 'Mar 12, 1965', pep: 'No', sanctionCheck: 'Clear', amlScore: '18 / 100', idVerified: true, addressVerified: true, incomeVerified: true }, documents: ['Passport Copy', 'Proof of Address', 'Source of Funds Declaration', 'Trust Deed'], notes: 'High-net-worth client. Trust established 2012. Previously banked with UBS. Low activity risk profile.' },
  { id: 'CL007', initials: 'PG', color: '#60a5fa', name: 'Pacific Grove Capital', type: 'Private Investment Vehicle', accountNo: 'AUR-0101-PGC', assignedAgent: 'Adrian Cole', submittedDate: 'Mar 10, 2026', status: 'Approved', riskLevel: 'Low', contact: { name: 'Sandra Holt', email: 's.holt@pgcapital.com', phone: '+1 415 900 3300', address: '555 California St, San Francisco, CA 94104' }, financials: { initialDeposit: '$3,200,000', expectedAUM: '$8.1M', sourceOfFunds: 'Equity Sale Proceeds', annualIncome: '$1,400,000' }, kyc: { passportNo: 'US6610238', nationality: 'American', dob: 'Jun 22, 1960', pep: 'No', sanctionCheck: 'Clear', amlScore: '11 / 100', idVerified: true, addressVerified: true, incomeVerified: true }, documents: ['Passport Copy', 'Articles of Incorporation', 'Audited Financials 2023'], notes: 'Longstanding relationship. Previously managed at Goldman. Full compliance clearance received.' },
  { id: 'CL008', initials: 'RV', color: '#2563eb', name: 'Redwood Valley LLC', type: 'Limited Liability Company', accountNo: 'AUR-0114-RVL', assignedAgent: 'Adrian Cole', submittedDate: 'Feb 28, 2026', status: 'Approved', riskLevel: 'Low', contact: { name: 'Marcus Lee', email: 'm.lee@redwoodvalley.com', phone: '+1 650 411 2200', address: '3000 Sand Hill Rd, Menlo Park, CA 94025' }, financials: { initialDeposit: '$980,000', expectedAUM: '$2.3M', sourceOfFunds: 'Tech Startup Exit', annualIncome: '$500,000' }, kyc: { passportNo: 'US5512309', nationality: 'American', dob: 'Nov 09, 1977', pep: 'No', sanctionCheck: 'Clear', amlScore: '14 / 100', idVerified: true, addressVerified: true, incomeVerified: true }, documents: ['Passport Copy', 'Operating Agreement', 'Source of Funds Declaration'], notes: 'Clean KYC. Tech liquidity event confirmed via notary.' },
  { id: 'CL009', initials: 'BP', color: '#1d4ed8', name: 'Blackstone Partners', type: 'Partnership', accountNo: 'AUR-0122-BPT', assignedAgent: 'Adrian Cole', submittedDate: 'Jan 14, 2026', status: 'Rejected', riskLevel: 'High', contact: { name: 'Tom Blackstone', email: 't.black@blackstoneptnrs.com', phone: '+1 415 700 8800', address: '101 California St, San Francisco, CA 94111' }, financials: { initialDeposit: '$450,000', expectedAUM: '$1.1M', sourceOfFunds: 'Investment Returns', annualIncome: '$180,000' }, kyc: { passportNo: 'US9920443', nationality: 'American', dob: 'Apr 30, 1972', pep: 'No', sanctionCheck: 'Flagged', amlScore: '71 / 100', idVerified: true, addressVerified: false, incomeVerified: false }, documents: ['Passport Copy', 'Partnership Agreement'], notes: 'AML flag triggered. Partial name match against OFAC list. Re-submission pending enhanced due diligence.' },

  // ── Maya Tahir (3 clients) ────────────────────────────────────
  { id: 'CL004', initials: 'SI', color: '#f59e0b', name: 'Shah Investments', type: 'Private Investment Vehicle', accountNo: 'AUR-0074-SHI', assignedAgent: 'Maya Tahir', submittedDate: 'Apr 22, 2026', status: 'Rejected', riskLevel: 'High', contact: { name: 'Rohan Shah', email: 'r.shah@shahinv.com', phone: '+91 22 4001 7700', address: 'Nariman Point, Mumbai 400021' }, financials: { initialDeposit: '$620,000', expectedAUM: '$1.4M', sourceOfFunds: 'Equity Trading', annualIncome: '$290,000' }, kyc: { passportNo: 'IN8830221', nationality: 'Indian', dob: 'Sep 15, 1980', pep: 'No', sanctionCheck: 'Flagged', amlScore: '77 / 100', idVerified: true, addressVerified: true, incomeVerified: false }, documents: ['Passport Copy', 'SEBI Registration', 'Demat Account Statement'], notes: 'Sanction screening returned a partial match. Income verification could not be completed. Application rejected pending re-submission.' },
  { id: 'CL010', initials: 'KG', color: '#059669', name: 'Kim & Go Family Office', type: 'Family Office', accountNo: 'AUR-0133-KGF', assignedAgent: 'Maya Tahir', submittedDate: 'Mar 25, 2026', status: 'Approved', riskLevel: 'Low', contact: { name: 'Jin-Ho Kim', email: 'j.kim@kimgofamily.sg', phone: '+65 9111 4422', address: '9 Orchard Blvd, Singapore 248641' }, financials: { initialDeposit: '$2,100,000', expectedAUM: '$5.0M', sourceOfFunds: 'Family Business Dividends', annualIncome: '$900,000' }, kyc: { passportNo: 'SG8800412', nationality: 'Singaporean', dob: 'Feb 14, 1968', pep: 'No', sanctionCheck: 'Clear', amlScore: '8 / 100', idVerified: true, addressVerified: true, incomeVerified: true }, documents: ['Passport Copy', 'Family Charter', 'Audited Financials 2023', 'Board Resolution'], notes: 'Well-known Singapore family. Clean record. Full documentation submitted.' },
  { id: 'CL011', initials: 'TC', color: '#10b981', name: 'Tanaka Corp Treasury', type: 'Corporate Account', accountNo: 'AUR-0144-TCT', assignedAgent: 'Maya Tahir', submittedDate: 'Apr 05, 2026', status: 'Pending', riskLevel: 'Medium', contact: { name: 'Yuki Tanaka', email: 'y.tanaka@tanakacorp.jp', phone: '+81 3 5555 0100', address: '2-1-1 Nihonbashi, Tokyo 103-0027' }, financials: { initialDeposit: '$1,500,000', expectedAUM: '$3.8M', sourceOfFunds: 'Corporate Reserves', annualIncome: '$750,000' }, kyc: { passportNo: 'JP77300182', nationality: 'Japanese', dob: 'Aug 01, 1974', pep: 'No', sanctionCheck: 'Clear', amlScore: '26 / 100', idVerified: true, addressVerified: true, incomeVerified: false }, documents: ['Passport Copy', 'Corporate Registry', 'Board Authorization Letter'], notes: 'Treasury account for Japanese manufacturing conglomerate. Income docs pending translation.' },

  // ── Jonas Reyes (2 clients) ───────────────────────────────────
  { id: 'CL005', initials: 'MG', color: '#ec4899', name: 'Mercer-Galvan Family', type: 'Individual / Joint Account', accountNo: 'AUR-0088-MGF', assignedAgent: 'Jonas Reyes', submittedDate: 'Apr 24, 2026', status: 'Pending', riskLevel: 'Low', contact: { name: 'Carlos Mercer-Galvan', email: 'c.mercer@mgfamily.mx', phone: '+52 55 8801 2200', address: 'Lomas de Chapultepec, CDMX 11000' }, financials: { initialDeposit: '$550,000', expectedAUM: '$1.2M', sourceOfFunds: 'Family Business Sale', annualIncome: '$210,000' }, kyc: { passportNo: 'MX99201834', nationality: 'Mexican', dob: 'Feb 19, 1975', pep: 'No', sanctionCheck: 'Clear', amlScore: '22 / 100', idVerified: true, addressVerified: true, incomeVerified: true }, documents: ['Passport Copy', 'Proof of Address', 'Business Sale Agreement', 'Tax Returns 2023'], notes: 'Clean profile. All documents submitted. Awaiting final checker approval.' },
  { id: 'CL012', initials: 'CE', color: '#f97316', name: 'Castillo Energy Fund', type: 'Investment Fund', accountNo: 'AUR-0155-CEF', assignedAgent: 'Jonas Reyes', submittedDate: 'Mar 18, 2026', status: 'Approved', riskLevel: 'Medium', contact: { name: 'Felipe Castillo', email: 'f.castillo@castilloenergy.com', phone: '+52 55 3322 9900', address: 'Av. Insurgentes Sur 1898, CDMX 01030' }, financials: { initialDeposit: '$1,700,000', expectedAUM: '$4.5M', sourceOfFunds: 'Energy Sector Returns', annualIncome: '$830,000' }, kyc: { passportNo: 'MX88100211', nationality: 'Mexican', dob: 'Mar 28, 1969', pep: 'No', sanctionCheck: 'Clear', amlScore: '29 / 100', idVerified: true, addressVerified: true, incomeVerified: true }, documents: ['Passport Copy', 'Fund Prospectus', 'Audited Financials 2023', 'Source of Funds Declaration'], notes: 'Energy sector fund. Compliant. Approved after two-stage KYC review.' },

  // ── Priya Anand (3 clients) ───────────────────────────────────
  { id: 'CL002', initials: 'OH', color: '#10b981', name: 'Okafor Holdings LLC', type: 'Limited Liability Company', accountNo: 'AUR-0059-OHL', assignedAgent: 'Priya Anand', submittedDate: 'Apr 20, 2026', status: 'Pending', riskLevel: 'High', contact: { name: 'Adaeze Okafor', email: 'a.okafor@okaforholdings.ng', phone: '+234 1 740 5500', address: 'Plot 14, Adeola Odeku St, Victoria Island, Lagos' }, financials: { initialDeposit: '$940,000', expectedAUM: '$2.1M', sourceOfFunds: 'Real Estate & Trade Finance', annualIncome: '$380,000' }, kyc: { passportNo: 'NG88201043', nationality: 'Nigerian', dob: 'Jul 28, 1978', pep: 'Yes — Disclosed', sanctionCheck: 'Under Review', amlScore: '54 / 100', idVerified: true, addressVerified: false, incomeVerified: true }, documents: ['Passport Copy', 'CAC Registration', 'Source of Funds Declaration', 'PEP Disclosure Form'], notes: 'PEP disclosure filed. Enhanced due diligence required per AML policy §4.2. Address verification pending.' },
  { id: 'CL013', initials: 'LX', color: '#a78bfa', name: 'Luxe Partners EMEA', type: 'Partnership', accountNo: 'AUR-0161-LXP', assignedAgent: 'Priya Anand', submittedDate: 'Feb 14, 2026', status: 'Approved', riskLevel: 'Low', contact: { name: 'Helena Strauss', email: 'h.strauss@luxepartners.eu', phone: '+49 30 8822 4411', address: 'Unter den Linden 77, Berlin 10117' }, financials: { initialDeposit: '$2,600,000', expectedAUM: '$6.2M', sourceOfFunds: 'Real Estate Portfolio', annualIncome: '$1,200,000' }, kyc: { passportNo: 'DE5540912', nationality: 'German', dob: 'Jan 17, 1963', pep: 'No', sanctionCheck: 'Clear', amlScore: '10 / 100', idVerified: true, addressVerified: true, incomeVerified: true }, documents: ['Passport Copy', 'Partnership Deed', 'Property Valuation Reports', 'Tax Returns 2023'], notes: 'Established European real estate partnership. Excellent compliance history.' },
  { id: 'CL014', initials: 'NF', color: '#7c3aed', name: 'Nordic Future Fund', type: 'Sovereign Wealth Sub-Fund', accountNo: 'AUR-0172-NFF', assignedAgent: 'Priya Anand', submittedDate: 'Apr 12, 2026', status: 'Pending', riskLevel: 'Medium', contact: { name: 'Erik Lindqvist', email: 'e.lindqvist@nordicff.se', phone: '+46 8 555 0220', address: 'Biblioteksgatan 29, Stockholm 114 35' }, financials: { initialDeposit: '$4,800,000', expectedAUM: '$11.0M', sourceOfFunds: 'Institutional Fund Allocation', annualIncome: '$2,200,000' }, kyc: { passportNo: 'SE9920041', nationality: 'Swedish', dob: 'Oct 05, 1971', pep: 'Yes — Disclosed', sanctionCheck: 'Under Review', amlScore: '43 / 100', idVerified: true, addressVerified: true, incomeVerified: false }, documents: ['Passport Copy', 'Fund Authorization Letter', 'Annual Report 2023', 'PEP Disclosure Form'], notes: 'Institutional sub-fund. PEP disclosed (government-linked entity). Enhanced KYC in progress.' },

  // ── Hugo Lambert (2 clients) ──────────────────────────────────
  { id: 'CL003', initials: 'DF', color: '#8b5cf6', name: 'Delacroix Foundation', type: 'Non-Profit Foundation', accountNo: 'AUR-0031-DLF', assignedAgent: 'Hugo Lambert', submittedDate: 'Apr 10, 2026', status: 'Approved', riskLevel: 'Low', contact: { name: 'Isabelle Delacroix', email: 'i.delacroix@dlfoundation.fr', phone: '+33 1 47 90 12 44', address: '22 Rue du Faubourg Saint-Honoré, Paris 75008' }, financials: { initialDeposit: '$2,400,000', expectedAUM: '$5.8M', sourceOfFunds: 'Endowment & Donations', annualIncome: '$1,100,000' }, kyc: { passportNo: 'FR44820191', nationality: 'French', dob: 'Nov 02, 1961', pep: 'No', sanctionCheck: 'Clear', amlScore: '9 / 100', idVerified: true, addressVerified: true, incomeVerified: true }, documents: ['Passport Copy', 'Foundation Charter', 'Annual Report 2023', 'Board Resolution'], notes: 'Established philanthropic institution. Full documentation received. Approved by compliance board.' },
  { id: 'CL015', initials: 'MW', color: '#0ea5e9', name: 'Manhattan Wealth Group', type: 'Family Office', accountNo: 'AUR-0183-MWG', assignedAgent: 'Hugo Lambert', submittedDate: 'Mar 03, 2026', status: 'Approved', riskLevel: 'Low', contact: { name: 'George Whitfield', email: 'g.whitfield@manhattanwg.com', phone: '+1 212 800 4400', address: '520 Park Ave, New York, NY 10065' }, financials: { initialDeposit: '$8,500,000', expectedAUM: '$22.0M', sourceOfFunds: 'Multi-Generational Wealth', annualIncome: '$4,800,000' }, kyc: { passportNo: 'US3310082', nationality: 'American', dob: 'Dec 11, 1955', pep: 'No', sanctionCheck: 'Clear', amlScore: '6 / 100', idVerified: true, addressVerified: true, incomeVerified: true }, documents: ['Passport Copy', 'Family Trust Deed', 'CPA Wealth Statement', 'IRS Filing 2023'], notes: 'Ultra-HNW family office. Pristine compliance history spanning 15 years. Priority client.' },

  // ── Sophia Berg (2 clients) ───────────────────────────────────
  { id: 'CL006', initials: 'AV', color: '#06b6d4', name: 'Arevalo Ventures', type: 'Venture Capital Fund', accountNo: 'AUR-0096-AVF', assignedAgent: 'Sophia Berg', submittedDate: 'Apr 23, 2026', status: 'Pending', riskLevel: 'Medium', contact: { name: 'Lucia Arevalo', email: 'l.arevalo@arevalovc.com', phone: '+34 93 481 7722', address: 'Passeig de Gràcia 88, Barcelona 08008' }, financials: { initialDeposit: '$1,200,000', expectedAUM: '$3.5M', sourceOfFunds: 'VC Fund Returns', annualIncome: '$480,000' }, kyc: { passportNo: 'ES77301228', nationality: 'Spanish', dob: 'Jun 04, 1983', pep: 'No', sanctionCheck: 'Clear', amlScore: '31 / 100', idVerified: true, addressVerified: true, incomeVerified: false }, documents: ['Passport Copy', 'Fund Prospectus', 'Audited Accounts 2023', 'LP Agreement'], notes: 'Income verification in progress. Fund audited by PwC Barcelona. Low risk history.' },
  { id: 'CL016', initials: 'ZH', color: '#14b8a6', name: 'Zurich Heritage Fund', type: 'Private Equity Fund', accountNo: 'AUR-0194-ZHF', assignedAgent: 'Sophia Berg', submittedDate: 'Apr 01, 2026', status: 'Pending', riskLevel: 'Low', contact: { name: 'Claudia Meier', email: 'c.meier@zheritfund.ch', phone: '+41 44 800 2200', address: 'Talstrasse 82, Zurich 8001' }, financials: { initialDeposit: '$3,300,000', expectedAUM: '$7.5M', sourceOfFunds: 'Private Equity Returns', annualIncome: '$1,600,000' }, kyc: { passportNo: 'CH5500281', nationality: 'Swiss', dob: 'Jul 19, 1978', pep: 'No', sanctionCheck: 'Clear', amlScore: '12 / 100', idVerified: true, addressVerified: true, incomeVerified: true }, documents: ['Passport Copy', 'Fund Charter', 'FINMA Registration', 'Audited Accounts 2023'], notes: 'Swiss-domiciled PE fund. FINMA regulated. Awaiting final board sign-off.' },
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
      <div style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 14, width: '100%', maxWidth: 620, maxHeight: '88vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 48px rgba(0,0,0,0.4)' }}>
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: T.primaryBg, border: `1px solid ${T.primaryBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UsersIcon size={16} color={T.primary} />
              </div>
              <span style={{ fontSize: 17, fontWeight: 700, color: T.text }}>Add {isChecker ? 'Checker' : 'Agent'}</span>
            </div>
            <p style={{ fontSize: 12, color: T.textSub, marginLeft: 41 }}>Add one or more staff members at once.</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 5, color: T.textMuted }} onMouseEnter={e => e.currentTarget.style.color = T.text} onMouseLeave={e => e.currentTarget.style.color = T.textMuted}><X size={18} /></button>
        </div>
        <div style={{ overflowY: 'auto', padding: '18px 22px', flex: 1 }}>
          {members.map((m, i) => (
            <div key={i} style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: '16px', marginBottom: 14, position: 'relative', backgroundColor: T.bgLight }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{i + 1}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{isChecker ? 'Checker' : 'Staff'} #{i + 1}</span>
                </div>
                {members.length > 1 && <button onClick={() => removeMember(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.danger, padding: 3 }}><X size={14} /></button>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
                {[
                  { label: 'Full Name', field: 'fullName', placeholder: 'e.g. Sophia Laurent', required: true, icon: <User size={13} /> },
                  { label: 'Email', field: 'email', placeholder: 'name@aurelia.bank', required: true, type: 'email', icon: <Mail size={13} /> },
                  { label: 'Phone', field: 'phone', placeholder: '+1 555 000 0000', icon: <Phone size={13} /> },
                  { label: isChecker ? 'Checker Level' : 'Role', field: 'role', placeholder: isChecker ? 'e.g. Senior Checker' : 'e.g. Relationship Manager', required: true, icon: <Briefcase size={13} /> },
                ].map(({ label, field, placeholder, required, type, icon }) => (
                  <div key={field}>
                    <label style={{ fontSize: 10, fontWeight: 600, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                      {label} {required && <span style={{ color: T.danger }}>*</span>}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: T.textMuted }}>{icon}</div>
                      <input type={type || 'text'} value={m[field]} onChange={e => update(i, field, e.target.value)} placeholder={placeholder}
                        style={{ width: '100%', padding: '9px 11px 9px 33px', border: `1px solid ${T.border}`, borderRadius: 7, fontSize: 13, color: T.text, backgroundColor: T.card, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderColor = T.primary} onBlur={e => e.target.style.borderColor = T.border} />
                    </div>
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Department</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: T.textMuted }}><Building2 size={13} /></div>
                    <input value={m.department} onChange={e => update(i, 'department', e.target.value)} placeholder="e.g. Compliance · EMEA"
                      style={{ width: '100%', padding: '9px 11px 9px 33px', border: `1px solid ${T.border}`, borderRadius: 7, fontSize: 13, color: T.text, backgroundColor: T.card, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = T.primary} onBlur={e => e.target.style.borderColor = T.border} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Status</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: T.textMuted }}><CheckCircle size={13} /></div>
                    <select value={m.status} onChange={e => update(i, 'status', e.target.value)}
                      style={{ width: '100%', padding: '9px 11px 9px 33px', border: `1px solid ${T.border}`, borderRadius: 7, fontSize: 13, color: T.text, backgroundColor: T.card, outline: 'none', fontFamily: 'inherit', appearance: 'none', boxSizing: 'border-box', cursor: 'pointer' }}
                      onFocus={e => e.target.style.borderColor = T.primary} onBlur={e => e.target.style.borderColor = T.border}>
                      <option>Active</option><option>On Leave</option><option>Blocked</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addMember}
            style={{ width: '100%', padding: 12, border: `2px dashed ${T.border}`, borderRadius: 9, background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: T.textSub, fontFamily: 'inherit' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.color = T.primary; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSub; }}>
            <Plus size={14} /> Add another {isChecker ? 'checker' : 'staff member'}
          </button>
        </div>
        <div style={{ padding: '16px 22px', borderTop: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} style={{ padding: '9px 20px', border: `1px solid ${T.border}`, borderRadius: 7, background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: T.text, fontFamily: 'inherit' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving}
            style={{ padding: '9px 20px', backgroundColor: T.primary, border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7, opacity: saving ? 0.6 : 1 }}>
            <UsersIcon size={14} />
            {saving ? 'Saving...' : `Save ${members.length} Member${members.length > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}

const Field = ({ label, name, value, type = 'text', options, isEditing, editData, setEditData }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: T.textMuted }}>{label}</div>
    {isEditing ? (
      options ? (
        <select name={name} value={editData[name] || ''} onChange={e => setEditData({ ...editData, [e.target.name]: e.target.value })}
          style={{ fontSize: 13, fontWeight: 500, backgroundColor: T.bgLight, border: `1px solid ${T.border}`, borderRadius: 5, outline: 'none', color: T.text, padding: '5px 7px', fontFamily: 'inherit' }}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input name={name} type={type} value={editData[name] || ''} onChange={e => setEditData({ ...editData, [e.target.name]: e.target.value })}
          style={{ fontSize: 13, fontWeight: 500, backgroundColor: 'transparent', border: 'none', borderBottom: `2px solid ${T.primary}`, outline: 'none', color: T.text, padding: '3px 0', fontFamily: 'inherit' }} />
      )
    ) : (
      <div style={{ fontSize: 13, fontWeight: 500, color: name === 'status' ? statusColor(value).color : T.text }}>{value || '—'}</div>
    )}
  </div>
);

const KycBadge = ({ ok, label }) => {
  const colors = ok ? { bg: T.successBg, border: T.successBorder, color: T.success } : { bg: T.dangerBg, border: T.dangerBorder, color: T.danger };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}>
      {ok ? <CheckCircle size={11} color={colors.color} /> : <XCircle size={11} color={colors.color} />}
      <span style={{ fontSize: 11, fontWeight: 600, color: colors.color }}>{label}</span>
    </div>
  );
};

function Section({ title, icon, children, last }) {
  return (
    <div style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '16px 18px', marginBottom: last ? 0 : 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 13 }}>
        <div style={{ color: T.primary }}>{icon}</div>
        <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: T.text }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ icon, label, value, highlight, colored }) {
  const col = colored ? statusColor(value).color : highlight ? T.primary : T.text;
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: T.textMuted, marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ color: T.textMuted }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 500, color: col }}>{value || '—'}</span>
      </div>
    </div>
  );
}

function ClientDetail({ client, isChecker, onApprove, onReject, onClose, onUpdate }) {
  const [isClientEditing, setIsClientEditing] = useState(false);
  const [clientEditData, setClientEditData] = useState({});

  const canAct = isChecker && client.status === 'Pending';
  const isPending = client.status === 'Pending';

  const editInputStyle = {
    fontSize: 12, fontWeight: 500, backgroundColor: 'transparent',
    border: 'none', borderBottom: `2px solid ${T.primary}`,
    outline: 'none', color: T.text, padding: '3px 0',
    fontFamily: 'inherit', width: '100%',
  };

  const handleClientEdit = () => {
    if (isClientEditing) {
      onUpdate && onUpdate(client.id, clientEditData);
      setIsClientEditing(false);
    } else {
      setClientEditData({ contact: { ...client.contact }, financials: { ...client.financials }, kyc: { ...client.kyc }, notes: client.notes, riskLevel: client.riskLevel, assignedAgent: client.assignedAgent });
      setIsClientEditing(true);
    }
  };

  const updateContact = (field, val) => setClientEditData(prev => ({ ...prev, contact: { ...prev.contact, [field]: val } }));
  const updateFinancials = (field, val) => setClientEditData(prev => ({ ...prev, financials: { ...prev.financials, [field]: val } }));
  const updateKyc = (field, val) => setClientEditData(prev => ({ ...prev, kyc: { ...prev.kyc, [field]: val } }));

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 46, height: 46, borderRadius: '50%', backgroundColor: client.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: client.color, border: `2px solid ${client.color}`, flexShrink: 0 }}>
            {client.initials}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 5 }}>{client.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: T.textSub, fontWeight: 500 }}>{client.type}</span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: T.textMuted, display: 'inline-block' }} />
              <span style={{ fontSize: 11, color: T.textMuted }}>{client.accountNo}</span>
              <span style={{ padding: '2px 8px', borderRadius: 5, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', ...statusColor(client.status) }}>{client.status}</span>
              {isClientEditing ? (
                <select value={clientEditData.riskLevel || client.riskLevel} onChange={e => setClientEditData(prev => ({ ...prev, riskLevel: e.target.value }))}
                  style={{ padding: '2px 7px', borderRadius: 5, fontSize: 10, fontWeight: 600, backgroundColor: T.bgLight, border: `1px solid ${T.border}`, color: T.text, fontFamily: 'inherit', cursor: 'pointer' }}>
                  <option>Low</option><option>Medium</option><option>High</option>
                </select>
              ) : (
                <span style={{ padding: '2px 8px', borderRadius: 5, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', ...riskColor(client.riskLevel) }}>Risk: {client.riskLevel}</span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
          <button onClick={handleClientEdit}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 13px', border: `1px solid ${isClientEditing ? T.primary : T.border}`, borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600, backgroundColor: isClientEditing ? T.primary : T.card, color: isClientEditing ? '#fff' : T.text, fontFamily: 'inherit' }}>
            {isClientEditing ? <><Save size={12} /> Save</> : <><Edit2 size={12} /> Edit</>}
          </button>
          {isClientEditing && (
            <button onClick={() => setIsClientEditing(false)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 11px', border: `1px solid ${T.border}`, borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600, backgroundColor: T.card, color: T.textSub, fontFamily: 'inherit' }}>
              <X size={12} />
            </button>
          )}
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textMuted, padding: 5 }} onMouseEnter={e => e.currentTarget.style.color = T.text} onMouseLeave={e => e.currentTarget.style.color = T.textMuted}>
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Approve / Reject */}
      <div style={{ marginBottom: 16 }}>
        {!isChecker && isPending && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', backgroundColor: T.warningBg, border: `1px solid ${T.warningBorder}`, borderRadius: 8 }}>
            <Lock size={14} color={T.warning} />
            <span style={{ fontSize: 12, fontWeight: 500, color: T.warning }}>Approval restricted to Checker roles only.</span>
          </div>
        )}
        {isChecker && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={canAct ? onApprove : undefined} disabled={!canAct}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', backgroundColor: canAct ? T.success : T.bgLight, border: 'none', borderRadius: 7, cursor: canAct ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 600, color: canAct ? '#fff' : T.textMuted, fontFamily: 'inherit', opacity: canAct ? 1 : 0.5 }}>
              <Check size={14} /> Approve
            </button>
            <button onClick={canAct ? onReject : undefined} disabled={!canAct}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', backgroundColor: canAct ? T.danger : T.bgLight, border: 'none', borderRadius: 7, cursor: canAct ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 600, color: canAct ? '#fff' : T.textMuted, fontFamily: 'inherit', opacity: canAct ? 1 : 0.5 }}>
              <XCircle size={14} /> Reject
            </button>
            {!isPending && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 14px', backgroundColor: T.bgLight, border: `1px solid ${T.border}`, borderRadius: 7 }}>
                <AlertCircle size={13} color={T.textSub} />
                <span style={{ fontSize: 12, fontWeight: 500, color: T.textSub }}>Already {client.status.toLowerCase()}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <Section title="Contact Information" icon={<User size={14} />}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {isClientEditing ? (
            [{ label: 'Primary Contact', field: 'name', icon: <User size={12} /> }, { label: 'Email', field: 'email', icon: <Mail size={12} /> }, { label: 'Phone', field: 'phone', icon: <Phone size={12} /> }, { label: 'Address', field: 'address', icon: <MapPin size={12} /> }].map(({ label, field, icon }) => (
              <div key={field}>
                <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: T.textMuted, marginBottom: 4 }}>{label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ color: T.textMuted, flexShrink: 0 }}>{icon}</span><input value={clientEditData.contact?.[field] || ''} onChange={e => updateContact(field, e.target.value)} style={editInputStyle} /></div>
              </div>
            ))
          ) : (
            <><InfoRow icon={<User size={12} />} label="Primary Contact" value={client.contact.name} /><InfoRow icon={<Mail size={12} />} label="Email" value={client.contact.email} /><InfoRow icon={<Phone size={12} />} label="Phone" value={client.contact.phone} /><InfoRow icon={<MapPin size={12} />} label="Address" value={client.contact.address} /></>
          )}
        </div>
      </Section>

      <Section title="Financial Profile" icon={<DollarSign size={14} />}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {isClientEditing ? (
            [{ label: 'Initial Deposit', field: 'initialDeposit', icon: <Landmark size={12} /> }, { label: 'Expected AUM', field: 'expectedAUM', icon: <TrendingUp size={12} /> }, { label: 'Annual Income', field: 'annualIncome', icon: <BarChart2 size={12} /> }, { label: 'Source of Funds', field: 'sourceOfFunds', icon: <Layers size={12} /> }].map(({ label, field, icon }) => (
              <div key={field}>
                <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: T.textMuted, marginBottom: 4 }}>{label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ color: T.textMuted, flexShrink: 0 }}>{icon}</span><input value={clientEditData.financials?.[field] || ''} onChange={e => updateFinancials(field, e.target.value)} style={editInputStyle} /></div>
              </div>
            ))
          ) : (
            <><InfoRow icon={<Landmark size={12} />} label="Initial Deposit" value={client.financials.initialDeposit} highlight /><InfoRow icon={<TrendingUp size={12} />} label="Expected AUM" value={client.financials.expectedAUM} highlight /><InfoRow icon={<BarChart2 size={12} />} label="Annual Income" value={client.financials.annualIncome} /><InfoRow icon={<Layers size={12} />} label="Source of Funds" value={client.financials.sourceOfFunds} /></>
          )}
        </div>
      </Section>

      <Section title="KYC & Compliance" icon={<Shield size={14} />}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11, marginBottom: 12 }}>
          {isClientEditing ? (
            <>
              {[{ label: 'Passport / ID No.', field: 'passportNo', icon: <Hash size={12} /> }, { label: 'Nationality', field: 'nationality', icon: <Globe size={12} /> }, { label: 'Date of Birth', field: 'dob', icon: <Calendar size={12} /> }, { label: 'PEP Status', field: 'pep', icon: <AlertTriangle size={12} /> }, { label: 'AML Risk Score', field: 'amlScore', icon: <Target size={12} /> }].map(({ label, field, icon }) => (
                <div key={field}>
                  <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: T.textMuted, marginBottom: 4 }}>{label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ color: T.textMuted, flexShrink: 0 }}>{icon}</span><input value={clientEditData.kyc?.[field] || ''} onChange={e => updateKyc(field, e.target.value)} style={editInputStyle} /></div>
                </div>
              ))}
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: T.textMuted, marginBottom: 4 }}>Sanction Check</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Shield size={12} color={T.textMuted} />
                  <select value={clientEditData.kyc?.sanctionCheck || ''} onChange={e => updateKyc('sanctionCheck', e.target.value)}
                    style={{ fontSize: 12, fontWeight: 500, backgroundColor: T.bgLight, border: `1px solid ${T.border}`, borderRadius: 5, outline: 'none', color: T.text, padding: '3px 7px', fontFamily: 'inherit' }}>
                    <option>Clear</option><option>Under Review</option><option>Flagged</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <><InfoRow icon={<Hash size={12} />} label="Passport / ID No." value={client.kyc.passportNo} /><InfoRow icon={<Globe size={12} />} label="Nationality" value={client.kyc.nationality} /><InfoRow icon={<Calendar size={12} />} label="Date of Birth" value={client.kyc.dob} /><InfoRow icon={<AlertTriangle size={12} />} label="PEP Status" value={client.kyc.pep} /><InfoRow icon={<Shield size={12} />} label="Sanction Check" value={client.kyc.sanctionCheck} colored /><InfoRow icon={<Target size={12} />} label="AML Risk Score" value={client.kyc.amlScore} /></>
          )}
        </div>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {isClientEditing ? (
            ['idVerified', 'addressVerified', 'incomeVerified'].map(field => {
              const labels = { idVerified: 'ID Verified', addressVerified: 'Address Verified', incomeVerified: 'Income Verified' };
              const checked = clientEditData.kyc?.[field];
              return (
                <button key={field} onClick={() => updateKyc(field, !checked)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 600, backgroundColor: checked ? T.successBg : T.dangerBg, border: `1px solid ${checked ? T.successBorder : T.dangerBorder}`, color: checked ? T.success : T.danger }}>
                  {checked ? <CheckCircle size={11} /> : <XCircle size={11} />} {labels[field]}
                </button>
              );
            })
          ) : (
            <><KycBadge ok={client.kyc.idVerified} label="ID Verified" /><KycBadge ok={client.kyc.addressVerified} label="Address Verified" /><KycBadge ok={client.kyc.incomeVerified} label="Income Verified" /></>
          )}
        </div>
      </Section>

      <Section title="Submitted Documents" icon={<FileText size={14} />}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {client.documents.map((doc, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 13px', backgroundColor: T.bgLight, border: `1px solid ${T.border}`, borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, backgroundColor: T.primaryBg, border: `1px solid ${T.primaryBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={13} color={T.primary} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: T.text }}>{doc}.pdf</span>
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', border: `1px solid ${T.border}`, borderRadius: 6, background: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: T.textSub, fontFamily: 'inherit' }}>
                <Download size={11} /> Download
              </button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Banker Notes" icon={<Eye size={14} />} last>
        {isClientEditing ? (
          <textarea value={clientEditData.notes || ''} onChange={e => setClientEditData(prev => ({ ...prev, notes: e.target.value }))} rows={3}
            style={{ width: '100%', padding: '10px 12px', backgroundColor: T.bgLight, border: `1px solid ${T.primary}`, borderRadius: 8, fontSize: 12, color: T.text, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6 }} />
        ) : (
          <div style={{ padding: '12px 14px', backgroundColor: T.warningBg, border: `1px solid ${T.warningBorder}`, borderRadius: 8 }}>
            <p style={{ fontSize: 12, color: T.text, lineHeight: 1.6, margin: 0 }}>{client.notes}</p>
          </div>
        )}
        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          {isClientEditing ? (
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: T.textMuted, marginBottom: 4 }}>Assigned Agent</div>
              <input value={clientEditData.assignedAgent || ''} onChange={e => setClientEditData(prev => ({ ...prev, assignedAgent: e.target.value }))}
                style={{ fontSize: 12, fontWeight: 500, backgroundColor: 'transparent', border: 'none', borderBottom: `2px solid ${T.primary}`, outline: 'none', color: T.text, padding: '3px 0', fontFamily: 'inherit', width: '100%' }} />
            </div>
          ) : (
            <><InfoRow icon={<UsersIcon size={12} />} label="Assigned Agent" value={client.assignedAgent} /><InfoRow icon={<Calendar size={12} />} label="Submitted" value={client.submittedDate} /></>
          )}
        </div>
      </Section>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────
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
  // NEW: filter right panel by agent's own clients
  const [agentClientFilter, setAgentClientFilter] = useState(false);
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

  // When agent is selected and agentClientFilter is on, show only that agent's clients
  const agentName = selected?.fullName || selected?.name || '';
  const baseClients = (isAgent && agentClientFilter && agentName)
    ? clients.filter(c => c.assignedAgent === agentName)
    : clients;

  const filterCounts = {
    All: baseClients.length,
    Pending: baseClients.filter(c => c.status === 'Pending').length,
    Approved: baseClients.filter(c => c.status === 'Approved').length,
    Rejected: baseClients.filter(c => c.status === 'Rejected').length,
  };

  const filteredClients = baseClients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.type.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.assignedAgent.toLowerCase().includes(clientSearch.toLowerCase());
    const matchStatus = clientStatusFilter === 'All' || c.status === clientStatusFilter;
    return matchSearch && matchStatus;
  });

  const agentRealClientCount = isAgent && selected
    ? clients.filter(c => c.assignedAgent === (selected.fullName || selected.name)).length
    : 0;

  const profileStats = isAgent ? [
    { label: 'Total Clients', value: agentRealClientCount, name: 'clients', icon: <UsersIcon size={16} />, color: T.primary, clickable: true },
    { label: 'AUM / Revenue', value: isEditing ? editData.revenue : selected?.revenue, name: 'revenue', icon: <TrendingUp size={16} />, color: T.success, clickable: false },
  ] : [
    { label: 'Total Audits', value: isEditing ? editData.audits : selected?.audits, name: 'audits', icon: <FileText size={16} />, color: T.primary },
    { label: 'Accuracy Rate', value: isEditing ? editData.accuracy : selected?.accuracy, name: 'accuracy', icon: <Target size={16} />, color: T.success },
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
    setStatuses(prev => { const upd = { ...prev }; newItems.forEach(n => { upd[n.id] = n.status; }); return upd; });
  };

  const handleClientApprove = (id) => {
    const targetId = id || selectedClientId;
    setClients(prev => prev.map(c => c.id === targetId ? { ...c, status: 'Approved' } : c));
  };

  const handleClientReject = (id) => {
    const targetId = id || selectedClientId;
    setClients(prev => prev.map(c => c.id === targetId ? { ...c, status: 'Rejected' } : c));
  };

  const handleClientUpdate = (id, ed) => {
    setClients(prev => prev.map(c => {
      if (c.id !== id) return c;
      return { ...c, riskLevel: ed.riskLevel ?? c.riskLevel, assignedAgent: ed.assignedAgent ?? c.assignedAgent, notes: ed.notes ?? c.notes, contact: { ...c.contact, ...ed.contact }, financials: { ...c.financials, ...ed.financials }, kyc: { ...c.kyc, ...ed.kyc } };
    }));
  };

  const handleAgentSelect = (id) => {
    setSelectedId(id);
    setIsEditing(false);
    setCenterTab('Profile');
    setSelectedClientId(null);
    setAgentClientFilter(true);
    setClientStatusFilter('All');
  };

  const filterPillStyle = (filter) => {
    const isActive = clientStatusFilter === filter;
    if (!isActive) return { padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600, cursor: 'pointer', border: `1px solid ${T.border}`, backgroundColor: 'transparent', color: T.textSub, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 };
    const colorMap = {
      All: { bg: T.primaryBg, border: T.primaryBorder, color: T.primary },
      Pending: { bg: T.warningBg, border: T.warningBorder, color: T.warning },
      Approved: { bg: T.successBg, border: T.successBorder, color: T.success },
      Rejected: { bg: T.dangerBg, border: T.dangerBorder, color: T.danger },
    };
    const c = colorMap[filter];
    return { padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600, cursor: 'pointer', border: `1px solid ${c.border}`, backgroundColor: c.bg, color: c.color, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 };
  };

  return (
    <div style={{ display: 'flex', width: 'calc(100% + 64px)', height: '100vh', margin: '-32px', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", backgroundColor: T.bg, overflow: 'hidden' }}>

      {/* ── COL 1: LEFT SIDEBAR ── */}
      <div style={{ width: 240, flexShrink: 0, borderRight: `1px solid ${T.border}`, backgroundColor: T.card, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 16px 12px', borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={17} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.text, letterSpacing: '-0.01em' }}>BANKFLOW</div>
              <div style={{ fontSize: 10, color: T.textSub, fontWeight: 500 }}>SUPER ADMIN</div>
            </div>
          </div>
          <div style={{ display: 'flex', padding: 3, border: `1px solid ${T.border}`, borderRadius: 7, backgroundColor: T.bgLight }}>
            {['AGENTS', 'CHECKERS'].map(tab => (
              <div key={tab} onClick={() => { setLeftTab(tab); setIsEditing(false); setCenterTab('Profile'); setSelectedClientId(null); setAgentClientFilter(false); }}
                style={{ flex: 1, padding: '6px 0', fontSize: 11, fontWeight: 600, textAlign: 'center', letterSpacing: '0.02em', textTransform: 'uppercase', borderRadius: 5, cursor: 'pointer', transition: 'all 0.2s', backgroundColor: leftTab === tab ? T.primary : 'transparent', color: leftTab === tab ? '#fff' : T.textSub }}>
                {tab}
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '11px 12px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 11px', backgroundColor: T.bgLight, border: `1px solid ${T.border}`, borderRadius: 7 }}>
            <Search size={14} color={T.textMuted} />
            <input type="text" placeholder={`Search ${leftTab.toLowerCase()}...`} value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, fontSize: 13, background: 'transparent', border: 'none', outline: 'none', color: T.text, fontFamily: 'inherit' }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '2px 10px 12px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {filtered.map(u => {
            const active = selectedId === u.id;
            const sc = statusColor(statuses[u.id] || u.status);
            // count this agent's clients
            const agentClientsCount = isAgent ? clients.filter(c => c.assignedAgent === (u.fullName || u.name)).length : null;
            return (
              <div key={u.id} onClick={() => handleAgentSelect(u.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 9, cursor: 'pointer', backgroundColor: active ? T.primaryBg : 'transparent', border: `1px solid ${active ? T.primaryBorder : 'transparent'}`, transition: 'all 0.2s' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: u.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: u.color, border: `2px solid ${u.color}` }}>{u.initials}</div>
                  <div style={{ position: 'absolute', bottom: -1, right: -1, width: 9, height: 9, borderRadius: '50%', backgroundColor: sc.color, border: `2px solid ${T.card}` }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: T.textSub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 1 }}>{u.role || u.department}</div>
                </div>
                {isAgent && agentClientsCount > 0 && (
                  <div style={{ fontSize: 10, fontWeight: 700, color: T.primary, backgroundColor: T.primaryBg, border: `1px solid ${T.primaryBorder}`, borderRadius: 10, padding: '1px 6px', flexShrink: 0 }}>{agentClientsCount}</div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ padding: '11px 12px', borderTop: `1px solid ${T.border}` }}>
          <button onClick={() => setAddModalOpen(true)}
            style={{ width: '100%', padding: '9px 0', backgroundColor: T.primary, border: 'none', borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: 'inherit', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = T.primaryDark}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = T.primary}>
            <Plus size={14} /> Add {isAgent ? 'Agent' : 'Checker'}
          </button>
        </div>
      </div>

      {/* ── COL 2: CENTER ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: T.bg, overflow: 'hidden' }}>
        {selectedClient ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '0 24px', borderBottom: `1px solid ${T.border}`, backgroundColor: T.card, flexShrink: 0 }}>
              {['Verification Details', 'Documents', 'Activity'].map(tab => (
                <div key={tab} onClick={() => setCenterTab(tab)}
                  style={{ padding: '16px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: centerTab === tab ? T.primary : T.textSub, position: 'relative', transition: 'color 0.2s', whiteSpace: 'nowrap' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '0 24px', borderBottom: `1px solid ${T.border}`, backgroundColor: T.card, flexShrink: 0 }}>
              {(isAgent ? ['Profile', 'Clients', 'Performance', 'Reports'] : ['Profile', 'Audits', 'Compliance', 'Reports']).map(tab => (
                <div key={tab} onClick={() => setCenterTab(tab)}
                  style={{ padding: '16px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: centerTab === tab ? T.primary : T.textSub, position: 'relative', transition: 'color 0.2s', whiteSpace: 'nowrap' }}>
                  {tab}
                  {centerTab === tab && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, borderRadius: 2, backgroundColor: T.primary }} />}
                </div>
              ))}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {centerTab === 'Profile' && (
                <div style={{ width: '100%', maxWidth: 520, margin: '0 auto' }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 18, justifyContent: 'flex-end' }}>
                    <button onClick={handleEdit}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: `1px solid ${isEditing ? T.primary : T.border}`, borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600, backgroundColor: isEditing ? T.primary : T.card, color: isEditing ? '#fff' : T.text, fontFamily: 'inherit' }}>
                      {isEditing ? <><Save size={13} /> Save</> : <><Edit2 size={13} /> Edit</>}
                    </button>
                    <button onClick={handleDelete}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: `1px solid ${T.border}`, borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600, backgroundColor: T.card, color: T.danger, fontFamily: 'inherit' }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = T.dangerBg; e.currentTarget.style.borderColor = T.dangerBorder; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = T.card; e.currentTarget.style.borderColor = T.border; }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: '24px 22px', marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 68, height: 68, borderRadius: '50%', backgroundColor: selected.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: selected.color, border: `3px solid ${selected.color}`, marginBottom: 13 }}>{selected.initials}</div>
                    {isEditing
                      ? <input name="fullName" value={editData.fullName || editData.name || ''} onChange={e => setEditData({ ...editData, fullName: e.target.value, name: e.target.value })}
                          style={{ fontSize: 20, fontWeight: 700, textAlign: 'center', border: 'none', borderBottom: `2px solid ${T.primary}`, outline: 'none', backgroundColor: 'transparent', color: T.text, fontFamily: 'inherit', width: '100%', marginBottom: 6 }} />
                      : <div style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 5 }}>{selected.fullName || selected.name}</div>
                    }
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 13px', borderRadius: 20, backgroundColor: T.primaryBg, border: `1px solid ${T.primaryBorder}`, marginBottom: 16 }}>
                      {isAgent ? <Briefcase size={11} color={T.primary} /> : <Shield size={11} color={T.primary} />}
                      {isEditing
                        ? <input name="role" value={editData.role || ''} onChange={e => setEditData({ ...editData, [e.target.name]: e.target.value })}
                            style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', backgroundColor: 'transparent', border: 'none', outline: 'none', color: T.primary, width: 170, fontFamily: 'inherit' }} />
                        : <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', color: T.primary }}>{selected.role}</span>
                      }
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
                      {profileStats.map(({ label, value, name, icon, color, clickable }) => (
                        <div key={label}
                          onClick={clickable && !isEditing ? () => setCenterTab('Clients') : undefined}
                          style={{ backgroundColor: T.bgLight, border: `1px solid ${clickable && !isEditing ? T.primaryBorder : T.border}`, borderRadius: 12, padding: '14px 13px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, cursor: clickable && !isEditing ? 'pointer' : 'default', transition: 'all 0.2s', position: 'relative' }}
                          onMouseEnter={e => { if (clickable && !isEditing) { e.currentTarget.style.backgroundColor = T.primaryBg; e.currentTarget.style.borderColor = T.primary; }}}
                          onMouseLeave={e => { if (clickable && !isEditing) { e.currentTarget.style.backgroundColor = T.bgLight; e.currentTarget.style.borderColor = T.primaryBorder; }}}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
                          {isEditing && !clickable
                            ? <input name={name} value={value || ''} onChange={e => setEditData({ ...editData, [e.target.name]: e.target.value })}
                                style={{ fontSize: 18, fontWeight: 700, textAlign: 'center', border: 'none', borderBottom: `1px solid ${T.border}`, outline: 'none', backgroundColor: 'transparent', color: T.text, fontFamily: 'inherit', width: '100%' }} />
                            : <div style={{ fontSize: 18, fontWeight: 700, color: T.text }}>{value}</div>
                          }
                          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', color: T.textMuted }}>{label}</div>
                          {clickable && !isEditing && (
                            <div style={{ position: 'absolute', top: 8, right: 8, opacity: 0.5 }}><ChevronRight size={11} color={T.primary} /></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
                    {[
                      [{ label: 'Department', name: 'department', value: (isEditing ? editData : selected).department }, { label: isAgent ? 'Region' : 'Clearance Level', name: isAgent ? 'region' : 'clearanceLevel', value: (isEditing ? editData : selected)[isAgent ? 'region' : 'clearanceLevel'] }],
                      [{ label: 'Qualification', name: 'qualification', value: (isEditing ? editData : selected).qualification }, { label: 'Experience', name: 'experience', value: (isEditing ? editData : selected).experience }],
                      [{ label: 'Gender', name: 'gender', value: (isEditing ? editData : selected).gender, options: ['Male', 'Female', 'Other'] }, { label: 'Join Date', name: 'joinDate', value: (isEditing ? editData : selected).joinDate }],
                    ].map((row, ri) => (
                      <div key={ri} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: ri < 2 ? `1px solid ${T.border}` : 'none' }}>
                        {row.map((f, fi) => (
                          <div key={f.name} style={{ padding: '13px 16px', borderRight: fi === 0 ? `1px solid ${T.border}` : 'none' }}>
                            <Field label={f.label} name={f.name} value={f.value} options={f.options} isEditing={isEditing} editData={editData} setEditData={setEditData} />
                          </div>
                        ))}
                      </div>
                    ))}
                    {['email', 'phone', 'address'].map(field => (
                      <div key={field} style={{ padding: '13px 16px', borderTop: `1px solid ${T.border}` }}>
                        <Field label={field.charAt(0).toUpperCase() + field.slice(1)} name={field} value={(isEditing ? editData : selected)[field]} isEditing={isEditing} editData={editData} setEditData={setEditData} />
                      </div>
                    ))}
                  </div>
                  {isAgent && (
                    <div style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '13px 16px', marginBottom: 14, display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                      <Lock size={15} color={T.warning} style={{ flexShrink: 0, marginTop: 1 }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 3 }}>Agent Permissions</div>
                        <div style={{ fontSize: 12, color: T.textSub, lineHeight: 1.5 }}>View & submit client applications. Approval restricted to <strong>Checker</strong> roles only.</div>
                      </div>
                    </div>
                  )}
                  <div style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em', color: T.text }}>Account Status</span>
                        <span style={{ padding: '2px 8px', borderRadius: 5, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em', backgroundColor: statusColor(statuses[selected.id] || selected.status).bg, color: statusColor(statuses[selected.id] || selected.status).color, border: `1px solid ${statusColor(statuses[selected.id] || selected.status).border}` }}>
                          {statuses[selected.id] || selected.status}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: T.textSub }}>Staff System Access Control</div>
                    </div>
                    <div onClick={() => setStatuses(prev => { const cur = prev[selected.id] || selected.status; const next = cur === 'Active' ? 'Blocked' : 'Active'; return { ...prev, [selected.id]: next }; })}
                      style={{ width: 44, height: 24, borderRadius: 12, cursor: 'pointer', position: 'relative', transition: 'background 0.3s', backgroundColor: (statuses[selected.id] || selected.status) === 'Active' ? T.success : T.borderLight }}>
                      <div style={{ position: 'absolute', top: 3, left: (statuses[selected.id] || selected.status) === 'Active' ? 23 : 3, width: 18, height: 18, borderRadius: '50%', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', transition: 'left 0.3s' }} />
                    </div>
                  </div>
                </div>
              )}
              {(centerTab === 'Clients' || centerTab === 'Audits') && (
                <div style={{ width: '100%', maxWidth: 540, margin: '0 auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: T.text }}>{isAgent ? 'Client Portfolio' : 'Recent Audits'}</div>
                    {isAgent && (
                      <div style={{ fontSize: 12, color: T.textSub }}>
                        {clients.filter(c => c.assignedAgent === agentName).length} clients assigned
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {isAgent ? (
                      clients.filter(c => c.assignedAgent === agentName).map((client, i) => {
                        const sc = statusColor(client.status);
                        const rc = riskColor(client.riskLevel);
                        return (
                          <div key={client.id} onClick={() => { setSelectedClientId(client.id); setCenterTab('Verification Details'); }}
                            style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 11, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = T.primaryBorder; e.currentTarget.style.backgroundColor = T.primaryBg; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.backgroundColor = T.card; }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: client.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: client.color, border: `2px solid ${client.color}`, flexShrink: 0 }}>{client.initials}</div>
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 3 }}>{client.name}</div>
                                <div style={{ fontSize: 11, color: T.textSub }}>{client.type} · {client.financials.initialDeposit}</div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                              <span style={{ padding: '3px 9px', borderRadius: 5, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', ...sc }}>{client.status}</span>
                              <span style={{ padding: '3px 9px', borderRadius: 5, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', ...rc }}>Risk: {client.riskLevel}</span>
                              <ChevronRight size={14} color={T.textMuted} />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      [
                        { name: 'Wire Transfer Batch #8821', value: '$4.2M', status: 'Cleared', since: '2 hrs ago' },
                        { name: 'SWIFT Compliance Check', value: '88 txns', status: 'Flagged', since: '1 day ago' },
                        { name: 'AML Screening — LATAM', value: '312 records', status: 'Cleared', since: '2 days ago' },
                        { name: 'Counterparty Risk Review', value: '22 entities', status: 'Cleared', since: '3 days ago' },
                      ].map((item, i) => (
                        <div key={i} style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 11, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 3 }}>{item.name}</div>
                            <div style={{ fontSize: 11, color: T.textSub }}>{item.since} • {item.value}</div>
                          </div>
                          <span style={{ padding: '4px 11px', borderRadius: 7, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', ...statusColor(item.status === 'Cleared' ? 'Active' : item.status === 'Flagged' ? 'Flagged' : 'Pending') }}>{item.status}</span>
                        </div>
                      ))
                    )}
                    {isAgent && clients.filter(c => c.assignedAgent === agentName).length === 0 && (
                      <div style={{ textAlign: 'center', padding: '40px 0', color: T.textMuted }}>
                        <UsersIcon size={32} opacity={0.3} style={{ marginBottom: 10, display: 'block', margin: '0 auto 10px' }} />
                        <div style={{ fontSize: 14, fontWeight: 500 }}>No clients assigned to {selected?.name}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {(centerTab === 'Performance' || centerTab === 'Compliance') && (
                <div style={{ width: '100%', maxWidth: 540, margin: '0 auto' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 18 }}>{isAgent ? 'Performance Metrics' : 'Compliance Overview'}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13, marginBottom: 22 }}>
                    {(isAgent ? [{ label: 'YTD Revenue', value: selected.revenue, icon: <TrendingUp size={18} />, color: T.success }, { label: 'Client Retention', value: '96%', icon: <Star size={18} />, color: T.primary }] :
                      [{ label: 'Audit Accuracy', value: selected.accuracy, icon: <Target size={18} />, color: T.success }, { label: 'Cases Cleared', value: `${selected.audits}`, icon: <CheckCircle size={18} />, color: T.primary }]).map((m, i) => (
                      <div key={i} style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: m.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color }}>{m.icon}</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: T.text }}>{m.value}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', color: T.textMuted }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {(isAgent ? [{ title: 'Q3 Portfolio Review completed', date: '3 days ago' }, { title: 'New client onboarded — Delacroix Foundation', date: '1 week ago' }, { title: 'Annual KYC renewal — 12 clients', date: '2 weeks ago' }] :
                      [{ title: 'SWIFT batch #8821 cleared', date: '2 hours ago' }, { title: 'AML flag escalated — Case #CR-441', date: '1 day ago' }, { title: 'Quarterly compliance report submitted', date: '1 week ago' }]).map((a, i) => (
                      <div key={i} style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '12px 15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{a.title}</div>
                        <div style={{ fontSize: 12, color: T.textSub, whiteSpace: 'nowrap', marginLeft: 14 }}>{a.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {centerTab === 'Reports' && (
                <div style={{ width: '100%', maxWidth: 540, margin: '0 auto' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 18 }}>Documents & Reports</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {['Annual Performance Summary 2023', 'Q3 Client Portfolio Report', 'KYC Compliance Certificate', 'Risk Assessment Review'].map((doc, i) => (
                      <div key={i} style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '13px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: T.primaryBg, border: `1px solid ${T.primaryBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileText size={15} color={T.primary} />
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{doc}.pdf</div>
                        </div>
                        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 13px', border: `1px solid ${T.border}`, borderRadius: 7, background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: T.textSub, fontFamily: 'inherit' }}>
                          <Download size={12} /> Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: T.textMuted }}>
            <Search size={40} opacity={0.2} />
            <div style={{ fontSize: 15, fontWeight: 600 }}>Select a {isAgent ? 'agent' : 'checker'}</div>
          </div>
        )}
      </div>

      {/* ── COL 3: RIGHT — Client Verification Panel ── */}
      <div style={{ width: 400, flexShrink: 0, borderLeft: `1px solid ${T.border}`, backgroundColor: T.card, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            {[
              { label: 'TOTAL CLIENTS', value: clients.length, icon: <UsersIcon size={16} />, color: T.primary },
              { label: 'PENDING KYC', value: pendingClients, icon: <Clock size={16} />, color: T.warning },
              { label: 'APPROVED', value: approvedClients, icon: <CheckCircle size={16} />, color: T.success },
              { label: 'STAFF ACTIVE', value: activeCount, icon: <Shield size={16} />, color: T.purple },
            ].map(s => (
              <div key={s.label} style={{ backgroundColor: T.bgLight, border: `1px solid ${T.border}`, borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 11 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: s.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', color: T.textMuted, marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: T.text }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 13px', backgroundColor: T.bgLight, border: `1px solid ${T.border}`, borderRadius: 9, marginBottom: 10 }}>
            <Search size={14} color={T.textMuted} />
            <input type="text" placeholder="Search clients..." value={clientSearch} onChange={e => setClientSearch(e.target.value)}
              style={{ flex: 1, fontSize: 13, background: 'transparent', border: 'none', outline: 'none', color: T.text, fontFamily: 'inherit' }} />
            {clientSearch && <button onClick={() => setClientSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textMuted, padding: 0, display: 'flex' }}><X size={13} /></button>}
          </div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 11 }}>
            {STATUS_FILTERS.map(filter => (
              <button key={filter} onClick={() => setClientStatusFilter(filter)} style={filterPillStyle(filter)}>
                {filter === 'Pending' && <Clock size={9} />}{filter === 'Approved' && <Check size={9} />}{filter === 'Rejected' && <XCircle size={9} />}{filter === 'All' && <Filter size={9} />}
                {filter}
                <span style={{ padding: '1px 5px', borderRadius: 9, fontSize: 9, fontWeight: 700, backgroundColor: clientStatusFilter === filter ? 'rgba(255,255,255,0.2)' : T.bgLight, color: clientStatusFilter === filter ? 'inherit' : T.textMuted }}>
                  {filterCounts[filter]}
                </span>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Client Verifications</div>
                {isAgent && agentClientFilter && selected && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '2px 8px', backgroundColor: T.primaryBg, border: `1px solid ${T.primaryBorder}`, borderRadius: 20 }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: selected.color + '30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: selected.color }}>{selected.initials}</div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: T.primary }}>{selected.name.split(' ')[0]}'s clients</span>
                    <button onClick={() => { setAgentClientFilter(false); setClientStatusFilter('All'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.primary, padding: 0, display: 'flex' }}><X size={10} /></button>
                  </div>
                )}
              </div>
              <div style={{ fontSize: 11, color: T.textSub }}>
                {filteredClients.length} of {baseClients.length} · {pendingClients} pending
              </div>
            </div>
            {!isAgent ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', backgroundColor: T.successBg, borderRadius: 7, border: `1px solid ${T.successBorder}` }}>
                <Shield size={11} color={T.success} />
                <span style={{ fontSize: 10, fontWeight: 600, color: T.success }}>Checker Access</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', backgroundColor: T.warningBg, borderRadius: 7, border: `1px solid ${T.warningBorder}` }}>
                <Lock size={11} color={T.warning} />
                <span style={{ fontSize: 10, fontWeight: 600, color: T.warning }}>View Only</span>
              </div>
            )}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 16px' }}>
          {filteredClients.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: 10, color: T.textMuted }}>
              <Filter size={28} opacity={0.3} />
              <div style={{ fontSize: 13, fontWeight: 600 }}>No clients match</div>
              <button onClick={() => { setClientStatusFilter('All'); setClientSearch(''); setAgentClientFilter(false); }}
                style={{ fontSize: 12, color: T.primary, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}>Clear filters</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredClients.map(client => {
                const sc = statusColor(client.status);
                const rc = riskColor(client.riskLevel);
                const isSelected = selectedClientId === client.id;
                const canQuickAct = !isAgent && client.status === 'Pending';
                return (
                  <div key={client.id}
                    onClick={() => { setSelectedClientId(client.id); setCenterTab('Verification Details'); }}
                    style={{ padding: '13px 14px', borderRadius: 10, border: `1px solid ${isSelected ? T.primaryBorder : T.border}`, backgroundColor: isSelected ? T.primaryBg : T.bgLight, cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 9 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: client.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: client.color, border: `2px solid ${client.color}`, flexShrink: 0 }}>{client.initials}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 2 }}>{client.name}</div>
                          <div style={{ fontSize: 11, color: T.textSub }}>{client.type}</div>
                        </div>
                      </div>
                      <ChevronRight size={14} color={T.textMuted} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 5, fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em', backgroundColor: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>{client.status}</span>
                      <span style={{ padding: '2px 8px', borderRadius: 5, fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em', backgroundColor: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>Risk: {client.riskLevel}</span>
                      <span style={{ fontSize: 10, color: T.textMuted, marginLeft: 'auto' }}>Agent: {client.assignedAgent.split(' ')[0]}</span>
                    </div>
                    <div style={{ marginTop: 9, paddingTop: 9, borderTop: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <DollarSign size={11} color={T.textMuted} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{client.financials.initialDeposit}</span>
                        <span style={{ fontSize: 10, color: T.textSub }}>initial</span>
                      </div>
                      <div style={{ fontSize: 10, color: T.textMuted }}>{client.submittedDate}</div>
                    </div>
                    {canQuickAct && (
                      <div style={{ display: 'flex', gap: 7, marginTop: 9, paddingTop: 9, borderTop: `1px solid ${T.border}` }}>
                        <button onClick={e => { e.stopPropagation(); handleClientApprove(client.id); }}
                          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px 0', backgroundColor: T.successBg, border: `1px solid ${T.successBorder}`, borderRadius: 7, cursor: 'pointer', fontSize: 11, fontWeight: 600, color: T.success, fontFamily: 'inherit' }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = T.success; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = T.success; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = T.successBg; e.currentTarget.style.color = T.success; e.currentTarget.style.borderColor = T.successBorder; }}>
                          <Check size={11} /> Approve
                        </button>
                        <button onClick={e => { e.stopPropagation(); handleClientReject(client.id); }}
                          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px 0', backgroundColor: T.dangerBg, border: `1px solid ${T.dangerBorder}`, borderRadius: 7, cursor: 'pointer', fontSize: 11, fontWeight: 600, color: T.danger, fontFamily: 'inherit' }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = T.danger; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = T.danger; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = T.dangerBg; e.currentTarget.style.color = T.danger; e.currentTarget.style.borderColor = T.dangerBorder; }}>
                          <XCircle size={11} /> Reject
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