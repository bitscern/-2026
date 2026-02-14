
import React, { useState, useRef, useEffect } from 'react';
import { AppView, AnalysisResult } from './types';
import { analyzeFace } from './services/arkService';
import ScannerOverlay from './components/ScannerOverlay';
import AnalysisReport from './components/AnalysisReport';

const SCANNING_STEPS = [
  "正在开启灵鉴镜...",
  "观测天庭、地阁气韵...",
  "拆解五岳格局...",
  "正在辨析精气神...",
  "溯源因果心性...",
  "正在誊写宗师判词..."
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [isScanning, setIsScanning] = useState(false);
  const [scanningStep, setScanningStep] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let interval: any;
    if (isScanning) {
      interval = setInterval(() => {
        setScanningStep(prev => (prev + 1) % SCANNING_STEPS.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const startCamera = async () => {
    setView('scanner');
    setError(null);
    setCapturedImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      setError('镜鉴开启受阻。请确保授权摄像头访问，并确保在安全环境下运行。');
      setView('home');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureAndAnalyze = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    
    setIsScanning(true);
    setError(null);

    try {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('画卷受损');
      
      ctx.drawImage(video, 0, 0);
      const base64Data = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(base64Data);
      
      const result = await analyzeFace(base64Data.split(',')[1]);
      setAnalysisResult(result);
      setView('report');
      stopCamera();
    } catch (err: any) {
      setError(`灵鉴受阻: ${err.message}`);
      video.play().catch(() => {});
    } finally {
      setIsScanning(false);
      setScanningStep(0);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setCapturedImage(base64);
        setIsScanning(true);
        setView('scanner');
        try {
          const result = await analyzeFace(base64.split(',')[1]);
          setAnalysisResult(result);
          setView('report');
        } catch (err: any) {
          setError(err.message || '相片难辨，请确保面部清晰。');
          setView('home');
        } finally {
          setIsScanning(false);
          setScanningStep(0);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex flex-col">
      <header className="fixed top-0 w-full z-50 glass-panel border-b border-white/5 h-20 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setView('home'); stopCamera(); }}>
          <div className="w-10 h-10 bg-cinnabar flex items-center justify-center rotate-45 shadow-lg transition-transform hover:scale-110">
            <span className="text-white font-bold -rotate-45 serif-font">相</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-white serif-font tracking-widest uppercase">相心</h1>
            <p className="text-[9px] text-bronze tracking-[0.2em] opacity-60">灵鉴解析 · 火山方舟引擎</p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
           <button 
            onClick={() => { setView('home'); stopCamera(); }}
            className="text-[11px] text-slate-400 font-bold hover:text-white transition-colors tracking-widest hidden sm:block"
           >
             归宗主页
           </button>
           <button 
            onClick={startCamera}
            className="px-6 py-2 border border-bronze/40 text-bronze text-[11px] font-bold tracking-widest hover:bg-bronze hover:text-white transition-all rounded-sm"
           >
             即刻灵鉴
           </button>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {error && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-md p-4 bg-cinnabar/10 border border-cinnabar/20 text-cinnabar text-[11px] text-center serif-font animate-pulse rounded-md shadow-2xl">
            {error}
          </div>
        )}

        {view === 'home' && (
          <div className="animate-in fade-in duration-1000">
            <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-12 md:py-20">
               <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
                  
                  {/* 顶部标签 */}
                  <div className="inline-block px-4 py-1 border border-bronze/20 bg-bronze/5 rounded-full text-[11px] text-bronze font-bold tracking-[0.3em] mb-12 animate-in slide-in-from-top-4 duration-1000">
                    火山方舟深度灵鉴 · 参详面相玄机
                  </div>

                  {/* 核心标语：竖排错位排版 */}
                  <div className="relative mb-20 group">
                    {/* 背景装饰：中式圆相 Enso */}
                    <div className="absolute inset-0 -m-20 opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity duration-1000">
                      <svg viewBox="0 0 100 100" className="w-full h-full stroke-bronze fill-none scale-150 md:scale-125" strokeWidth="0.2">
                        <circle cx="50" cy="50" r="45" strokeDasharray="1 4" className="animate-[spin_60s_linear_infinite]" />
                        <circle cx="50" cy="50" r="40" strokeDasharray="10 5" className="animate-[spin_40s_linear_infinite_reverse]" />
                      </svg>
                    </div>

                    <div className="flex items-start justify-center gap-8 md:gap-16">
                      {/* 右侧：观其面 */}
                      <div className="vertical-text text-7xl md:text-9xl font-black text-white serif-font tracking-[0.2em] leading-none animate-in slide-in-from-right-8 duration-700">
                        观其<span className="text-bronze">面</span>
                      </div>
                      
                      {/* 左侧：知其心（向下偏移） */}
                      <div className="vertical-text text-7xl md:text-9xl font-black text-white serif-font tracking-[0.2em] leading-none pt-24 md:pt-32 animate-in slide-in-from-left-8 duration-700 delay-300">
                        知其<span className="text-cinnabar">心</span>
                      </div>
                    </div>

                    {/* 装饰性小印章 */}
                    <div className="absolute -right-8 bottom-0 md:-right-16 md:bottom-12 w-8 h-8 md:w-12 md:h-12 bg-cinnabar flex items-center justify-center shadow-lg animate-in zoom-in duration-1000 delay-1000">
                      <span className="text-white text-[10px] md:text-xs font-bold serif-font leading-tight">灵鉴<br/>真传</span>
                    </div>
                  </div>

                  <p className="text-lg md:text-2xl text-slate-400 font-light max-w-xl mx-auto leading-relaxed serif-font px-4 mb-16 animate-in fade-in duration-1000 delay-500">
                    探寻面部纹路下的性格，<br className="md:hidden" />预见潜在的前程格局。
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
                    <button 
                      onClick={startCamera}
                      className="group relative w-full sm:w-auto px-16 py-6 bg-cinnabar text-white text-xl font-bold rounded-sm overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_60px_rgba(150,40,40,0.3)] serif-font tracking-[0.4em]"
                    >
                      <span className="relative z-10">开启镜鉴</span>
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                    <label className="w-full sm:w-auto px-16 py-6 bg-white/5 border border-white/10 text-slate-300 text-xl font-bold rounded-sm hover:bg-white/10 hover:text-white transition-all cursor-pointer serif-font tracking-[0.4em]">
                      上传法相
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
               </div>
            </section>
          </div>
        )}

        {view === 'scanner' && (
          <div className="max-w-xl mx-auto flex flex-col items-center justify-center p-6 space-y-12 animate-in slide-in-from-bottom-10">
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-black shadow-2xl border border-bronze/20">
              {capturedImage ? (
                <img src={capturedImage} className="w-full h-full object-cover grayscale-[0.3]" alt="法相" />
              ) : (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
              )}
              <ScannerOverlay />
              {isScanning && (
                <div className="absolute inset-0 bg-ink-950/95 flex flex-col items-center justify-center space-y-8 text-center px-8">
                   <div className="relative w-24 h-24">
                      <div className="absolute inset-0 border-2 border-bronze/10 rounded-full"></div>
                      <div className="absolute inset-0 border-2 border-bronze border-t-transparent rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] text-bronze font-bold">参详中</div>
                   </div>
                   <div className="space-y-4">
                      <p className="text-white text-2xl font-bold serif-font tracking-[0.4em] animate-pulse">
                        {SCANNING_STEPS[scanningStep]}
                      </p>
                      <p className="text-[10px] text-slate-500 tracking-[0.5em] uppercase">火山方舟 · 深度灵鉴解析引擎</p>
                   </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-4 w-full">
               <button 
                onClick={() => { setView('home'); stopCamera(); setCapturedImage(null); }}
                className="flex-1 py-4 text-slate-500 text-[11px] font-bold tracking-[0.4em] border border-white/5 hover:bg-white/5 transition-colors"
               >
                 放弃本次灵鉴
               </button>
               {!capturedImage && (
                 <button 
                  onClick={captureAndAnalyze}
                  className="flex-[2] py-4 bg-bronze text-white font-bold tracking-[0.6em] text-[11px] hover:bg-bronze-dark transition-colors shadow-2xl"
                 >
                   开始参详
                 </button>
               )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {view === 'report' && analysisResult && capturedImage && (
          <div className="px-6 py-10">
            <AnalysisReport 
              data={analysisResult} 
              image={capturedImage} 
              onReset={() => { setView('home'); setAnalysisResult(null); setCapturedImage(null); }} 
            />
          </div>
        )}
      </main>

      <footer className="py-20 border-t border-white/5 bg-ink-950/40 text-center px-6 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-left space-y-3">
            <div className="text-white font-bold serif-font tracking-widest text-lg">相心</div>
            <p className="text-slate-500 text-[11px] leading-relaxed max-w-sm">
              融合传统文化与尖端大模型。报告仅供学习参考，非医疗或命运之断言。
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="text-slate-600 text-[10px] tracking-widest uppercase">© 2024 相心灵鉴 · 火山方舟引擎</p>
            <div className="flex gap-4 opacity-30">
               <div className="w-4 h-4 bg-bronze rounded-full"></div>
               <div className="w-4 h-4 bg-cinnabar rounded-full"></div>
               <div className="w-4 h-4 bg-ink-950 rounded-full"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
