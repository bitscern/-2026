
import React, { useState, useRef } from 'react';
import { AnalysisResult, FaceRegion } from '../types';

interface AnalysisReportProps {
  data: AnalysisResult;
  image: string;
  onReset: () => void;
}

const REGION_MAP: Record<FaceRegion, { top: string; left: string; width: string; height: string }> = {
  FOREHEAD: { top: '10%', left: '25%', width: '50%', height: '22%' },
  EYES: { top: '32%', left: '15%', width: '70%', height: '14%' },
  NOSE: { top: '42%', left: '32%', width: '36%', height: '26%' },
  MOUTH: { top: '68%', left: '28%', width: '44%', height: '12%' },
  CHIN: { top: '80%', left: '30%', width: '40%', height: '16%' },
  CHEEK_L: { top: '45%', left: '10%', width: '25%', height: '25%' },
  CHEEK_R: { top: '45%', left: '65%', width: '25%', height: '25%' },
  FULL: { top: '5%', left: '5%', width: '90%', height: '90%' },
};

const REGION_CN: Record<FaceRegion, string> = {
  FOREHEAD: '天庭/额',
  EYES: '双目/眼',
  NOSE: '鼻/准头',
  MOUTH: '口/唇',
  CHIN: '地阁/颌',
  CHEEK_L: '左颧/脸',
  CHEEK_R: '右颧/脸',
  FULL: '法相全貌',
};

