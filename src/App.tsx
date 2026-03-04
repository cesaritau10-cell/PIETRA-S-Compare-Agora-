import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Phone, 
  MapPin, 
  Wifi, 
  Zap, 
  ShieldCheck, 
  Headphones, 
  Loader2, 
  ChevronRight,
  Globe,
  ArrowUpRight,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlanCard } from './components/PlanCard';
import { GeminiConsultant } from './components/GeminiConsultant';
import { VeoPromo } from './components/VeoPromo';
import { searchInternetPlans, Plan } from './services/geminiService';
import { cn } from './lib/utils';

export default function App() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState('Pelotas, RS');
  const [showConsultant, setShowConsultant] = useState(false);
  
  // Filter states
  const [filterType, setFilterType] = useState<'all' | 'residencial' | 'empresarial'>('all');
  const [filterSpeed, setFilterSpeed] = useState<number>(0);
  const [filterPrice, setFilterPrice] = useState<number>(1000);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const data = await searchInternetPlans(location);
      setPlans(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const filteredPlans = plans.filter(plan => {
    const matchesType = filterType === 'all' || plan.type === filterType;
    const matchesSpeed = plan.speedMbps >= filterSpeed;
    const matchesPrice = plan.priceValue <= filterPrice;
    return matchesType && matchesSpeed && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Wifi className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold font-display tracking-tight">
                PIETRA'S <span className="text-blue-600">COMPARE</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#planos" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Planos</a>
              <a href="#veo" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Criar Vídeo</a>
              <a href="#contato" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Contato</a>
            </div>

            <div className="flex items-center gap-4">
              <a 
                href="tel:53984782570" 
                className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition-all"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                53 984782570
              </a>
              <button 
                onClick={() => setShowConsultant(true)}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Consultoria IA
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
                Compare sua melhor <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Internet em Pelotas</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
                Encontre as melhores ofertas de fibra ótica e banda larga em segundos. Economize tempo e dinheiro com a consultoria inteligente da PIETRA'S.
              </p>

              <div className="max-w-xl mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />
                <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-xl">
                  <div className="flex-1 flex items-center gap-3 px-4">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Sua localização (ex: Pelotas, RS)"
                      className="w-full border-none focus:ring-0 text-slate-900 font-medium placeholder:text-slate-400"
                    />
                  </div>
                  <button 
                    onClick={fetchPlans}
                    className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Buscar Planos
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: Zap, title: "Ultra Velocidade", desc: "Planos de até 1GB de fibra ótica." },
                { icon: ShieldCheck, title: "Conexão Segura", desc: "Provedores certificados e estáveis." },
                { icon: Headphones, title: "Suporte 24/7", desc: "Atendimento especializado sempre." },
                { icon: Globe, title: "Cobertura Total", desc: "Atendemos toda a região de Pelotas." }
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="bg-blue-50 p-4 rounded-2xl mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Plans Grid */}
        <section id="planos" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Melhores Ofertas em {location}</h2>
              <p className="text-slate-500">Dados atualizados em tempo real via Google Search.</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Type Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tipo de Plano</label>
                <div className="flex gap-2">
                  {['all', 'residencial', 'empresarial'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type as any)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                        filterType === type 
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {type === 'all' ? 'Todos' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Velocidade Mínima</label>
                <div className="flex gap-2">
                  {[0, 300, 500, 700].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setFilterSpeed(speed)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                        filterSpeed === speed 
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {speed === 0 ? 'Todas' : `${speed}M`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Preço Máximo</label>
                <div className="flex gap-2">
                  {[100, 150, 200, 1000].map((price) => (
                    <button
                      key={price}
                      onClick={() => setFilterPrice(price)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                        filterPrice === price 
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {price === 1000 ? 'Todos' : `Até R$${price}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <p className="text-slate-500 font-medium animate-pulse">Analisando as melhores ofertas para você...</p>
            </div>
          ) : (
            <>
              {filteredPlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPlans.map((plan, i) => (
                    <PlanCard key={i} plan={plan} index={i} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200">
                  <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhum plano encontrado</h3>
                  <p className="text-slate-500">Tente ajustar seus filtros para ver mais resultados.</p>
                </div>
              )}
            </>
          )}
        </section>

        {/* Veo Section */}
        <section id="veo" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <VeoPromo />
        </section>

        {/* CTA Section */}
        <section id="contato" className="py-24 bg-blue-600 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100" stroke="white" fill="transparent" strokeWidth="0.1" />
              <path d="M0 80 C 30 20 60 20 100 80" stroke="white" fill="transparent" strokeWidth="0.1" />
            </svg>
          </div>
          
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6">Ainda com dúvidas?</h2>
            <p className="text-blue-100 text-lg mb-10">
              Nossos especialistas estão prontos para ajudar você a escolher o plano ideal para sua necessidade.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="https://wa.me/5553984782570" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all flex items-center gap-3 shadow-xl"
              >
                <MessageSquare className="w-6 h-6" />
                Falar no WhatsApp
              </a>
              <a 
                href="tel:53984782570" 
                className="text-white border-2 border-white/30 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-3"
              >
                <Phone className="w-6 h-6" />
                Ligar Agora
              </a>
            </div>
            <p className="mt-8 text-blue-200 font-medium">
              Atendimento: 53 984782570
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Wifi className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                PIETRA'S <span className="text-blue-600">COMPARE</span>
              </span>
            </div>
            <div className="text-sm">
              © 2024 PIETRA'S Compare Your Best Internet. Todos os direitos reservados.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <AnimatePresence>
        {showConsultant && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-[60] w-[400px] max-w-[calc(100vw-3rem)]"
          >
            <div className="relative">
              <button 
                onClick={() => setShowConsultant(false)}
                className="absolute -top-3 -right-3 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg z-10 hover:bg-red-500 transition-colors"
              >
                ×
              </button>
              <GeminiConsultant />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showConsultant && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setShowConsultant(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-2xl shadow-blue-400 hover:bg-blue-700 transition-all group"
        >
          <div className="relative">
            <MessageSquare className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all">
            Dúvidas? Fale com a IA
          </span>
        </motion.button>
      )}
    </div>
  );
}
