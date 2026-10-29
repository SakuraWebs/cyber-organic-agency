import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { projects as localProjects } from '../data/projects';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, User, Server, ExternalLink, ChevronRight, Cpu, ShieldCheck, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      
      // Check local projects first
      const localProject = localProjects.find(p => String(p.id) === String(projectId));
      
      if (localProject) {
        setProject(localProject);
        setLoading(false);
        return;
      }

      // If not local, try fetching from Firestore
      try {
        const docRef = doc(db, 'projects', projectId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
        } else {
          navigate('/portafolio');
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        navigate('/portafolio');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark pt-32 pb-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-cyan/20 border-t-brand-cyan rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-brand-dark pt-32 pb-24">
      <Helmet>
        <title>{project.metaTitle || `${project.title} | CYBER ORGANIC`}</title>
        <meta name="description" content={project.metaDesc || project.desc} />
        <meta property="og:title" content={project.metaTitle || `${project.title} | CYBER ORGANIC`} />
        <meta property="og:description" content={project.metaDesc || project.desc} />
        <meta property="og:image" content={project.image.includes('http') || project.image.match(/\.(webp|jpg|jpeg|png|svg|gif)$/i) ? project.image : `${window.location.origin}${project.image}.webp`} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={project.metaTitle || `${project.title} | CYBER ORGANIC`} />
        <meta name="twitter:description" content={project.metaDesc || project.desc} />
        <meta name="twitter:image" content={project.image.includes('http') || project.image.match(/\.(webp|jpg|jpeg|png|svg|gif)$/i) ? project.image : `${window.location.origin}${project.image}.webp`} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[65vh] w-full overflow-hidden">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={project.image.includes('http') || project.image.match(/\.(webp|jpg|jpeg|png|svg|gif)$/i) ? project.image : `${project.image}.webp`}
          alt={project.alt || project.title}
          className="w-full h-full object-cover object-top grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-24">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link 
                to="/portafolio" 
                className="inline-flex items-center gap-2 text-brand-gold font-mono text-[10px] uppercase tracking-widest mb-6 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                Volver a Deployments
              </Link>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="block font-mono text-xs uppercase tracking-[0.2em] text-brand-cyan bg-brand-cyan/15 border border-brand-cyan/30 px-3 py-1 rounded-sm">
                  {project.category}
                </span>
                {project.scope && (
                  <span className="font-mono text-xs uppercase tracking-wider text-brand-gold bg-brand-gold/15 border border-brand-gold/30 px-3 py-1 rounded-sm">
                    {project.scope}
                  </span>
                )}
              </div>
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-white mb-4 leading-tight">
                {project.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Project Info Sidebar */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8 sticky top-36 p-6 bg-brand-surface/60 border border-white/10 rounded-sm backdrop-blur-md"
            >
              {/* Telemetry Metrics */}
              {project.metrics && (
                <div className="space-y-3 pb-6 border-b border-white/10">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-brand-gold block font-semibold">
                    Telemetría Operativa
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {project.metrics.uptime && (
                      <div className="p-3 bg-white/5 rounded-sm border border-white/5">
                        <span className="font-mono text-[8.5px] uppercase text-gray-400 block mb-1">Disponibilidad</span>
                        <div className="flex items-center gap-1 font-mono text-xs text-emerald-400 font-bold">
                          <Activity className="w-3 h-3" /> {project.metrics.uptime}
                        </div>
                      </div>
                    )}
                    {project.metrics.latency && (
                      <div className="p-3 bg-white/5 rounded-sm border border-white/5">
                        <span className="font-mono text-[8.5px] uppercase text-gray-400 block mb-1">Latencia Edge</span>
                        <div className="flex items-center gap-1 font-mono text-xs text-brand-cyan font-bold">
                          <Cpu className="w-3 h-3" /> {project.metrics.latency}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-brand-cyan mb-1">
                    <User className="w-3.5 h-3.5" />
                    <span className="font-mono text-[9px] uppercase tracking-widest font-bold">Organización / Tenant</span>
                  </div>
                  <p className="font-sans text-sm text-white font-medium">{project.client}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-brand-cyan mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="font-mono text-[9px] uppercase tracking-widest font-bold">Año de Despliegue</span>
                  </div>
                  <p className="font-sans text-sm text-white font-medium">{project.year || '2026'}</p>
                </div>

                {project.services && (
                  <div className="space-y-3 lg:pt-2">
                    <div className="flex items-center gap-2 text-brand-cyan mb-1">
                      <Server className="w-3.5 h-3.5" />
                      <span className="font-mono text-[9px] uppercase tracking-widest font-bold">Capas de Arquitectura</span>
                    </div>
                    <ul className="space-y-2">
                      {project.services.map((service: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-gray-300 font-sans text-xs">
                          <ChevronRight className="w-3 h-3 text-brand-gold shrink-0" />
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {project.website && (
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={project.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-brand-cyan text-brand-dark font-mono text-xs uppercase tracking-widest font-bold hover:bg-white transition-all duration-300 flex items-center justify-center gap-2.5 rounded-sm mt-4"
                >
                  <span>Ver Deployment en Vivo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </motion.a>
              )}
            </motion.div>
          </div>

          {/* Project Description & Architecture Visuals */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-16"
            >
              <div className="space-y-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-brand-gold block font-semibold">
                  Resumen de Ingeniería
                </span>
                <h2 className="font-serif text-2xl md:text-4xl text-white">
                  Arquitectura & Despliegue en Producción
                </h2>
                <p className="font-sans text-gray-300 text-base md:text-lg leading-relaxed">
                  {project.fullDesc || project.desc}
                </p>
              </div>

              {project.gallery && project.gallery.length > 0 && (
                <div className="space-y-8">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-brand-cyan">
                    Evidencia de Ejecución & Telemetría
                  </h3>
                  {project.gallery.map((img: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      className="relative aspect-video overflow-hidden rounded-sm group border border-white/10"
                    >
                      <img
                        src={img.includes('http') || img.match(/\.(webp|jpg|jpeg|png|svg|gif)$/i) ? img : `${img}.webp`}
                        alt={`${project.title} visual ${index + 1}`}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Next Project Footer */}
      <section className="mt-36 border-t border-white/10 pt-20 px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-cyan mb-4 block">
            Siguiente Deployment
          </span>
          {(() => {
            const currentIndex = localProjects.findIndex(p => String(p.id) === String(project.id));
            const nextProject = currentIndex !== -1 
              ? localProjects[(currentIndex + 1) % localProjects.length]
              : localProjects[0];
              
            return (
              <Link to={`/portafolio/${nextProject.id}`} className="group inline-block">
                <h3 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white group-hover:text-brand-gold transition-colors duration-300 mb-6">
                  {nextProject.title}
                </h3>
                <div className="flex items-center justify-center gap-3 text-brand-gold group-hover:text-white transition-colors font-mono text-xs uppercase tracking-widest">
                  <span>Inspeccionar Arquitectura</span>
                  <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })()}
        </div>
      </section>
    </div>
  );
}
