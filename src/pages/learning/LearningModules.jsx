import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap, Activity, Triangle, Calculator, Hexagon,
  CheckCircle, Lock, ChevronRight, PlayCircle
} from "lucide-react";
import { useTheme } from '../../context/ThemeContext';

const MODULES = [
  {
    id: 1,
    title: "Electrophysiology of Heart",
    desc: "Key concepts, ECG components, and waveform diagrams.",
    Icon: Zap,
    chapter: "Chapter 1",
    status: "completed"
  },
  {
    id: 2,
    title: "ECG Components & Paper",
    desc: "Sensitivity, paper speed, and grid calculations.",
    Icon: Activity,
    chapter: "Chapter 2",
    status: "completed"
  },
  {
    id: 3,
    title: "Leads & Axis Determination",
    desc: "Lead placement, Einthoven's law, and quadrant method.",
    Icon: Triangle,
    chapter: "Chapter 3",
    status: "in-progress"
  },
  {
    id: 4,
    title: "Heart Rate Calculation",
    desc: "R-R interval, 300-rule, and rhythm analysis.",
    Icon: Calculator,
    chapter: "Chapter 4",
    status: "locked"
  },
  {
    id: 5,
    title: "Cardiac Vector Theory",
    desc: "Dot product, central equations, and triangle geometry.",
    Icon: Hexagon,
    chapter: "Chapter 5",
    status: "locked"
  },
];

const ModuleRow = ({ mod }) => {
  const navigate = useNavigate();
  const { Icon, status } = mod;
  const isLocked = status === "not-started" || status === "locked";
  const isDone = status === "completed";
  const isActive = status === "in-progress";

  return (
    <div
      className={`ls-card bg-white dark:bg-gray-800 rounded-2xl p-4 border border-[#E2E8F0] dark:border-gray-700 shadow-sm flex items-center gap-3 ls-fade ${isLocked ? "opacity-75" : ""}`}
      style={{ animationDelay: `${0.06 * (mod.id - 1) + 0.1}s`, cursor: 'pointer' }}
      onClick={() => !isLocked && navigate(`/learning/module/${mod.id}`)}
    >
      <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] dark:bg-gray-700 flex items-center justify-center shrink-0">
        <Icon
          size={18}
          className={isLocked ? "text-gray-400" : "text-[#2563EB]"}
          strokeWidth={2}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-[#0F172A] dark:text-white truncate">
            {mod.title}
          </p>
        </div>
        <p className="text-xs text-[#64748B] dark:text-gray-400 truncate mt-0.5">
          {mod.desc}
        </p>
        {isActive && (
          <div className="mt-2 bg-[#E2E8F0] dark:bg-gray-700 h-1 rounded-full overflow-hidden w-20">
            <div className="bg-[#2563EB] h-full rounded-full w-1/2" />
          </div>
        )}
      </div>

      <div className="shrink-0 ml-1">
        {isActive && (
          <div className="bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-800">
            <span className="text-[9px] font-bold text-[#2563EB] dark:text-blue-400 uppercase tracking-tight">IN PROGRESS</span>
          </div>
        )}
        {isLocked && <Lock size={16} className="text-[#94A3B8] dark:text-gray-600" />}
        {isDone && <CheckCircle size={18} className="text-[#10B981]" />}
        {!isLocked && !isDone && !isActive && <ChevronRight size={16} className="text-[#CBD5E1] dark:text-gray-600" />}
      </div>
    </div>
  );
};

export default function LearningModules() {
  const navigate = useNavigate();
  const completedCount = MODULES.filter(m => m.status === 'completed').length;

  return (
    <div className="min-h-screen bg-[#EEF2F7] dark:bg-gray-900 flex justify-center pb-20 font-['Outfit']">
      <style>{`
        .ls-card { transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1); cursor: pointer; }
        .ls-card:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .ls-card:active { transform: scale(0.98); }
        @keyframes lsFadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .ls-fade { opacity: 0; animation: lsFadeUp 0.45s ease forwards; }
      `}</style>

      {/* Main container mimicking phone view but centered for web */}
      <div className="w-full max-w-[430px] pt-12 relative flex flex-col">

        {/* Header */}
        <div className="px-4 pb-4 flex justify-between items-start">
          <div className="ls-fade" style={{ animationDelay: "0ms" }}>
            <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">Learn ECG</h1>
            <p className="text-[12px] text-[#64748B] dark:text-gray-400 mt-0.5">Study ECG concepts step-by-step</p>
          </div>
          <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm cursor-pointer border-2 border-white">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
               </svg>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="px-4 pb-4 overflow-y-auto flex-1">

          {/* Continue Learning Label */}
          <div className="mb-3 px-0.5 ls-fade" style={{ animationDelay: "40ms" }}>
            <p className="text-base font-semibold text-[#0F172A] dark:text-white">Continue Learning</p>
          </div>

          {/* Continue Learning Card */}
          <div className="mb-6 ls-fade" style={{ animationDelay: "80ms" }}>
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-[#E2E8F0] dark:border-gray-700 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 dark:bg-blue-900/40 px-2 py-1 rounded-lg uppercase tracking-wider">
                  Chapter 3
                </span>
                <span className="text-[10px] text-[#94A3B8] font-medium">35 mins left</span>
              </div>
              <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white mb-4 leading-tight">
                ECG Leads & Axis Determination
              </h2>
              <div className="bg-gray-100 dark:bg-gray-700 h-2 rounded-full mb-5 overflow-hidden">
                <div className="bg-[#2563EB] h-full w-1/3 rounded-full" />
              </div>
              <button
                onClick={() => navigate('/learning/module/3')}
                className="bg-[#2563EB] text-white rounded-xl py-2.5 text-[14px] font-bold w-full active:scale-95 transition-all shadow-md shadow-blue-500/20"
              >
                Resume Module
              </button>
            </div>
          </div>

          {/* Module list header */}
          <div className="flex items-center justify-between mb-3 px-0.5 ls-fade" style={{ animationDelay: "100ms" }}>
            <p className="text-base font-semibold text-[#0F172A] dark:text-white">Learning Modules</p>
            <p className="text-[11px] font-bold text-[#64748B] dark:text-gray-400 uppercase tracking-wider">{completedCount}/5 done</p>
          </div>

          {/* Module items list */}
          <div className="flex flex-col gap-3 mb-0 ls-fade" style={{ animationDelay: "140ms" }}>
            {MODULES.map((mod) => (
              <ModuleRow
                key={mod.id}
                mod={mod}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
