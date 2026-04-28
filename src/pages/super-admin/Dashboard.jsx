import React, { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  Globe, Users, AlertTriangle, Server,
  ArrowUpRight, ArrowDownRight, Shield, Clock,
  ChevronRight, Filter, TrendingUp, X, CheckCircle2
} from 'lucide-react';

/* ─── Sub-Components ─────────────────────────────────────────── */

const StatCard = React.memo(({ label, icon, badge, badgeUp, onClick, themePrimary, themePrimaryBg, themeTextSub, themeCard, themeBorder, themeShadow }) => (
  <div
    onClick={onClick}
    className="group hover:border-indigo-500/30 transition-all cursor-pointer animate-in fade-in zoom-in-95 duration-500"
    style={{ backgroundColor: themeCard, border: `1px solid ${themeBorder}`, borderRadius: 12, boxShadow: themeShadow, padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}
  >
    <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: themePrimaryBg, color: themePrimary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: 10, fontWeight: 800, color: badgeUp ? '#22c55e' : '#ef4444', backgroundColor: badgeUp ? '#dcfce7' : '#fee2e2', borderRadius: 6, padding: '2px 6px', display: 'flex', alignItems: 'center', gap: 2 }}>
        {badgeUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}{badge}
      </span>
    </div>
    <div style={{ fontSize: 11, fontWeight: 800, color: themeTextSub, letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</div>
  </div>
));
StatCard.displayName = 'StatCard';

const RoleBadge = ({ role }) => {
  const colors = {
    MAKER:   { bg: '#eff6ff', text: '#3b82f6', border: '#bfdbfe' },
    CHECKER: { bg: '#f0fdf4', text: '#22c55e', border: '#bbf7d0' },
    ADMIN:   { bg: '#fef3c7', text: '#d97706', border: '#fde68a' },
  };
  const c = colors[role] || colors.MAKER;
  return (
    <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.08em', padding: '3px 8px', borderRadius: 6, backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      {role}
    </span>
  );
};

const StatusDot = ({ status }) => (
  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
    <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: status === 'Active' ? '#22c55e' : '#94a3b8', display: 'inline-block' }} />
    <span style={{ fontSize: 11, fontWeight: 700, color: status === 'Active' ? '#22c55e' : '#94a3b8' }}>{status}</span>
  </span>
);

const AuditIcon = ({ type }) => {
  const map = {
    role:    { bg: '#eff6ff', color: '#3b82f6', icon: <Shield size={12} /> },
    approve: { bg: '#f0fdf4', color: '#22c55e', icon: <ArrowUpRight size={12} /> },
    alert:   { bg: '#fef2f2', color: '#ef4444', icon: <AlertTriangle size={12} /> },
    draft:   { bg: '#faf5ff', color: '#8b5cf6', icon: <Globe size={12} /> },
    sync:    { bg: '#f0fdf4', color: '#10b981', icon: <Server size={12} /> },
  };
  const s = map[type] || map.draft;
  return (
    <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, backgroundColor: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {s.icon}
    </div>
  );
};

/* ─── User Detail Panel ─────────────────────────────────────── */

