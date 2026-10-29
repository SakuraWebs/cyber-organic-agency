import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/src/lib/utils';
import { Facebook, ArrowUpRight, Share2, Linkedin as LinkedinIcon, Loader2, Cpu, Server, Activity, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { projects as localProjects, ProjectDeployment } from '../data/projects';
import ProjectModal from '../components/ProjectModal';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z" />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const categories = [
  'TODOS LOS DEPLOYMENTS',
  'AGENTES COGNITIVOS & IA',
  'APLICACIONES PWA / RUNTIME',
  'SERVERLESS CLUSTER'
];

function ProjectCard({ project, onOpen }: { project: any, onOpen: (project: any) => void }) {
  const [showShare, setShowShare] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Intersection Observer for lazy loading
  const isInView = useInView(containerRef, { once: true, margin: "300px 0px" });
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const [deviceParams, setDeviceParams] = useState({ offset: 15, scale: 1.3 });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1024) {
        setDeviceParams({ offset: 25, scale: 1.5 });
      } else if (w >= 768) {
        setDeviceParams({ offset: 15, scale: 1.3 });
      } else {
        setDeviceParams({ offset: 8, scale: 1.16 });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const y = useTransform(scrollYProgress, [0, 1], [`-${deviceParams.offset}%`, `${deviceParams.offset}%`]);

  const cardVariants = {
    initial: { y: 0 },
    hover: { y: -8 }
  };

  const shareMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShare(false);
      }
    }

    if (showShare) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShare]);

  return (
    <motion.div
      ref={containerRef}
      layout
      initial="initial"
      whileHover="hover"
      variants={cardVariants}
      style={{ position: 'relative' }}
      className="group relative overflow-hidden rounded-sm bg-brand-surface border border-white/10 hover:border-brand-cyan/40 transition-colors duration-500 flex flex-col justify-between min-h-[480px]"
    >
      {/* Background Media with Parallax */}
      <div className="absolute inset-0 overflow-hidden bg-brand-dark/60">
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-brand-surface/80 backdrop-blur-sm">
            <Loader2 className="w-6 h-6 text-brand-cyan animate-spin opacity-70" />
          </div>
        )}
        {isInView && (
          <motion.img
            style={{ y, scale: deviceParams.scale }}
            src={project.image.includes('http') || project.image.match(/\.(webp|jpg|jpeg|png|svg|gif)$/i) ? project.image : `${project.image}.webp`}
            alt={project.alt || project.title}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            className={cn(
              "w-full h-full object-cover transition-all duration-1000 ease-out",
              isLoaded ? "opacity-35 grayscale blur-none group-hover:grayscale-0 group-hover:opacity-55" : "opacity-0 blur-xl grayscale"
            )}
            referrerPolicy="no-referrer"
          />
        )}
      </div>

      {/* Cybernetic Dark Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/75 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-brand-dark/90 pointer-events-none" />

      {/* Top Header: Category & Share */}
      <div className="relative z-20 p-6 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 px-2.5 py-1 rounded-sm w-fit flex items-center gap-1.5">
            <Server className="w-2.5 h-2.5" />
            {project.category}
          </span>
          {project.scope && (
            <span className="font-mono text-[8.5px] uppercase tracking-wider text-brand-gold/90 font-medium">
              {project.scope}
            </span>
          )}
        </div>

        {/* Share Button & Popover */}
        <div ref={shareMenuRef} className="relative flex flex-col items-end">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowShare(!showShare);
            }}
            className="w-8 h-8 rounded-full bg-brand-dark/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-400 hover:text-brand-cyan hover:border-brand-cyan/50 transition-all duration-300"
            title="Compartir Deployment"
          >
            <Share2 className="w-3.5 h-3.5" />
          </motion.button>

          <AnimatePresence>
            {showShare && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 top-10 z-30 flex flex-col gap-2 p-2 bg-brand-surface/95 backdrop-blur-md border border-white/10 rounded-sm shadow-xl"
              >
                {[
                  { icon: Facebook, name: 'Facebook', url: (u: string) => `https://www.facebook.com/sharer/sharer.php?u=${u}` },
                  { icon: XIcon, name: 'X', url: (u: string) => `https://twitter.com/intent/tweet?url=${u}` },
                  { icon: WhatsAppIcon, name: 'WhatsApp', url: (u: string) => `https://api.whatsapp.com/send?text=${encodeURIComponent('Deployment en producción de CYBER ORGANIC: ' + u)}` },
                  { icon: LinkedinIcon, name: 'LinkedIn', url: (u: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
                ].map((social) => (
                  <button
                    key={social.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      const shareUrl = window.location.origin + project.link;
                      window.open(social.url(shareUrl), '_blank');
                    }}
                    className="w-7 h-7 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-cyan hover:text-brand-dark transition-all duration-200"
                    title={`Compartir en ${social.name}`}
                  >
                    <social.icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Content: Title, Description, Metrics, CTA */}
      <div className="relative z-20 p-6 pt-0 mt-auto flex flex-col justify-end">
        <h3 className="font-serif text-2xl text-white mb-2 group-hover:text-brand-gold transition-colors duration-300">
          {project.title}
        </h3>
        
        <p className="font-sans text-gray-300/90 text-xs leading-relaxed mb-4">
          {project.desc}
        </p>

        {/* Technical Metrics Pill */}
        {project.metrics && (
          <div className="flex flex-wrap items-center gap-2 mb-5 pt-3 border-t border-white/10 font-mono text-[10px] text-gray-400">
            {project.metrics.uptime && (
              <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-sm">
                <Activity className="w-3 h-3" /> {project.metrics.uptime} SLA
              </span>
            )}
            {project.metrics.latency && (
              <span className="flex items-center gap-1 text-brand-cyan bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded-sm">
                <Cpu className="w-3 h-3" /> {project.metrics.latency}
              </span>
            )}
            {project.metrics.vitals && (
              <span className="flex items-center gap-1 text-amber-300 bg-amber-950/40 border border-amber-500/20 px-2 py-0.5 rounded-sm">
                <ShieldCheck className="w-3 h-3" /> Vitals {project.metrics.vitals}
              </span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => onOpen(project)}
            className="inline-flex items-center gap-2 text-brand-gold font-mono text-[10px] uppercase tracking-widest hover:text-white transition-colors group/btn"
          >
            <span>Inspeccionar Arquitectura</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </button>
          
          <span className="font-mono text-[10px] text-gray-500">
            {project.year || '2026'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('TODOS LOS DEPLOYMENTS');
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allProjects, setAllProjects] = useState<any[]>(localProjects);

  useEffect(() => {
    const fetchFirestoreProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const firestoreProjects: any[] = [];
        querySnapshot.forEach((doc) => {
          firestoreProjects.push({ id: doc.id, ...doc.data() });
        });
        firestoreProjects.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setAllProjects([...localProjects, ...firestoreProjects]);
      } catch (error) {
        console.error("Error fetching projects from Firestore:", error);
      }
    };
    fetchFirestoreProjects();
  }, []);

  const filteredProjects = allProjects.filter((p) => {
    if (activeCategory === 'TODOS LOS DEPLOYMENTS') return true;
    const cat = (p.category || '').toUpperCase();
    return cat === activeCategory || cat.includes(activeCategory);
  });

  const displayedProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setVisibleCount(prev => prev + 3);
    setIsLoadingMore(false);
  };

  const handleOpenModal = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
    setTimeout(() => setSelectedProject(null), 400);
  };

  return (
    <div className="pt-36 pb-28 px-6 md:px-12 max-w-7xl mx-auto">
      <Helmet>
        <title>Ecosistemas y Despliegues en Producción | CYBER ORGANIC</title>
        <meta name="description" content="Casos de uso de organizaciones y marcas que operan sobre nuestra arquitectura de software y nube gestionada." />
        <meta property="og:title" content="Ecosistemas y Despliegues en Producción | CYBER ORGANIC" />
        <meta property="og:description" content="Casos de uso de organizaciones y marcas que operan sobre nuestra arquitectura de software y nube gestionada." />
      </Helmet>

      {/* Header Section */}
      <header className="mb-20 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full font-mono text-[10px] uppercase tracking-widest text-brand-cyan mb-6"
        >
          <Server className="w-3 h-3" />
          <span>Infraestructura Distribuida & Casos de Producción</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl text-white mb-6 leading-tight"
        >
          Ecosistemas y Despliegues <span className="italic text-brand-gold">en Producción</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-sans text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-12"
        >
          Casos de uso de organizaciones y marcas que operan sobre nuestra arquitectura de software y nube gestionada.
        </motion.p>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 p-2 bg-brand-surface/60 backdrop-blur-md border border-white/10 rounded-sm max-w-3xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setVisibleCount(6);
              }}
              className={cn(
                'font-mono text-[10px] md:text-[11px] tracking-wider uppercase transition-all duration-300 px-4 py-2.5 rounded-sm border',
                activeCategory === cat 
                  ? 'bg-brand-cyan/15 text-brand-cyan border-brand-cyan/50 shadow-sm shadow-brand-cyan/20 font-semibold' 
                  : 'text-gray-400 border-transparent hover:text-white hover:bg-white/5'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Grid of Deployments */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
      >
        {displayedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} onOpen={handleOpenModal} />
        ))}
      </motion.div>

      {/* Empty State if filter returns none */}
      {displayedProjects.length === 0 && (
        <div className="text-center py-20 border border-white/5 rounded-sm bg-brand-surface/30">
          <p className="font-mono text-sm text-gray-400">No se encontraron deployments en esta categoría de arquitectura.</p>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className={cn(
              "px-10 py-4 border border-brand-gold text-brand-gold font-mono text-[11px] uppercase tracking-[0.25em] hover:bg-brand-gold hover:text-brand-dark transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 rounded-sm shadow-lg shadow-brand-gold/10",
              isLoadingMore && "bg-brand-gold/10"
            )}
          >
            {isLoadingMore ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-brand-dark/20 border-t-brand-dark rounded-full animate-spin" />
                <span>Consultando Registros...</span>
              </>
            ) : (
              'Cargar Más Deployments'
            )}
          </motion.button>
        </div>
      )}

      {/* Project Modal with Technical Specs */}
      <ProjectModal 
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
