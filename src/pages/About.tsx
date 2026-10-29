import { motion } from 'motion/react';
import { 
  Shield, 
  Zap, 
  Cpu, 
  Globe, 
  Github, 
  Linkedin, 
  Terminal, 
  Layers, 
  Lock, 
  Server, 
  CheckCircle2, 
  ArrowRight,
  GitBranch,
  KeyRound,
  Binary
} from 'lucide-react';
import { Link } from 'react-router-dom';

const badges = [
  "Google Cloud Platform (GCP)",
  "Vertex AI",
  "Python 3",
  "Firebase Hosting",
  "Google Cloud Run",
  "Cloud Logging & IAM"
];

const rdPillars = [
  {
    icon: GitBranch,
    title: "Tuberías CI/CD Automatizadas",
    desc: "Canales de integración y despliegue continuo con pruebas unitarias, linting estricto y empaquetado en contenedores Docker optimizados para Google Cloud Run.",
    tag: "GITOPS & RUNTIME"
  },
  {
    icon: KeyRound,
    title: "Aislamiento con Service Accounts",
    desc: "Segregación criptográfica de accesos y principio de mínimo privilegio (PoLP) con Google Service Accounts dedicadas por cada micro-servicio y tenant.",
    tag: "IAM & SECURITY"
  },
  {
    icon: Binary,
    title: "Grounding de Agentes en Vertex AI",
    desc: "Conexión de modelos fundacionales con almacenes vectoriales de conocimiento indexado para inferencias semánticas sin alucinaciones y alta precisión contextual.",
    tag: "COGNITIVE CORE"
  },
  {
    icon: Layers,
    title: "Plantillas Base de Aceleración",
    desc: "Arquitecturas de referencia modularizadas con autenticación Google Identity nativa, control de cuotas en Python y cliente PWA desacoplado.",
    tag: "SCAFFOLDING & SAAS"
  }
];

const engineeringValues = [
  {
    icon: Shield,
    title: "Ciberseguridad Perimetral & Gobernanza",
    desc: "Diseño de infraestructura con políticas IAM de mínimo privilegio, auditoría centralizada en Cloud Logging y protección perimetral contra intrusiones bajo estándares de infraestructura crítica."
  },
  {
    icon: Zap,
    title: "Rendimiento Extremo (Core Web Vitals)",
    desc: "Optimización continua de First Contentful Paint (<0.8s) y Cumulative Layout Shift (0.00) mediante renderizado desacoplado y entrega perimetral con Cloud CDN y Firebase Hosting."
  },
  {
    icon: Server,
    title: "Computación Serverless de Alta Resiliencia",
    desc: "Micro-servicios distribuidos con escalabilidad horizontal inmediata de 0 a miles de instancias simultáneas en Cloud Run, garantizando tolerancia a fallos y latencia ultrabaja."
  }
];

