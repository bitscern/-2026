
import React, { useState } from 'react';
import { AnalysisResult } from '../types';

interface AnalysisReportProps {
  data: AnalysisResult;
  image: string;
  onReset: () => void;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ data, image, onReset }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      
      {/* 1. 宗师判词 (文学中心) */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-ink-900 border border-bronze/30 p-10 shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <div className="w-32 h-32 border-8 border-bronze rounded-full"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
           <div className="px-4 py-1 bg-cinnabar/20 border border-cinnabar/30 rounded-full text-[10px] text-cinnabar font-bold tracking-[0.4em]">
             火山方舟 · 深度灵鉴判词
           </div>
           <p className="text-3xl md:text-5xl font-bold text-white serif-font leading-tight tracking-wider">
             {data.masterInsight.poem}
           </p>
           <div className="w-12 h-[1px] bg-bronze/40"></div>
           <p className="text-bronze text-lg italic serif-font">
             「{data.masterInsight.summary}」
           </p>
        </div>
      </div>

      {/* 2. 视觉观测证据 (核心深度展示) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5">
          <div className="sticky top-24 w-full aspect-[3/4] rounded-2xl overflow-hidden border border-bronze/20 shadow-2xl">
            <img src={image} alt="法相" className="w-full h-full object-cover grayscale-[0.2]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
               <div className="flex items-center gap-2 mb-2">
                 <span className="text-[10px] text-bronze font-bold tracking-widest px-2 py-0.5 border border-bronze/30 rounded">五行格</span>
                 <span className="text-white text-xl font-bold">{data.fiveElement}形格</span>
               </div>
               <div className="text-[10px] text-slate-400">综合灵鉴深度：{data.score} / 100</div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 space-y-6">
          <div className="glass-panel p-8 rounded-3xl border-white/5">
             <div className="flex justify-between items-end mb-6">
                <h3 className="text-sm font-bold text-bronze tracking-[0.2em] flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-bronze"></span> 宗师实录 · 视觉证据链
                </h3>
                <span className="text-[9px] text-slate-500 italic">基于二阶段视觉分析</span>
             </div>
             
             <div className="space-y-6">
                {data.observations.map((obs, i) => (
                  <div key={i} className="group border-b border-white/5 pb-5 last:border-0">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-white font-bold serif-font text-base">{obs.feature}</span>
                       <div className="flex items-center gap-2">
                          <span className={`text-[8px] px-2 py-0.5 rounded border ${obs.confidence > 0.8 ? 'border-cinnabar/40 text-cinnabar' : 'border-slate-700 text-slate-500'}`}>
                            {obs.confidence > 0.8 ? '高度确信' : '倾向性判断'}
                          </span>
                          <span className="text-[9px] text-bronze opacity-70">置信 {(obs.confidence * 100).toFixed(0)}%</span>
                       </div>
                    </div>
                    {/* 视觉证据突出显示 */}
                    <div className="text-[11px] text-slate-400 bg-black/40 p-3 rounded-lg border-l-2 border-bronze/30 mb-2 leading-relaxed">
                       <span className="text-bronze/60 font-bold mr-2">观测：</span>{obs.evidence}
                    </div>
                    <div className="text-[11px] text-slate-300 leading-relaxed italic">
                       <span className="text-cinnabar/60 font-bold mr-2">批注：</span>{obs.significance}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* 3. 深度详批日志 (折叠区) */}
      <div className="border-t border-white/10 pt-8">
         <div className="bg-bronze/5 border border-bronze/10 rounded-2xl p-6 mb-4">
            <h4 className="text-[10px] text-bronze font-bold mb-3 tracking-[0.3em] uppercase flex items-center gap-2">
               五行运势分层解析
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed serif-font">
               {data.elementAnalysis}
            </p>
         </div>

         <button 
           onClick={() => setShowAdvanced(!showAdvanced)}
           className="w-full py-4 text-[10px] text-slate-500 hover:text-bronze tracking-[0.5em] transition-colors border border-white/5 rounded-xl uppercase flex items-center justify-center gap-2"
         >
           {showAdvanced ? '收起底层分析协议' : '展开大师级底层灵鉴日志'}
           <span className={`transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`}>↓</span>
         </button>
         
         {showAdvanced && (
           <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-500">
              <div className="bg-black/40 p-6 rounded-2xl border border-white/5 hover:border-bronze/20 transition-colors">
                 <div className="text-bronze text-[10px] font-bold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-bronze rounded-full"></span> 骨相解剖深度解析
                 </div>
                 <p className="text-[11px] text-slate-400 leading-relaxed">{data.advancedLog.boneStructure}</p>
              </div>
              <div className="bg-black/40 p-6 rounded-2xl border border-white/5 hover:border-bronze/20 transition-colors">
                 <div className="text-bronze text-[10px] font-bold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-bronze rounded-full"></span> 精气神实时监控
                 </div>
                 <p className="text-[11px] text-slate-400 leading-relaxed">{data.advancedLog.spiritAnalysis}</p>
              </div>
              <div className="bg-black/40 p-6 rounded-2xl border border-white/5 hover:border-cinnabar/20 transition-colors">
                 <div className="text-cinnabar text-[10px] font-bold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-cinnabar rounded-full"></span> 心性风险预警
                 </div>
                 <p className="text-[11px] text-slate-400 leading-relaxed">{data.advancedLog.potentialRisks}</p>
              </div>
           </div>
         )}
      </div>

      {/* 4. 今日箴言 */}
      <div className="pt-10 text-center space-y-10">
         <div className="inline-block px-12 py-10 glass-panel rounded-full border-bronze/20 bg-black shadow-inner relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 bg-cinnabar text-white text-[8px] font-bold px-4 py-1 rounded-full tracking-widest">
              今日气色：{data.auraStatus}
            </div>
            <p className="text-slate-200 text-lg md:text-xl italic serif-font max-w-sm mx-auto leading-relaxed">
              “{data.auraMessage}”
            </p>
         </div>
         
         <div className="flex flex-col items-center gap-4">
            <button 
              onClick={onReset}
              className="px-24 py-5 bg-white text-black font-black text-xs tracking-[0.5em] uppercase hover:bg-bronze hover:text-white transition-all shadow-2xl active:scale-95"
            >
              归宗重鉴
            </button>
            <p className="text-[9px] text-slate-600 tracking-widest uppercase">Powered by Volcengine Ark | Multi-Stage Reasoning</p>
         </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
