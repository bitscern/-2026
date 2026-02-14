
import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisReportProps {
  data: AnalysisResult;
  image: string;
  onReset: () => void;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ data, image, onReset }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      {/* 头部摘要 */}
      <div className="relative glass-panel p-8 rounded-[2rem] overflow-hidden border-bronze/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cinnabar/5 rounded-full -translate-y-12 translate-x-12 blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
          <div className="relative">
            <div className="w-48 h-64 rounded-2xl overflow-hidden border border-bronze/30 shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-500">
              <img src={image} alt="分析照片" className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-500" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-cinnabar text-white w-12 h-32 flex items-center justify-center rounded-sm shadow-xl border border-white/10">
              <span className="vertical-text serif-font text-xl font-bold tracking-[0.2em]">{data.fiveElement}形格局</span>
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bronze/10 border border-bronze/20">
              <span className="w-1.5 h-1.5 bg-bronze rounded-full animate-pulse"></span>
              <span className="text-[10px] text-bronze font-bold tracking-widest uppercase">传统相学古法参详</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white serif-font tracking-tight">
              品相：<span className="text-bronze">{data.score >= 80 ? '上乘' : data.score >= 60 ? '中正' : '有待修持'}</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed font-light italic serif-font">
              “{data.personalityProfile}”
            </p>
          </div>
        </div>
      </div>

      {/* 痣相解析 */}
      <div className="relative p-10 glass-panel rounded-[2.5rem] border-bronze/10 bg-gradient-to-tr from-black to-ink-900">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-2xl font-bold text-bronze serif-font flex items-center gap-4">
              <span className="w-8 h-1 bg-bronze/30"></span>
              痣相吉凶罗盘
              <span className="w-8 h-1 bg-bronze/30"></span>
           </h3>
           <span className="text-[10px] text-slate-500 tracking-[0.3em]">依《神相全编》判定</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.moles && data.moles.length > 0 ? (
            data.moles.map((mole, i) => (
              <div key={i} className="flex gap-4 p-4 bg-white/[0.03] border border-white/5 rounded-xl hover:border-bronze/40 transition-colors group">
                <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full border ${mole.nature === '吉' ? 'border-cinnabar/40 text-cinnabar' : 'border-slate-700 text-slate-400'}`}>
                   <span className="serif-font font-bold text-lg">{mole.nature}</span>
                </div>
                <div>
                   <div className="text-xs text-bronze font-bold mb-1">{mole.position}</div>
                   <p className="text-sm text-slate-300 leading-relaxed italic">{mole.meaning}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-10 text-slate-500 serif-font italic">
              面净无瑕，神清气爽，主一生波澜平缓，福泽自来。
            </div>
          )}
        </div>
      </div>

      {/* 事业罗盘 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-12 glass-panel p-8 rounded-[2rem] border-bronze/10 bg-gradient-to-br from-ink-900 to-ink-800">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-bronze/10 rounded-full flex items-center justify-center text-bronze border border-bronze/20">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                   </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white serif-font">事业乾坤罗盘</h3>
                  <p className="text-[10px] text-bronze tracking-widest font-bold">志向定位与协作箴言</p>
                </div>
              </div>
              <div className="px-6 py-2 bg-bronze/10 border border-bronze/20 rounded-lg text-bronze font-bold serif-font text-lg">
                {data.workplace.role}
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 tracking-widest mb-4">核心长技</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.workplace.strengths.map((s, i) => (
                      <span key={i} className="px-3 py-1.5 bg-ink-950 border border-white/5 rounded-md text-xs text-slate-300">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 tracking-widest mb-4">契合伙伴</h4>
                  <p className="text-sm text-slate-300 leading-relaxed font-light border-l-2 border-bronze/30 pl-4">
                    {data.workplace.compatibility}
                  </p>
                </div>
              </div>
              
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                 <h4 className="text-xs font-bold text-slate-500 tracking-widest mb-4">进阶箴言</h4>
                 <p className="text-sm text-slate-300 leading-relaxed font-light italic">
                    {data.workplace.advice}
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* 结语 */}
      <div className="relative glass-panel p-12 rounded-[3rem] text-center border-bronze/40 bg-gradient-to-b from-ink-900 to-black">
        <div className="mb-6">
          <span className="text-cinnabar text-xs font-bold tracking-[0.4em] serif-font">今日气色 · 灵感签</span>
        </div>
        <h2 className="text-5xl font-bold text-white serif-font mb-4">{data.auraStatus}</h2>
        <p className="text-slate-300 max-w-lg mx-auto leading-relaxed font-light">{data.auraMessage}</p>
        
        <div className="mt-12 flex justify-center">
            <button 
                onClick={onReset}
                className="group relative px-10 py-4 bg-cinnabar text-white font-bold rounded-sm shadow-2xl hover:bg-cinnabar-dark transition-all duration-300"
            >
                <div className="absolute inset-0 border border-white/20 scale-90 group-hover:scale-100 transition-transform"></div>
                <span className="relative z-10 serif-font tracking-widest text-lg">重温初心</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
