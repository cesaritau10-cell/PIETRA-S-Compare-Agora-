import React from 'react';
import { Wifi, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Plan } from '../services/geminiService';
import { cn } from '../lib/utils';

interface PlanCardProps {
  plan: Plan;
  index: number;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all group"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-blue-50 p-3 rounded-xl">
            <Wifi className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {plan.type}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              {plan.technology}
            </span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.provider}</h3>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-3xl font-bold text-blue-600">{plan.speed}</span>
        </div>

        <div className="space-y-2 mb-6">
          {plan.benefits.slice(0, 3).map((benefit, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm text-slate-500">A partir de</span>
              <div className="text-2xl font-bold text-slate-900">{plan.price}</div>
            </div>
          </div>
          
          <a 
            href={`https://wa.me/5553984782570?text=Olá! Gostaria de contratar o plano ${plan.provider} de ${plan.speed} (${plan.type}) que vi no site.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors group-hover:shadow-lg group-hover:shadow-blue-200"
          >
            CONTRATE AGORA
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};
