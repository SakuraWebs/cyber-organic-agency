import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Server, Cpu, CheckCircle2, ArrowRight, ExternalLink, Activity, ShieldCheck } from 'lucide-react';

interface ProjectModalProps {
  project: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-brand-dark/95 backdrop-blur-xl cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-[101] bg-brand-surface border border-white/10 rounded-sm overflow-hidden flex flex-col md:flex-row shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-[110] w-10 h-10 rounded-full bg-brand-dark/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 group"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Left Side: Visual Deployments & Gallery */}
            <div className="w-full md:w-1/2 h-64 md:h-full overflow-y-auto scrollbar-hide bg-black/40 border-r border-white/5">
              <div className="flex flex-col gap-4 p-4 md:p-8">
                <motion.img
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  src={project.image.includes('http') || project.image.match(/\.(webp|jpg|jpeg|png|svg|gif)$/i) ? project.image : `${project.image}.webp`}
                  alt={project.alt || project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full aspect-video object-cover rounded-sm border border-white/10"
                  referrerPolicy="no-referrer"
                />
                {project.gallery && project.gallery.map((img: string, index: number) => (
                  <motion.img
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    src={img.includes('http') || img.match(/\.(webp|jpg|jpeg|png|svg|gif)$/i) ? img : `${img}.webp`}
                    alt={`${project.title} telemetry visual ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full aspect-video object-cover rounded-sm border border-white/5 opacity-80 hover:opacity-100 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
            </div>

            {/* Right Side: Architecture & Engineering Details */}
            <div className="w-full md:w-1/2 h-full overflow-y-auto p-6 md:p-12 lg:p-14 flex flex-col bg-brand-surface">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                {/* Category & Scope */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-brand-cyan/15 text-brand-cyan font-mono text-[10px] uppercase tracking-wider border border-brand-cyan/30 rounded-sm">
                    {project.category}
                  </span>
                  {project.scope && (
                    <span className="px-3 py-1 bg-brand-gold/15 text-brand-gold font-mono text-[10px] uppercase tracking-wider border border-brand-gold/30 rounded-sm">
                      {project.scope}
                    </span>
                  )}
                </div>

                <h2 className="font-serif text-3xl md:text-5xl text-white mb-6 leading-tight">
                  {project.title}
                </h2>

                {/* Telemetry Metrics */}
                {project.metrics && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 p-4 bg-white/5 border border-white/10 rounded-sm">
                    {project.metrics.uptime && (
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 block mb-0.5">SLA Uptime</span>
                        <div className="flex items-center gap-1.5 font-mono text-sm text-emerald-400 font-bold">
                          <Activity className="w-3.5 h-3.5" /> {project.metrics.uptime}
                        </div>
                      </div>
                    )}
                    {project.metrics.latency && (
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 block mb-0.5">Latencia Edge</span>
                        <div className="flex items-center gap-1.5 font-mono text-sm text-brand-cyan font-bold">
                          <Cpu className="w-3.5 h-3.5" /> {project.metrics.latency}
                        </div>
                      </div>
                    )}
                    {project.metrics.vitals && (
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 block mb-0.5">Core Web Vitals</span>
                        <div className="flex items-center gap-1.5 font-mono text-sm text-amber-300 font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" /> {project.metrics.vitals}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Metadata Row */}
                <div className="grid grid-cols-2 gap-6 mb-8 border-y border-white/10 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center">
                      <Server className="w-4 h-4 text-brand-cyan" />
                    </div>
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500">Organización</p>
                      <p className="text-xs text-white font-medium">{project.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-brand-cyan" />
                    </div>
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500">Despliegue</p>
                      <p className="text-xs text-white font-medium">{project.year || '2026'}</p>
                    </div>
                  </div>
                </div>

                {/* Technical Overview */}
                <div className="mb-8">
                  <h3 className="font-mono text-[11px] uppercase tracking-widest text-brand-gold mb-3 flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5" /> Especificaciones de Arquitectura
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {project.fullDesc || project.desc}
                  </p>
                </div>

                {/* Architecture Layers / Services */}
                {project.services && project.services.length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-mono text-[11px] uppercase tracking-widest text-brand-cyan mb-3">
                      Capas de Software & Componentes de Nube
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {project.services.map((service: string, index: number) => (
                        <div 
                          key={index}
                          className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-sm text-xs text-gray-200"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                          <span className="truncate">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  {project.website ? (
                    <a
                      href={project.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 hover:bg-brand-cyan hover:text-brand-dark transition-all duration-300 font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 rounded-sm"
                    >
                      <span>Ver Deployment en Producción</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : null}

                  <button 
                    onClick={onClose}
                    className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-white transition-colors flex items-center gap-2 ml-auto"
                  >
                    <span>Cerrar Panel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
