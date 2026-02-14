
import React, { useState } from 'react';
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

const AnalysisReport: React.FC<AnalysisReportProps> = ({ data, image, onReset }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyPoem = () => {
    const text = `【相心灵鉴】\n${data.masterInsight.poem}\n「${data.masterInsight.summary}」\n评分：${data.score}\n格局：${data.fiveElement}形格`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-32 relative px-4">
      
      {/* 1. 宗师判词 */}
      <div className="relative overflow-hidden rounded-[3rem] bg-ink-900 border border-bronze/30 p-8 md:p-16 shadow-2xl text-center">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-bronze/50 to-transparent"></div>
        <div className="flex flex-col items-center space-y-8">
           <div className="px-6 py-1.5 bg-cinnabar/10 border border-cinnabar/20 rounded-full text-[10px] text-cinnabar font-bold tracking-[0.5em] uppercase">
             火山方舟 · 核心灵鉴判词
           </div>
           
           <h2 className={`font-bold text-white serif-font leading-tight tracking-[0.15em] max-w-4xl mx-auto ${data.masterInsight.poem.length > 20 ? 'text-3xl md:text-5xl' : 'text-4xl md:text-6xl'}`}>
             {data.masterInsight.poem}
           </h2>
           
           <div className="w-24 h-[1px] bg-bronze/30"></div>
           
           <p className="text-bronze text-lg md:text-2xl italic serif-font opacity-90 max-w-2xl leading-relaxed">
             「{data.masterInsight.summary}」
           </p>

           <button onClick={copyPoem} className="text-[10px] text-slate-500 hover:text-bronze transition-colors flex items-center gap-2">
             {copied ? '已录入剪贴板' : '复制此判词'}
           </button>
        </div>
      </div>

      {/* 2. 核心分析矩阵 - 移除了观测详情，合并宫位 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* 左侧：法相视觉态势 */}
        <div className="lg:col-span-5 space-y-8">
          <div className="relative w-full aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-bronze/20 bg-black shadow-2xl group">
            <img src={image} alt="法相" className="w-full h-full object-cover grayscale-[0.2] opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
            <div className="absolute bottom-10 left-10 right-10">
               <div className="text-bronze text-[10px] font-bold tracking-[0.3em] mb-2 uppercase">格局判位</div>
               <div className="text-white text-3xl font-black serif-font tracking-widest">{data.fiveElement}形格局</div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[2rem] space-y-4">
             <div className="flex items-center gap-3 text-bronze mb-4">
                <div className="w-1.5 h-1.5 bg-bronze rounded-full"></div>
                <h4 className="text-[11px] font-black tracking-[0.4em] uppercase">气色演化</h4>
             </div>
             <p className="text-2xl text-white serif-font italic">{data.auraStatus}</p>
             <p className="text-sm text-slate-400 leading-relaxed">{data.auraMessage}</p>
          </div>
        </div>

        {/* 右侧：面相十二宫位 */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="space-y-6">
            <h3 className="text-xs font-black text-bronze tracking-[0.4em] mb-4 flex items-center gap-3 uppercase">
              十二宫位深研 <span className="flex-1 h-[1px] bg-bronze/10"></span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.palaces?.map((palace, idx) => (
                <div key={idx} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:border-bronze/30 transition-all group hover:bg-white/[0.04]">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-bronze text-[12px] font-bold tracking-widest">{palace.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${palace.status === '优' ? 'border-cinnabar/40 text-cinnabar bg-cinnabar/5' : 'border-slate-700 text-slate-500'}`}>
                      {palace.status}
                    </span>
                  </div>
                  <p className="text-[13px] text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors">{palace.analysis}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. 深度心性推演 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-ink-900 border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-inner">
           <h4 className="text-bronze text-[11px] font-black tracking-[0.4em] mb-2 uppercase">心性根基深度剖析</h4>
           <div className="text-slate-300 text-lg serif-font leading-loose tracking-wider">
             {data.personalityProfile}
           </div>
           <div className="pt-8 border-t border-white/5">
             <p className="text-[11px] text-cinnabar font-bold tracking-widest mb-4 uppercase">【社交指南 · 避坑手册】</p>
             <p className="text-base text-slate-400 leading-relaxed italic opacity-90">{data.socialGuide}</p>
           </div>
        </div>

        <div className="bg-bronze/[0.03] border border-bronze/10 rounded-[2.5rem] p-10 space-y-8">
           <h4 className="text-bronze text-[11px] font-black tracking-[0.4em] uppercase">职场前程判位</h4>
           <div className="space-y-8">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">天命角色</p>
                <p className="text-2xl text-white font-bold serif-font">{data.workplace.role}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">核心才干</p>
                <div className="flex flex-wrap gap-2">
                  {data.workplace.strengths.map((s, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white/5 text-bronze text-[11px] rounded-md border border-bronze/10">{s}</span>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-white/10">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">进阶策论</p>
                <p className="text-[13px] text-slate-400 leading-relaxed italic">
                  {data.workplace.advice}
                </p>
              </div>
           </div>
        </div>
      </div>

      {/* 4. 修心方案 */}
      <div className="glass-panel rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
           <h4 className="text-bronze text-[11px] font-black tracking-[0.4em] uppercase">修心调息方案</h4>
           <p className="text-slate-500 text-xs tracking-widest">基于五行形格推荐的自我进化路径</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {data.hobbies?.map((hobby, i) => (
            <div key={i} className="px-8 py-3 border border-white/10 rounded-full text-slate-300 text-sm serif-font hover:bg-white/5 transition-colors tracking-widest">
              {hobby}
            </div>
          ))}
        </div>
      </div>

      {/* 5. 底层灵鉴日志 */}
      <div className="space-y-8">
         <button 
           onClick={() => setShowAdvanced(!showAdvanced)}
           className="w-full py-8 border border-white/5 rounded-2xl text-[11px] text-slate-600 hover:text-bronze transition-all tracking-[0.8em] group"
         >
           {showAdvanced ? '封存宗师日志' : '展开宗师级底层灵鉴日志'}
         </button>
         
         {showAdvanced && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in zoom-in-95 duration-700">
              {[
                { title: '骨相解构细节', content: data.advancedLog.boneStructure },
                { title: '精气神监控报告', content: data.advancedLog.spiritAnalysis },
                { title: '性格红线警示', content: data.advancedLog.potentialRisks }
              ].map((item, i) => (
                <div key={i} className="bg-black/40 p-10 rounded-3xl border border-white/5 hover:border-bronze/20 transition-colors">
                  <h5 className="text-[10px] text-bronze font-black mb-6 tracking-[0.3em] uppercase">{item.title}</h5>
                  <p className="text-[13px] text-slate-500 leading-loose">{item.content}</p>
                </div>
              ))}
           </div>
         )}
      </div>

      {/* 底部按钮 */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6">
         <button onClick={onReset} className="px-10 py-4 glass-panel rounded-full text-[11px] text-slate-400 font-bold tracking-[0.4em] hover:text-white transition-all shadow-2xl">
           重置
         </button>
         <button onClick={() => setShowPoster(true)} className="px-14 py-4 bg-bronze text-white rounded-full text-[11px] font-black tracking-[0.5em] hover:scale-105 transition-all shadow-2xl">
           生成灵鉴分享卡
         </button>
      </div>

      {/* 分享海报 */}
      {showPoster && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/98 backdrop-blur-xl" onClick={() => setShowPoster(false)}></div>
           <div className="relative w-full max-w-sm bg-ink-950 border border-bronze/30 p-10 rounded-[3rem] space-y-8 text-center shadow-2xl animate-in zoom-in-95">
              <div className="text-bronze text-[10px] font-bold tracking-[0.5em] uppercase">相心 · 灵鉴分享</div>
              <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-bronze/10 relative">
                <img src={image} className="w-full h-full object-cover grayscale-[0.2]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-6 right-6 text-left">
                   <div className="text-[9px] text-bronze tracking-widest uppercase mb-1">灵鉴格局</div>
                   <div className="text-white text-2xl font-bold serif-font">{data.fiveElement}形格 · {data.score}分</div>
                </div>
              </div>
              <div className="space-y-6">
                 <h2 className="text-xl font-bold text-white serif-font tracking-widest leading-relaxed">
                   {data.masterInsight.poem}
                 </h2>
                 <p className="text-bronze text-sm italic serif-font">「{data.masterInsight.summary}」</p>
              </div>
              <div className="flex justify-between items-center pt-8 border-t border-white/5">
                <div className="text-left">
                  <p className="text-white text-[11px] font-bold">扫码开启镜鉴</p>
                  <p className="text-[8px] text-slate-500 uppercase tracking-widest">PhysioLogic AI Master</p>
                </div>
                <div className="w-12 h-12 bg-bronze/20 rounded-lg border border-bronze/30 flex items-center justify-center text-[7px] text-bronze font-bold tracking-tighter">QR CODE</div>
              </div>
              <button onClick={() => setShowPoster(false)} className="w-full py-2 text-[11px] text-slate-600 font-bold tracking-widest uppercase hover:text-white transition-colors">
                关闭
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisReport;
