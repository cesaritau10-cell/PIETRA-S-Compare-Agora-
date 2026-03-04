import React, { useState } from 'react';
import { Video, Upload, Sparkles, Loader2, Play, AlertCircle } from 'lucide-react';
import { generateVeoVideo } from '../services/geminiService';
import { cn } from '../lib/utils';

export const VeoPromo: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Uma animação cinematográfica de uma casa moderna com luzes de fibra ótica brilhando, simbolizando internet ultra veloz.');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    
    // Check for API key selection if needed
    if (typeof (window as any).aistudio?.hasSelectedApiKey === 'function') {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
        // Proceeding after openSelectKey as per guidelines
      }
    }

    setIsGenerating(true);
    setError(null);
    try {
      const url = await generateVeoVideo(prompt, image || undefined);
      if (url) {
        setVideoUrl(url);
      } else {
        setError('Não foi possível gerar o vídeo. Verifique sua chave de API Veo.');
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('entity was not found')) {
        setError('Erro de chave de API. Por favor, selecione uma chave válida.');
        if (typeof (window as any).aistudio?.openSelectKey === 'function') {
          await (window as any).aistudio.openSelectKey();
        }
      } else {
        setError('Ocorreu um erro ao gerar o vídeo.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-8 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -z-10" />
      
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles className="w-3 h-3" />
          Tecnologia Veo 3.1
        </div>
        
        <h2 className="text-3xl font-bold mb-4">Imagine sua conexão</h2>
        <p className="text-slate-400 mb-8">
          Envie uma foto da sua casa ou empresa e criaremos um vídeo promocional personalizado mostrando o poder da fibra ótica da PIETRA'S.
        </p>

        <div className="grid md:grid-rows-1 gap-6">
          <div className="space-y-4">
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="veo-upload"
              />
              <label
                htmlFor="veo-upload"
                className={cn(
                  "flex flex-col items-center justify-center aspect-video rounded-2xl border-2 border-dashed transition-all cursor-pointer",
                  image ? "border-blue-500 bg-blue-500/5" : "border-slate-700 hover:border-slate-500 bg-slate-800/50"
                )}
              >
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-500 mb-2" />
                    <span className="text-sm text-slate-400">Upload da sua foto</span>
                  </>
                )}
              </label>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Descreva como você imagina o vídeo..."
              className="w-full bg-slate-800 border-slate-700 rounded-xl p-4 text-sm focus:ring-blue-500 focus:border-blue-500 transition-all"
              rows={3}
            />

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando vídeo (pode levar alguns minutos)...
                </>
              ) : (
                <>
                  <Video className="w-5 h-5" />
                  Gerar Vídeo Promocional
                </>
              )}
            </button>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>

          {videoUrl && (
            <div className="mt-8">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Seu Vídeo Gerado</h3>
              <div className="aspect-video rounded-2xl overflow-hidden bg-black relative group">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full"
                  poster={image || undefined}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