const About = () => {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 bg-brand-dark min-h-screen overflow-hidden relative">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] left-[-10%] w-[45%] h-[45%] bg-brand-cyan/10 blur-[130px] rounded-full" />
        <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-brand-gold/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[20%] w-[35%] h-[35%] bg-emerald-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <section className="mb-24 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-cyan text-[11px] uppercase tracking-[0.25em] font-mono mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
              INGENIERÍA & R&D DE INFRAESTRUCTURA
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-sans font-bold text-white tracking-tight leading-[1.1] mb-6">
              Donde la Telemetría se Transforma en <span className="bg-gradient-to-r from-brand-cyan via-teal-300 to-brand-gold bg-clip-text text-transparent">Inteligencia</span>
            </h1>

            <p className="text-gray-300 text-base md:text-lg leading-relaxed font-sans max-w-3xl mx-auto">
              Desarrollamos soluciones de software autónomas mediante la unión de arquitecturas serverless de alta escala y modelos de inferencia cognitiva.
            </p>
          </motion.div>
        </section>

        {/* Founder Profile Section */}
        <section className="mb-28 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden p-8 md:p-12 hover:border-white/20 transition-all duration-500"
          >
            <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start">
              {/* Photo & Technical Credentials */}
              <div className="w-full lg:w-5/12 flex flex-col items-center">
                <div className="relative group w-64 h-80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-brand-surface">
                  <img
                    src="/enrique-perfil.webp?v=1"
                    alt="Enrique Rolando Fernandez Manas"
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-3 left-3 right-3 py-1.5 px-3 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-brand-cyan text-center">
                    LEAD CLOUD ARCHITECT · LATAM
                  </div>
                </div>

                {/* Social Channels */}
                <div className="flex items-center gap-3 mt-6">
                  <a
                    href="https://github.com/SakuraWebs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all"
                    aria-label="GitHub de Enrique Rolando Fernandez Manas"
                    title="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/enrique-fernández-3275463a6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-brand-cyan hover:border-brand-cyan/40 hover:bg-brand-cyan/10 transition-all"
                    aria-label="LinkedIn de Enrique Rolando Fernandez Manas"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Bio & Badges */}
              <div className="w-full lg:w-7/12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-gold font-bold">
                      DIRECCIÓN DE ARQUITECTURA & TECNOLOGÍA
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-sans font-bold text-white mb-2">
                    Enrique Rolando Fernandez Manas
                  </h2>
                  <p className="text-sm font-mono text-brand-cyan mb-6">
                    Founder & Lead Cloud Architect
                  </p>

                  <p className="text-gray-300 text-sm md:text-[15px] leading-relaxed mb-8 font-sans">
                    Especialista en diseño de arquitecturas en la nube sobre Google Cloud Platform (GCP) con enfoque en estándares de certificación Associate Cloud Engineer (ACE). Experto en ingeniería de rendimiento web extremo (Core Web Vitals), ciberseguridad perimetral y desarrollo serverless distribuido con Python, Cloud Run, Firebase y Vertex AI. Con más de dos décadas de experiencia previa en análisis de sistemas, operaciones técnicas de seguridad y gobernanza de infraestructura crítica, lidera la visión de Cyber Organic como una plataforma tecnológica orientada a la resiliencia operativa y la eficiencia bio-digital en América Latina.
                  </p>
                </div>

                {/* Mandatory Badges */}
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-brand-cyan" />
                    STACK TECNOLÓGICO & COMPETENCIAS CORE
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {badges.map((badge) => (
                      <span
                        key={badge}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.04] border border-white/10 text-xs font-mono text-gray-200 hover:border-brand-cyan/40 hover:text-white transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan/70" />
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Laboratorio de I+D: SakuraWebs Core Engine Section */}
        <section className="mb-28 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative bg-gradient-to-b from-white/[0.05] to-white/[0.02] backdrop-blur-2xl border border-white/15 rounded-3xl p-8 md:p-14 overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/10 blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/10 blur-[130px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-white/10">
                <div>
                  <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-brand-cyan mb-3">
                    <Cpu className="w-4 h-4" />
                    ENTORNO DE EXPERIMENTACIÓN & HARDENING
                  </div>
                  <h2 className="text-3xl md:text-4xl font-sans font-bold text-white tracking-tight">
                    Laboratorio de I+D: SakuraWebs Core Engine
                  </h2>
                </div>
                <div className="md:max-w-md">
                  <p className="text-sm text-gray-300 font-sans leading-relaxed">
                    Núcleo experimental donde se validan tuberías CI/CD, aislamiento de credenciales con Google Service Accounts, grounding de agentes en Vertex AI y plantillas base de aceleración.
                  </p>
                </div>
              </div>

              {/* R&D Disciplines Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {rdPillars.map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={pillar.title}
                      className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-brand-cyan/40 hover:bg-white/[0.05] transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-cyan group-hover:bg-brand-cyan/10 group-hover:border-brand-cyan/30 transition-all">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest px-2.5 py-1 rounded bg-black/40 border border-white/5">
                          {pillar.tag}
                        </span>
                      </div>
                      <h3 className="text-lg font-sans font-semibold text-white mb-2 group-hover:text-brand-cyan transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="text-sm text-gray-300 font-sans leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Technical Blueprint Terminal */}
              <div className="rounded-2xl bg-black/70 border border-white/10 p-5 md:p-6 font-mono text-xs text-gray-300 shadow-2xl">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-[11px] ml-2 text-gray-400">sakurawebs-core-engine@gcp-europe-west1:~$</span>
                  </div>
                  <span className="text-[10px] text-brand-cyan">PIPELINE STATUS: OPTIMIZED</span>
                </div>
                <div className="space-y-1.5 text-gray-300 leading-relaxed overflow-x-auto py-1">
                  <div className="text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>[CI/CD] Cloud Build multi-stage Docker packaging -&gt; Artifact Registry verified</span>
                  </div>
                  <div className="text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>[IAM] sa-core-engine@cyber-organic.iam.gserviceaccount.com bound with PoLP scope</span>
                  </div>
                  <div className="text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>[VERTEX AI] Search & Conversation datastore synced (Grounding latency: 42ms)</span>
                  </div>
                  <div className="text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>[RUNTIME] Cloud Run revision traffic 100% active · Min instances: 0 (Scale-to-Zero)</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Engineering Rigor & Production Values */}
        <section className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-brand-gold block mb-2">
              ESTÁNDARES DE INFRAESTRUCTURA
            </span>
            <h2 className="text-3xl font-sans font-bold text-white">
              Pilares de Ingeniería y Resiliencia
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {engineeringValues.map((val) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={val.title}
                  whileHover={{ y: -6 }}
                  className="p-8 rounded-2xl bg-white/[0.03] backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-cyan mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-sans font-semibold text-white mb-3">
                    {val.title}
                  </h3>
                  <p className="text-sm text-gray-300 font-sans leading-relaxed">
                    {val.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Technical Call to Action */}
        <section className="max-w-4xl mx-auto text-center">
          <div className="p-8 md:p-12 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
            <h3 className="text-2xl md:text-3xl font-sans font-bold text-white mb-4">
              ¿Requieres Infraestructura Dedicada o Evaluación de Arquitectura?
            </h3>
            <p className="text-sm md:text-base text-gray-300 max-w-xl mx-auto mb-8 font-sans">
              Consulta directamente con nuestro Lead Cloud Architect sobre el aprovisionamiento de clústeres dedicados, integración de Living Data o despliegue de AI Studio.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contacto"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-cyan to-teal-400 text-brand-dark font-mono text-xs uppercase tracking-wider font-bold hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2"
              >
                CONSULTAR ARQUITECTURA
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/ai-studio"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs uppercase tracking-wider hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
              >
                PROBAR AI STUDIO
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