const UserDetailPanel = React.memo(({ user, onClose, T }) => {
  const permLabels = {
    create:  'Create records',
    approve: 'Approve transactions',
    export:  'Export data',
    admin:   'Admin access',
  };

  return (
    <div style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 16, boxShadow: T.shadow, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 900, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.06em' }}>User Profile</span>
        <button onClick={onClose} style={{ background: 'transparent', border: `1px solid ${T.border}`, borderRadius: 8, padding: '4px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: T.textSub }}>
          <X size={11} /> Close
        </button>
      </div>

      <div style={{ padding: 20, overflowY: 'auto' }}>
        {/* Avatar + Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, flexShrink: 0 }}>
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: T.text, marginBottom: 3 }}>{user.name}</div>
            <div style={{ fontSize: 11, color: T.textSub, marginBottom: 6 }}>{user.email}</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <RoleBadge role={user.role} />
              <StatusDot status={user.status} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[
            { label: 'Total Actions', value: user.stats.actions, color: T.primary },
            { label: 'Approved', value: user.stats.approved, color: '#22c55e' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, backgroundColor: T.primaryBg, borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 9, fontWeight: 800, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Account Info */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 900, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Account Info</div>
          {[
            { label: 'Department', value: user.dept },
            { label: 'Joined',     value: user.joined },
            { label: 'Last Login', value: user.lastLogin },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${T.border}`, fontSize: 12 }}>
              <span style={{ color: T.textSub }}>{row.label}</span>
              <span style={{ fontWeight: 700, color: T.text }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Permissions */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 900, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Permissions</div>
          {Object.entries(user.permissions).map(([key, val], i, arr) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : 'none', fontSize: 12 }}>
              <span style={{ color: T.textSub }}>{permLabels[key]}</span>
              <div style={{ width: 32, height: 18, borderRadius: 9, backgroundColor: val ? '#22c55e' : T.border, position: 'relative', transition: 'background 0.2s' }}>
                <div style={{ position: 'absolute', top: 3, [val ? 'right' : 'left']: 3, width: 12, height: 12, borderRadius: '50%', backgroundColor: '#fff', transition: 'all 0.2s' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
UserDetailPanel.displayName = 'UserDetailPanel';

/* ─── Main Dashboard ────────────────────────────────────────── */

const SuperAdminDashboard = () => {
  const { theme: T } = useTheme();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);

  const statCards = useMemo(() => [
    { label: 'Total Users',     icon: <Globe size={20} />,         badge: '+18.2%', badgeUp: true,  onClick: () => navigate('/super-admin/users') },
    { label: 'Active Agents',   icon: <Users size={20} />,         badge: '+5.4%',  badgeUp: true  },
    { label: 'System Alerts',   icon: <AlertTriangle size={20} />, badge: '-3.1%',  badgeUp: false },
    { label: 'Platform Uptime', icon: <Server size={20} />,        badge: '+0.01%', badgeUp: true  },
  ], [navigate]);

  const users = useMemo(() => [
    { name: 'Michael Chen',  email: 'michael.chen@bankio.com',  role: 'MAKER',   dept: 'Onboarding',      status: 'Active',   joined: 'Jan 12, 2023', lastLogin: '2 hours ago', stats: { actions: 142, approved: 98  }, permissions: { create: true,  approve: false, export: true,  admin: false } },
    { name: 'Sarah Jenkins', email: 'sarah.jenkins@bankio.com', role: 'CHECKER', dept: 'Compliance',      status: 'Active',   joined: 'Mar 5, 2022',  lastLogin: '30 mins ago', stats: { actions: 310, approved: 287 }, permissions: { create: false, approve: true,  export: true,  admin: false } },
    { name: 'David Smith',   email: 'david.smith@bankio.com',   role: 'MAKER',   dept: 'Risk Assessment', status: 'Inactive', joined: 'Aug 19, 2021', lastLogin: '14 days ago', stats: { actions: 67,  approved: 40  }, permissions: { create: true,  approve: false, export: false, admin: false } },
    { name: 'Emily Davis',   email: 'emily.davis@bankio.com',   role: 'CHECKER', dept: 'Legal',           status: 'Active',   joined: 'Jun 2, 2023',  lastLogin: '1 day ago',   stats: { actions: 220, approved: 198 }, permissions: { create: false, approve: true,  export: true,  admin: false } },
    { name: 'Robert Fox',    email: 'robert.fox@bankio.com',    role: 'ADMIN',   dept: 'IT Operations',   status: 'Active',   joined: 'Feb 28, 2020', lastLogin: '5 mins ago',  stats: { actions: 512, approved: 490 }, permissions: { create: true,  approve: true,  export: true,  admin: true  } },
  ], []);

  const auditLogs = useMemo(() => [
    { type: 'role',    title: 'Role permission updated for Emily Davis',   time: 'Just now',    actor: 'ADMIN SYSTEM'      },
    { type: 'approve', title: 'Approved high-value client onboarding',     time: '10 mins ago', actor: 'SARAH JENKINS'     },
    { type: 'alert',   title: 'Suspicious IP login attempt blocked',       time: '1 hour ago',  actor: 'SECURITY PROTOCOL' },
    { type: 'draft',   title: 'New client draft created for tech startup', time: '3 hours ago', actor: 'MICHAEL CHEN'      },
    { type: 'sync',    title: 'Weekly compliance database sync completed', time: '5 hours ago', actor: 'SYSTEM'            },
  ], []);

  const bars = useMemo(() => [
    { label: 'Mon', h: 42 }, { label: 'Tue', h: 67 }, { label: 'Wed', h: 50 },
    { label: 'Thu', h: 83 }, { label: 'Fri', h: 95 }, { label: 'Sat', h: 38 }, { label: 'Sun', h: 28 },
  ], []);

  const distribution = useMemo(() => [
    { color: '#1b6fde', label: 'Retail Clients',   val: '55%' },
    { color: '#29c36a', label: 'Corporate Clients', val: '30%' },
    { color: '#f2c046', label: 'Active Agents',     val: '15%' },
  ], []);

  const cardProps = { themePrimary: T.primary, themePrimaryBg: T.primaryBg, themeTextSub: T.textSub, themeCard: T.card, themeBorder: T.border, themeShadow: T.shadow };

  const handleRowClick = useCallback((user) => {
    setSelectedUser(prev => prev?.email === user.email ? null : user);
  }, []);

  const handleClosePanel = useCallback(() => setSelectedUser(null), []);

  return (
    <div className="flex flex-col gap-6 font-['DM_Sans',_sans-serif] antialiased">

      {/* Heading */}
      <div className="animate-in fade-in slide-in-from-left duration-700">
        <h2 className="text-xl sm:text-2xl font-black mb-1" style={{ color: T.text }}>Executive Summary</h2>
        <p className="text-xs sm:text-sm font-medium" style={{ color: T.textSub }}>Real-time overview of platform activity and system health.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => <StatCard key={i} {...card} {...cardProps} />)}
      </div>

      {/* User Table + Audit Log */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Table */}
        <div
          className={`animate-in fade-in slide-in-from-bottom duration-700 ${selectedUser ? 'xl:col-span-2' : 'xl:col-span-2'}`}
          style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 16, boxShadow: T.shadow, overflow: 'hidden' }}
        >
          {/* Table Header */}
          <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={16} color={T.primary} />
              <span style={{ fontSize: 13, fontWeight: 900, color: T.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>User & Role Management</span>
            </div>
            <button style={{ fontSize: 10, fontWeight: 800, color: T.textSub, border: `1px solid ${T.border}`, borderRadius: 8, padding: '5px 12px', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              <Filter size={11} /> Role: All
            </button>
          </div>

          {/* Hint */}
          {!selectedUser && (
            <div style={{ padding: '8px 24px', backgroundColor: T.primaryBg, borderBottom: `1px solid ${T.border}` }}>
              <span style={{ fontSize: 10, color: T.primary, fontWeight: 700 }}>💡 Click any row to view full user details</span>
            </div>
          )}

          {/* Table Body */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                  {['User', 'Role', 'Department', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 24px', textAlign: 'left', fontSize: 9, fontWeight: 900, color: T.textSub, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                  <th style={{ padding: '10px 24px', width: 40 }} />
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => {
                  const isSelected = selectedUser?.email === u.email;
                  return (
                    <tr
                      key={i}
                      onClick={() => handleRowClick(u)}
                      style={{
                        borderBottom: i < users.length - 1 ? `1px solid ${T.border}` : 'none',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                        backgroundColor: isSelected ? T.primaryBg : 'transparent',
                        borderLeft: isSelected ? `3px solid ${T.primary}` : '3px solid transparent',
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = T.primaryBg + '55'; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <td style={{ padding: '14px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, flexShrink: 0 }}>
                            {u.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 800, color: T.text }}>{u.name}</div>
                            <div style={{ fontSize: 10, color: T.textSub }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 24px' }}><RoleBadge role={u.role} /></td>
                      <td style={{ padding: '14px 24px', fontSize: 12, fontWeight: 600, color: T.textSub }}>{u.dept}</td>
                      <td style={{ padding: '14px 24px' }}><StatusDot status={u.status} /></td>
                      <td style={{ padding: '14px 24px' }}>
                        <ChevronRight size={14} color={isSelected ? T.primary : T.textSub} style={{ transform: isSelected ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary Row */}
          <div style={{ padding: '12px 24px', borderTop: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 24 }}>
            {[
              { label: 'Total Users', value: users.length,                                     color: T.primary  },
              { label: 'Active',      value: users.filter(u => u.status === 'Active').length,   color: '#22c55e'  },
              { label: 'Inactive',    value: users.filter(u => u.status === 'Inactive').length, color: '#94a3b8'  },
              { label: 'Makers',      value: users.filter(u => u.role === 'MAKER').length,      color: '#3b82f6'  },
              { label: 'Checkers',    value: users.filter(u => u.role === 'CHECKER').length,    color: '#22c55e'  },
              { label: 'Admins',      value: users.filter(u => u.role === 'ADMIN').length,      color: '#d97706'  },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ fontSize: 15, fontWeight: 900, color: item.color }}>{item.value}</span>
                <span style={{ fontSize: 9, fontWeight: 800, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conditionally show Detail Panel OR Audit Log */}
        {selectedUser ? (
          <UserDetailPanel user={selectedUser} onClose={handleClosePanel} T={T} />
        ) : (
          <div className="animate-in fade-in slide-in-from-right duration-700"
            style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 16, boxShadow: T.shadow, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={16} color={T.primary} />
              <span style={{ fontSize: 13, fontWeight: 900, color: T.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Audit Log</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
              {auditLogs.map((log, i) => (
                <div key={i}
                  style={{ display: 'flex', gap: 12, padding: '14px 20px', borderBottom: i < auditLogs.length - 1 ? `1px solid ${T.border}` : 'none', alignItems: 'flex-start', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = T.primaryBg + '44'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <AuditIcon type={log.type} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: T.text, lineHeight: 1.4, margin: 0 }}>{log.title}</p>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center' }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{log.time}</span>
                      <span style={{ fontSize: 9, color: T.border }}>·</span>
                      <span style={{ fontSize: 9, fontWeight: 800, color: T.primary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{log.actor}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Row 3: Charts (unchanged) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 16, boxShadow: T.shadow, padding: 24 }}>
          <h3 style={{ fontSize: 13, fontWeight: 900, color: T.text, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={16} color={T.primary} /> Daily Transaction Volume
          </h3>
          <div style={{ height: 192, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, padding: '0 16px' }}>
            {bars.map((bar, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', maxWidth: 32, backgroundColor: T.primary, borderRadius: '6px 6px 0 0', height: `${bar.h}%`, opacity: 0.85, transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0.85}
                />
                <span style={{ fontSize: 10, fontWeight: 900, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart */}
        <div style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 16, boxShadow: T.shadow, padding: 24, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: 160, height: 160, borderRadius: '50%', flexShrink: 0, background: 'conic-gradient(#1b6fde 0% 55%, #29c36a 55% 85%, #f2c046 85% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 112, height: 112, borderRadius: '50%', backgroundColor: T.card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: T.text, lineHeight: 1.2 }}>2.8k</span>
              <span style={{ fontSize: 8, fontWeight: 900, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Total Users</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {distribution.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: item.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.05em', width: 120 }}>{item.label}</span>
                <span style={{ fontSize: 12, fontWeight: 900, color: T.text }}>{item.val}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 14, display: 'flex', gap: 20 }}>
              {[{ label: 'Retail', value: '1,540', color: '#1b6fde' }, { label: 'Corporate', value: '840', color: '#29c36a' }, { label: 'Agents', value: '420', color: '#f2c046' }].map((item, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 900, color: item.color }}>{item.value}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SuperAdminDashboard;