const AnalysisReport: React.FC<AnalysisReportProps> = ({ data, image, onReset }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeRegion, setActiveRegion] = useState<FaceRegion | null>(null);
  const [showPoster, setShowPoster] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyPoem = () => {
    const text = `【相心灵鉴】\n${data.masterInsight.poem}\n「${data.masterInsight.summary}」\n灵鉴评分：${data.score}\n格局：${data.fiveElement}形格`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-24 relative">
      
      {/* 1. 宗师判词 */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-ink-900 border border-bronze/30 p-10 shadow-2xl group">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
           <div className="w-32 h-32 border-8 border-bronze rounded-full"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
           <div className="flex items-center gap-4">
             <div className="px-4 py-1 bg-cinnabar/20 border border-cinnabar/30 rounded-full text-[10px] text-cinnabar font-bold tracking-[0.4em]">
               火山方舟 · 深度灵鉴判词
             </div>
             <button 
               onClick={copyPoem}
               className="p-2 hover:bg-white/5 rounded-full transition-colors text-bronze/60 hover:text-bronze"
             >
               {copied ? (
                 <span className="text-[9px] font-bold">已录入剪贴板</span>
               ) : (
                 <div className="flex items-center gap-1">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                   <span className="text-[10px]">复制判词</span>
                 </div>
               )}
             </button>
           </div>
           
           <p className="text-3xl md:text-5xl font-bold text-white serif-font leading-tight tracking-wider transition-all group-hover:scale-[1.01]">
             {data.masterInsight.poem}
           </p>
           <div className="w-12 h-[1px] bg-bronze/40"></div>
           <p className="text-bronze text-lg italic serif-font">
             「{data.masterInsight.summary}」
           </p>
        </div>
      </div>

      {/* 2. 视觉观测 HUD 系统 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-6 relative">
          <div className="sticky top-24 w-full aspect-[3/4] rounded-2xl overflow-hidden border border-bronze/20 shadow-2xl bg-black">
            <img src={image} alt="法相" className="w-full h-full object-cover grayscale-[0.3] opacity-80" />
            
            {/* 增强型网格 */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <svg className="w-full h-full stroke-bronze/40 fill-none" viewBox="0 0 100 133">
                <defs>
                  <pattern id="mesh" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" strokeWidth="0.1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mesh)" />
                <line x1="0" y1="0" x2="100" y2="133" strokeWidth="0.05" />
                <line x1="100" y1="0" x2="0" y2="133" strokeWidth="0.05" />
                <circle cx="50" cy="66.5" r="30" strokeWidth="0.1" strokeDasharray="1 1" />
                {/* 模拟扫描线 */}
                <line x1="0" y1="0" x2="100" y2="0" strokeWidth="0.5" stroke="currentColor" className="animate-[scan_6s_linear_infinite]" />
              </svg>
            </div>

            {/* 精准定位 HUD */}
            {activeRegion && (
              <div 
                className="absolute border border-white/60 shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-500 ease-out z-20"
                style={{ ...REGION_MAP[activeRegion], borderRadius: '2px' }}
              >
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-bronze"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-bronze"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-bronze"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-bronze"></div>
                
                <div className="absolute top-0 right-0 -translate-y-full flex flex-col items-end">
                  <span className="bg-bronze text-black text-[9px] px-2 py-0.5 font-bold tracking-widest mb-1 shadow-lg">
                    正在参详：{REGION_CN[activeRegion]}
                  </span>
                  <div className="w-[1px] h-4 bg-bronze/60"></div>
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-8 h-8 rounded-full border border-bronze/40 flex items-center justify-center bg-black/50">
                    <span className="text-bronze text-[10px] font-bold">命</span>
                 </div>
                 <span className="text-white text-2xl font-black serif-font tracking-widest">{data.fiveElement}形格局</span>
               </div>
               <div className="flex items-center justify-between">
                 <div className="text-[10px] text-slate-400 tracking-[0.2em]">灵鉴协议：相心 2.0 版本</div>
                 <div className="text-bronze text-sm font-bold tracking-widest">灵鉴评分 {data.score}</div>
               </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-6 space-y-6">
          <div className="glass-panel p-8 rounded-3xl border-white/5 relative overflow-hidden">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-xs font-black text-bronze tracking-[0.4em] uppercase flex items-center gap-3">
                  <span className="w-6 h-[2px] bg-bronze/30"></span> 灵鉴实录
                </h3>
                <span className="text-[10px] text-slate-600 tracking-widest">交互式追踪开启</span>
             </div>
             
             <div className="space-y-4">
                {data.observations.map((obs, i) => (
                  <div 
                    key={i} 
                    className={`group p-5 rounded-xl border transition-all duration-500 cursor-crosshair ${activeRegion === obs.region ? 'border-bronze bg-bronze/[0.03] translate-x-2' : 'border-white/5 hover:border-white/10'}`}
                    onMouseEnter={() => setActiveRegion(obs.region)}
                    onMouseLeave={() => setActiveRegion(null)}
                  >
                    <div className="flex justify-between items-center mb-3">
                       <h4 className={`font-bold serif-font text-lg transition-colors ${activeRegion === obs.region ? 'text-bronze' : 'text-slate-100'}`}>
                         {obs.feature}
                       </h4>
                       <div className="px-2 py-0.5 bg-black/40 border border-white/5 rounded text-[9px] text-slate-500">
                         {REGION_CN[obs.region]}
                       </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[12px] text-slate-400 leading-relaxed">
                        <span className="text-bronze/80 font-bold mr-2 tracking-tighter">【观测】</span>{obs.evidence}
                      </p>
                      <p className="text-[12px] text-slate-200 leading-relaxed italic border-l border-cinnabar/30 pl-3">
                        {obs.significance}
                      </p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* 3. 深度分析 */}
      <div className="border-t border-white/5 pt-12 space-y-10">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-bronze/[0.02] border border-bronze/10 rounded-3xl p-8 hover:bg-bronze/[0.04] transition-colors">
              <h5 className="text-[11px] text-bronze font-black mb-4 tracking-[0.4em]">五行演化图谱</h5>
              <p className="text-sm text-slate-300 leading-relaxed serif-font tracking-wide">
                 {data.elementAnalysis}
              </p>
           </div>
           <div className="bg-black/40 border border-white/5 rounded-3xl p-8 flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-10 h-[1px] bg-cinnabar/40"></div>
              <p className="text-xl text-slate-200 italic serif-font leading-relaxed px-4">
                “{data.auraMessage}”
              </p>
              <div className="text-[10px] text-cinnabar font-bold tracking-[0.5em]">今日气色：{data.auraStatus}</div>
           </div>
         </div>

         <button 
           onClick={() => setShowAdvanced(!showAdvanced)}
           className="w-full py-5 text-[10px] text-slate-500 hover:text-bronze tracking-[0.6em] transition-all border border-white/5 rounded-2xl flex items-center justify-center gap-3 bg-white/[0.01]"
         >
           {showAdvanced ? '封存底层协议' : '展开宗师级底层灵鉴日志'}
           <span className={`transition-transform duration-500 ${showAdvanced ? 'rotate-180' : ''}`}>▼</span>
         </button>
         
         {showAdvanced && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-700">
              {[
                { label: '骨相解构解析', val: data.advancedLog.boneStructure, color: 'bronze' },
                { label: '精气神实时监控', val: data.advancedLog.spiritAnalysis, color: 'bronze' },
                { label: '心性风险预警', val: data.advancedLog.potentialRisks, color: 'cinnabar' }
              ].map((item, idx) => (
                <div key={idx} className="bg-ink-900/60 p-6 rounded-2xl border border-white/5 hover:border-bronze/30 transition-all group">
                   <div className={`text-[10px] font-black mb-4 tracking-widest flex items-center gap-2 ${item.color === 'bronze' ? 'text-bronze' : 'text-cinnabar'}`}>
                      <div className={`w-1 h-1 rounded-full ${item.color === 'bronze' ? 'bg-bronze' : 'bg-cinnabar'} animate-pulse`}></div>
                      {item.label}
                   </div>
                   <p className="text-[11px] text-slate-500 leading-relaxed group-hover:text-slate-300 transition-colors">{item.val}</p>
                </div>
              ))}
           </div>
         )}
      </div>

      {/* 4. 浮动动作条 */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
         <button 
           onClick={onReset}
           className="px-10 py-4 bg-ink-950 border border-white/10 text-slate-400 text-[11px] font-black tracking-[0.4em] hover:bg-white/5 transition-all shadow-2xl backdrop-blur-md rounded-full"
         >
           重置
         </button>
         <button 
           onClick={() => setShowPoster(true)}
           className="px-12 py-4 bg-bronze text-white text-[11px] font-black tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-[0_10px_40px_rgba(197,160,89,0.3)] rounded-full flex items-center gap-3"
         >
           生成我的灵鉴卡
           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
         </button>
      </div>

      {/* 5. 灵鉴卡海报模态框 */}
      {showPoster && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setShowPoster(false)}></div>
           
           <div className="relative w-full max-w-sm bg-ink-950 border border-bronze/30 shadow-[0_0_80px_rgba(197,160,89,0.2)] rounded-[3rem] overflow-hidden flex flex-col items-center p-10 space-y-8 animate-in zoom-in-95 duration-500">
              <div className="w-full flex justify-between items-center text-bronze text-[10px] font-bold tracking-[0.6em]">
                <span>相心灵鉴系统</span>
                <span>火山方舟</span>
              </div>

              <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden border border-bronze/20 p-2 relative group bg-ink-900">
                <img src={image} className="w-full h-full object-cover rounded-2xl grayscale-[0.2]" alt="分享头像" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 bg-bronze text-black text-[9px] font-black px-3 py-1 rounded-sm tracking-widest">
                  灵鉴评分 {data.score}
                </div>
              </div>

              <div className="text-center space-y-6">
                 <h2 className="text-2xl font-bold text-white serif-font leading-relaxed tracking-widest px-4 border-l border-r border-bronze/20">
                   {data.masterInsight.poem.split('，').map((s, i) => (
                     <span key={i} className="block">{s}</span>
                   ))}
                 </h2>
                 <p className="text-bronze text-sm italic serif-font">「{data.masterInsight.summary}」</p>
              </div>

              <div className="w-full pt-8 border-t border-white/5 flex items-center justify-between">
                 <div className="space-y-1">
                    <div className="text-[12px] text-white font-bold tracking-widest">扫码开启你的灵鉴</div>
                    <div className="text-[9px] text-slate-500 tracking-widest uppercase">PhysioLogic AI</div>
                 </div>
                 {/* 模拟二维码 */}
                 <div className="w-14 h-14 bg-white/5 p-1 flex items-center justify-center rounded-lg border border-white/10">
                    <div className="w-full h-full bg-bronze/40 rounded flex items-center justify-center text-[8px] text-black font-bold">二维码</div>
                 </div>
              </div>

              <button 
                onClick={() => setShowPoster(false)}
                className="w-full py-4 text-[11px] text-slate-500 font-bold tracking-widest uppercase border border-white/5 hover:text-white transition-colors mt-4"
              >
                返回报告
              </button>
              
              <p className="text-[10px] text-slate-600 tracking-widest text-center">长按屏幕截图保存此卡片</p>
           </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(133px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AnalysisReport;
