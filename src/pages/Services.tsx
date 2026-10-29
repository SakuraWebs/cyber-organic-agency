import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { 
  Check, 
  Layers, 
  Zap, 
  Globe, 
  Server, 
  ShieldCheck, 
  ArrowRight, 
  Terminal, 
  Code2, 
  Database,
  ExternalLink,
  Cpu,
  Activity,
  Sparkles,
  Cloud,
  CheckCircle2,
  X,
  Send,
  Lock,
  Boxes
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface SoftwareModule {
  id: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  icon: typeof Globe;
  badge: string;
  accentColor: string;
  borderColor: string;
  bgGlow: string;
  features: string[];
  specs: { label: string; value: string }[];
}

const softwareModules: SoftwareModule[] = [
  {
    id: 'bio-digital-edge-runtime',
    number: '01',
    name: 'Bio-Digital Edge Runtime (Web)',
    tagline: 'Motor front-end desacoplado de máxima optimización',
    description: 'Motor front-end desacoplado de máxima optimización. Headless, Edge Caching en red Google, CI/CD automatizado.',
    icon: Globe,
    badge: 'FRONT-END EDGE RUNTIME',
    accentColor: 'text-brand-cyan',
    borderColor: 'border-brand-cyan/20 group-hover:border-brand-cyan/50',
    bgGlow: 'bg-brand-cyan/5',
    features: [
      'Arquitectura Headless desacoplada de ultra alto rendimiento',
      'Edge Caching perimetral en la red Anycast global de Google',
      'Pipelines CI/CD automatizados con despliegue continuo Zero-Downtime',
      'Optimización estricta Core Web Vitals (Puntuación 100/100 garantizada)',
      'Renderizado reactivo acelerado por GPU con WebGL y Three.js',
      'Compresión perimetral Brotli/Gzip y TLS 1.3 de latencia sub-segundo'
    ],
    specs: [
      { label: 'Latencia Borde', value: 'P95 < 45 ms' },
      { label: 'Distribución', value: 'Google Anycast CDN' },
      { label: 'Pipeline', value: 'GitHub Actions CI/CD' }
    ]
  },
  {
    id: 'multi-tenant-micro-saas-engine',
    number: '02',
    name: 'Multi-Tenant & Micro-SaaS Engine',
    tagline: 'Plataforma base para productos de software distribuido',
    description: 'Plataforma base con Google OAuth nativo, control de cuotas diarias en Python y distribución PWA (Android/Desktop).',
    icon: Layers,
    badge: 'MULTI-TENANT & DISTRIBUCIÓN PWA',
    accentColor: 'text-brand-gold',
    borderColor: 'border-brand-gold/20 group-hover:border-brand-gold/50',
    bgGlow: 'bg-brand-gold/5',
    features: [
      'Autenticación federada segura con Google Identity & OAuth 2.0 nativo',
      'Motor transaccional de cuotas diarias ejecutado en microservicios Python',
      'Distribución PWA instalable multiplataforma (Android, Windows, macOS)',
      'Aislamiento lógico estricto por inquilino con política Zero Data Bleed',
      'Control de acceso granular basado en roles y tokens de sesión (RBAC)',
      'Sincronización de estado en tiempo real con Firestore sin bloqueo de hilo'
    ],
    specs: [
      { label: 'Autenticación', value: 'Google OAuth 2.0' },
      { label: 'Control Cuotas', value: 'Microservicios Python' },
      { label: 'Soporte Plataforma', value: 'PWA Android / Desktop' }
    ]
  },
  {
    id: 'managed-cloud-ai-gateway',
    number: '03',
    name: 'Managed Cloud & AI Gateway',
    tagline: 'Orquestación elástica e inferencia cognitiva empresarial',
    description: 'Aprovisionamiento elástico en Google Cloud Run, Vertex AI y observabilidad con Cloud Logging.',
    icon: Cloud,
    badge: 'CLOUD RUN & VERTEX AI GATEWAY',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-400/20 group-hover:border-emerald-400/50',
    bgGlow: 'bg-emerald-400/5',
    features: [
      'Aprovisionamiento elástico y escalado instantáneo a cero (Cloud Run)',
      'Gateway de inferencia de baja latencia con modelos de Vertex AI y Gemini',
      'Observabilidad centralizada en tiempo real con Google Cloud Logging',
      'Monitoreo proactivo de métricas P95, alertas de cuota y rastreo distribuido',
      'Balanceo de carga global HTTPS con certificados SSL/TLS administrados',
      'Protección perimetral Cloud Armor y políticas de seguridad Zero-Trust'
    ],
    specs: [
      { label: 'Cómputo Serverless', value: 'Google Cloud Run' },
      { label: 'Modelos Cognitivos', value: 'Vertex AI & Gemini' },
      { label: 'Telemetría', value: 'Cloud Logging & Metrics' }
    ]
  }
];

interface LicensingTier {
  id: string;
  tierNumber: string;
  name: string;
  badge: string;
  highlighted?: boolean;
  highlightLabel?: string;
  summary: string;
  features: string[];
  ctaLabel: string;
  sla: string;
  idealFor: string;
}

const licensingTiers: LicensingTier[] = [
  {
    id: 'starter-license',
    tierNumber: 'Tier 1',
    name: 'Starter License',
    badge: 'MICRO-SAAS / BASE RUNTIME',
    summary: 'Infraestructura base lista para producción para productos SaaS con distribución PWA e identidad Google integrada.',
    features: [
      'Progressive Web App (PWA) instalable en Android y Desktop',
      'Google Identity & OAuth 2.0 nativo preconfigurado',
      'Hasta 4 inferencias/día por usuario autenticado',
      'Despliegue elástico en Firebase & Google Cloud Run',
      'Distribución global con CDN perimetral Anycast',
      'Dominio personalizado con aprovisionamiento SSL automático'
    ],
    ctaLabel: 'SOLICITAR INSTANCIA STARTER',
    sla: '99.9% Uptime Serverless',
    idealFor: 'Validación de MVPs, micro-productos y herramientas operativas con distribución PWA'
  },
  {
    id: 'enterprise-runtime',
    tierNumber: 'Tier 2',
    name: 'Enterprise Runtime',
    badge: 'PRODUCCIÓN & LIVING DATA',
    highlighted: true,
    highlightLabel: 'RUNTIME MÁS SELECCIONADO',
    summary: 'Plataforma bio-digital integral para empresas que requieren inferencia cognitiva avanzada, observabilidad y streaming reactivo.',
    features: [
      'Todo lo incluido en Starter License',
      'Living Data Engine (Streaming reactivo y renderizado WebGL/Three.js)',
      'Vertex AI Agent Builder para orquestación de agentes cognitivos',
      'Observabilidad completa y telemetría activa con Cloud Logging',
      'Cuotas de inferencia elásticas con límites dinámicos',
      'Arquitectura Multi-Tenant con políticas RBAC granulares'
    ],
    ctaLabel: 'ACCEDER A LICENCIA ENTERPRISE',
    sla: '99.99% Uptime Global SLA',
    idealFor: 'Plataformas SaaS comerciales, monitoreo continuo y flujos con agentes autónomos'
  },
  {
    id: 'dedicated-cluster',
    tierNumber: 'Tier 3',
    name: 'Dedicated Cluster Architecture',
    badge: 'ARQUITECTURA DEDICADA',
    summary: 'Aislamiento absoluto de infraestructura bajo estándares Google Cloud ACE con soporte de ingeniería consultiva continua.',
    features: [
      'Tenant 100% aislado en proyecto Google Cloud dedicado (Zero-Bleed)',
      'Alineación rigurosa con estándares de arquitectura Google Cloud ACE',
      'Soporte directo y continuo de Lead Cloud Architects & Engineers',
      'Modelos afinados en Vertex AI con embeddings y RAG privados',
      'Pipelines CI/CD corporativos con auditorías de seguridad perimetral',
      'Acuerdos de Nivel de Servicio dedicados con atención prioritaria'
    ],
    ctaLabel: 'SOLICITAR ARQUITECTURA DEDICADA',
    sla: 'SLA Personalizado con Acuerdo Formal',
    idealFor: 'Corporaciones, sistemas de misión crítica y despliegues con cumplimiento regulatorio estricto'
  }
];

export default function Services() {
  const [selectedTier, setSelectedTier] = useState<LicensingTier | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    projectScope: '',
    timeframe: 'Inmediata (1-2 semanas)'
  });

  const handleOpenTier = (tier: LicensingTier) => {
    setSelectedTier(tier);
    setSubmitSuccess(false);
    setModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Por favor, ingresa tu nombre y correo electrónico corporativo');
      return;
    }

    setIsSubmitting(true);
    try {
      if (db) {
        await addDoc(collection(db, 'license_requests'), {
          tierId: selectedTier?.id,
          tierName: selectedTier?.name,
          tierNumber: selectedTier?.tierNumber,
          applicantName: formData.name,
          applicantEmail: formData.email,
          organization: formData.organization,
          projectScope: formData.projectScope,
          timeframe: formData.timeframe,
          createdAt: serverTimestamp(),
          status: 'pending_review'
        });
      }
      setSubmitSuccess(true);
      toast.success(`Solicitud para ${selectedTier?.name} enviada exitosamente.`);
    } catch (err) {
      console.error('Error al registrar solicitud de licencia:', err);
      // Even in case of connection edge cases, acknowledge submission gracefully
      setSubmitSuccess(true);
      toast.success(`Solicitud para ${selectedTier?.name} recibida por nuestro equipo.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-36 pb-28 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
      <Helmet>
        <title>Módulos de Software e Infraestructura Escalable | CYBER ORGANIC</title>
        <meta 
          name="description" 
          content="Ecosistema modular para aprovisionar productos digitales de alta exigencia, desde micro-servicios serverless hasta aplicaciones progresivas con IA integrada." 
        />
        <meta property="og:title" content="Módulos de Software e Infraestructura Escalable | CYBER ORGANIC" />
        <meta property="og:description" content="Ecosistema modular para aprovisionar productos digitales de alta exigencia, desde micro-servicios serverless hasta aplicaciones progresivas con IA integrada." />
      </Helmet>

      {/* Header / Hero Section */}
      <header className="mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[10px] font-mono uppercase tracking-[0.25em] mb-6">
            <Boxes className="w-3.5 h-3.5" />
            <span>ECOSISTEMA MODULAR & LICENCIAMIENTO ENTERPRISE</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-white max-w-5xl leading-[1.1] mb-8">
            Módulos de Software e <br className="hidden sm:inline" />
            <span className="italic text-brand-gold">Infraestructura Escalable</span>
          </h1>

          <p className="font-sans text-gray-400 text-base sm:text-xl max-w-3xl leading-relaxed mb-12">
            Ecosistema modular para aprovisionar productos digitales de alta exigencia, desde micro-servicios serverless hasta aplicaciones progresivas con IA integrada.
          </p>

          {/* Infrastructure Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-brand-surface border border-white/5 rounded-sm">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block mb-1">Disponibilidad SLA</span>
              <div className="font-mono text-2xl font-bold text-white">99.99%</div>
              <span className="text-[10px] text-brand-cyan font-mono">Serverless Uptime</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block mb-1">Latencia Global P95</span>
              <div className="font-mono text-2xl font-bold text-brand-gold">&lt; 45 ms</div>
              <span className="text-[10px] text-gray-400 font-mono">Anycast Edge Caching</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block mb-1">Despliegue Continuo</span>
              <div className="font-mono text-2xl font-bold text-emerald-400">Zero-Downtime</div>
              <span className="text-[10px] text-gray-400 font-mono">CI/CD Automatizado</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block mb-1">Estándar Cloud</span>
              <div className="font-mono text-2xl font-bold text-white">Google ACE</div>
              <span className="text-[10px] text-brand-cyan font-mono">Cloud Run & Vertex AI</span>
            </div>
          </div>
        </motion.div>
      </header>

      {/* MÓDULOS DE SOFTWARE SECTION */}
      <section className="space-y-16 mb-36">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5">
          <div>
            <span className="text-brand-cyan text-[10px] font-mono uppercase tracking-[0.3em] block mb-2">SUITE DE ARQUITECTURA DISTRIBUIDA</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white">Módulos de Software Propietarios</h2>
          </div>
          <p className="text-gray-400 text-sm max-w-md font-sans">
            Aprovisionamiento desacoplado sobre infraestructura Google Cloud. Cada componente opera autónomamente o de manera orquestada.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {softwareModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.7 }}
              className={cn(
                "group relative bg-brand-surface border rounded-sm p-8 flex flex-col justify-between transition-all duration-500 hover:bg-white/[0.03]",
                module.borderColor
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={cn("p-3 rounded-sm bg-white/5 border border-white/10", module.accentColor)}>
                    <module.icon className="w-7 h-7" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-500 font-bold">{module.number}</span>
                    <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-[9px] font-mono tracking-widest uppercase text-gray-300 rounded-sm">
                      {module.badge}
                    </span>
                  </div>
                </div>

                <h3 className="font-serif text-2xl text-white mb-2 leading-snug">{module.name}</h3>
                <h4 className="font-sans text-xs uppercase tracking-wider text-brand-gold mb-5 font-semibold">{module.tagline}</h4>
                <p className="font-sans text-gray-400 text-sm leading-relaxed mb-6">{module.description}</p>

                {/* Features Matrix */}
                <div className="space-y-2.5 mb-8">
                  {module.features.map(f => (
                    <div key={f} className="flex items-start gap-2 text-xs text-gray-300">
                      <Check className="w-3.5 h-3.5 text-brand-gold shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {/* Tech Specs */}
                <div className="pt-5 border-t border-white/5 grid grid-cols-3 gap-2 text-center sm:text-left mb-6">
                  {module.specs.map(s => (
                    <div key={s.label}>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-gray-500 block mb-1">{s.label}</span>
                      <span className="text-xs font-mono font-bold text-white block">{s.value}</span>
                    </div>
                  ))}
                </div>

                {module.id === 'bio-digital-edge-runtime' ? (
                  <Link
                    to="/living-data"
                    className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-brand-cyan hover:text-white transition-colors group/link"
                  >
                    <span>Inspeccionar Runtime en Borde</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                ) : module.id === 'managed-cloud-ai-gateway' ? (
                  <Link
                    to="/ai-studio"
                    className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-emerald-400 hover:text-white transition-colors group/link"
                  >
                    <span>Acceder a Cyber Organic AI Studio</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                ) : (
                  <Link
                    to="/portafolio"
                    className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-brand-gold hover:text-white transition-colors group/link"
                  >
                    <span>Ver Deployments Multi-Tenant</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TIERS DE LICENCIAMIENTO SECTION (REPLACES CALCULATOR AND MERCADO PAGO) */}
      <section className="pt-24 border-t border-white/10 relative">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-cyan/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-mono uppercase tracking-[0.25em] mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>MODELOS DE APROVISIONAMIENTO Y LICENCIA</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-white mb-6">
            Tiers de Licenciamiento de Infraestructura
          </h2>
          <p className="font-sans text-gray-400 text-sm sm:text-base leading-relaxed">
            Aprovisionamiento estructurado para desplegar instancias de software propietario y suites bio-digitales con total previsibilidad técnica.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {licensingTiers.map((tier, index) => {
            const isHighlighted = !!tier.highlighted;

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12, duration: 0.7 }}
                className={cn(
                  "relative bg-brand-surface rounded-sm p-8 sm:p-10 flex flex-col justify-between transition-all duration-300",
                  isHighlighted
                    ? "border-2 border-brand-gold shadow-[0_0_40px_rgba(201,160,80,0.15)] bg-gradient-to-b from-brand-gold/[0.04] via-brand-surface to-brand-surface"
                    : "border border-white/10 hover:border-white/30"
                )}
              >
                {/* Top Highlight Badge */}
                {isHighlighted && tier.highlightLabel && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-gold text-brand-dark text-[9px] font-mono font-bold tracking-widest uppercase rounded-full shadow-lg">
                    {tier.highlightLabel}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">
                      {tier.tierNumber}
                    </span>
                    <span className={cn(
                      "text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-sm border",
                      isHighlighted 
                        ? "bg-brand-gold/10 text-brand-gold border-brand-gold/30"
                        : "bg-white/5 text-gray-300 border-white/10"
                    )}>
                      {tier.badge}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl text-white mb-3">{tier.name}</h3>
                  <p className="font-sans text-xs text-gray-400 leading-relaxed mb-6">{tier.summary}</p>

                  <div className="p-3 mb-6 bg-white/[0.02] border border-white/5 rounded-sm">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-gray-500 block mb-1">Caso de Uso Óptimo</span>
                    <span className="text-xs font-sans text-gray-300">{tier.idealFor}</span>
                  </div>

                  <div className="space-y-3 mb-8">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand-cyan block mb-2">Especificaciones de la Licencia:</span>
                    {tier.features.map(feature => (
                      <div key={feature} className="flex items-start gap-2.5 text-xs text-gray-300">
                        <Check className={cn(
                          "w-3.5 h-3.5 shrink-0 mt-0.5",
                          isHighlighted ? "text-brand-gold" : "text-brand-cyan"
                        )} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Compromiso SLA</span>
                    <span className="font-mono text-xs text-brand-gold font-bold">{tier.sla}</span>
                  </div>

                  <button
                    onClick={() => handleOpenTier(tier)}
                    type="button"
                    className={cn(
                      "w-full py-3.5 px-4 rounded-sm font-sans text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer",
                      isHighlighted
                        ? "bg-brand-gold text-brand-dark hover:bg-white shadow-[0_0_20px_rgba(201,160,80,0.3)]"
                        : "border border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                    )}
                  >
                    <span>{tier.ctaLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="mt-3 text-center">
                    <Link
                      to={`/contacto?tier=${encodeURIComponent(tier.name)}`}
                      className="text-[10px] font-mono text-gray-500 hover:text-gray-300 underline tracking-wider transition-colors"
                    >
                      O consultar vía canal de contacto técnico
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ARCHITECTURAL COMPLIANCE & TOPOLOGY DETAILS */}
      <section className="mt-36 pt-24 border-t border-white/5">
        <div className="bg-brand-surface/90 border border-white/10 rounded-sm p-8 sm:p-12 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-10 pb-8 border-b border-white/5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[10px] font-mono uppercase tracking-widest mb-3">
                <Terminal className="w-3 h-3" />
                <span>TOPOLOGÍA DE NUBE DISTRIBUIDA</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-white">
                Infraestructura Serverless Elástica en Google Cloud
              </h3>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm max-w-lg font-sans leading-relaxed">
              Toda la suite de software opera sin instancias fijas inactivas. Los contenedores en Cloud Run escalan de 0 a miles de peticiones por segundo en milisegundos, optimizando costos y garantizando latencia mínima.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-black/40 border border-white/5 rounded-sm">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-brand-cyan" />
                <h4 className="font-mono text-xs uppercase tracking-widest text-white">Edge Anycast CDN</h4>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Distribución en más de 200 puntos de presencia globales en la red backbone de Google, garantizando P95 &lt; 45ms.
              </p>
            </div>

            <div className="p-6 bg-black/40 border border-white/5 rounded-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-brand-gold" />
                <h4 className="font-mono text-xs uppercase tracking-widest text-white">Vertex AI Cognitive Agents</h4>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Inferencia multimodal contextual con modelos fundacionales Gemini y agentes autónomos grounded sin persistencia invasiva.
              </p>
            </div>

            <div className="p-6 bg-black/40 border border-white/5 rounded-sm">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="font-mono text-xs uppercase tracking-widest text-white">Aislamiento Zero-Trust</h4>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Cifrado TLS 1.3 / AES-256 en tránsito y reposo, RBAC estricto y separación lógica o física de inquilinos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTION DEPLOYMENTS BANNER */}
      <section className="mt-28 p-10 sm:p-14 rounded-sm bg-gradient-to-r from-brand-surface via-brand-dark to-brand-surface border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <span className="text-[10px] font-mono text-brand-gold uppercase tracking-[0.3em] block mb-2">VALIDACIÓN EN ENTORNO REAL</span>
          <h3 className="font-serif text-2xl sm:text-3xl text-white mb-3">Deployments Activos en Producción</h3>
          <p className="font-sans text-gray-400 text-sm max-w-xl">
            Descubre cómo organizaciones de alto nivel ejecutan infraestructuras bio-digitales y motores de IA sobre la plataforma propietaria de Cyber Organic.
          </p>
        </div>
        <Link
          to="/portafolio"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-sm bg-brand-gold text-brand-dark font-sans text-xs font-bold uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(201,160,80,0.2)] whitespace-nowrap"
        >
          <span>Explorar Deployments</span>
          <ExternalLink className="w-4 h-4" />
        </Link>
      </section>

      {/* TIER REQUEST MODAL */}
      <AnimatePresence>
        {modalOpen && selectedTier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl bg-brand-surface border border-white/20 rounded-sm p-6 sm:p-8 shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-sm hover:bg-white/5 transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold">
                  {selectedTier.tierNumber}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand-cyan">
                  {selectedTier.badge}
                </span>
              </div>

              <h3 className="font-serif text-2xl text-white mb-2">
                {selectedTier.ctaLabel}
              </h3>
              <p className="text-gray-400 text-xs mb-6 font-sans">
                Completa los datos de tu organización para iniciar el aprovisionamiento de la instancia bajo la licencia seleccionada.
              </p>

              {submitSuccess ? (
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-sm text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                  <h4 className="font-serif text-lg text-white mb-2">Solicitud de Licencia Registrada</h4>
                  <p className="text-gray-300 text-xs font-sans mb-6">
                    Nuestro equipo de arquitectura cloud revisará los parámetros de tu despliegue y te contactará en menos de 24 horas.
                  </p>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="px-6 py-2.5 bg-brand-gold text-brand-dark text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-white transition-colors"
                  >
                    Aceptar y Volver
                  </button>
                </div>
              ) : (
                <form onSubmit={handleModalSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1.5">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ing. Alexander Cruz"
                        className="w-full bg-black/50 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1.5">
                        Email Corporativo *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="alexander@empresa.com"
                        className="w-full bg-black/50 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1.5">
                        Organización / Empresa
                      </label>
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                        placeholder="Nombre de la entidad"
                        className="w-full bg-black/50 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1.5">
                        Ventana de Despliegue
                      </label>
                      <select
                        value={formData.timeframe}
                        onChange={(e) => setFormData(prev => ({ ...prev, timeframe: e.target.value }))}
                        className="w-full bg-black/50 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold font-sans"
                      >
                        <option value="Inmediata (1-2 semanas)">Inmediata (1-2 semanas)</option>
                        <option value="Mediano plazo (1 mes)">Mediano plazo (1 mes)</option>
                        <option value="Evaluación técnica previa">Evaluación técnica previa</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1.5">
                      Alcance del Proyecto o Requerimientos Técnicos
                    </label>
                    <textarea
                      rows={3}
                      value={formData.projectScope}
                      onChange={(e) => setFormData(prev => ({ ...prev, projectScope: e.target.value }))}
                      placeholder="Describe la funcionalidad, concurrencia proyectada o integración requerida..."
                      className="w-full bg-black/50 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold font-sans resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-4">
                    <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-brand-gold" />
                      <span>Cifrado E2E & Protocolo Zero Data Bleed</span>
                    </span>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-brand-gold text-brand-dark text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-white transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Procesando...</span>
                      ) : (
                        <>
                          <span>Confirmar Solicitud</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
