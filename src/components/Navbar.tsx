import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import Logo from './Logo';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';



const baseNavItems = [
  { name: 'INICIO', path: '/' },
  { name: 'TECNOLOGÍA', path: '/nosotros' },
  { name: 'PLATAFORMA', path: '/servicios' },
  { name: 'DEPLOYMENTS', path: '/portafolio' },
  { name: 'LIVING DATA', path: '/living-data' },
  { name: 'AI STUDIO', path: '/ai-studio' },
  { name: 'ACCESO / CONTACTO', path: '/contacto' },
];

const menuVariants = {
  closed: {
    x: '100%',
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 40,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  open: {
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 40,
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  closed: { opacity: 0, x: -100, filter: 'blur(15px)' },
  open: { 
    opacity: 1, 
    x: 0, 
    filter: 'blur(0px)',
    transition: {
      type: 'spring' as const,
      stiffness: 250,
      damping: 20
    }
  },
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const navItems = isAdmin 
    ? [...baseNavItems.slice(0, 6), { name: 'Admin', path: '/admin' }, baseNavItems[6]]
    : baseNavItems;

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-500 px-4 sm:px-6 lg:px-8 py-5',
        scrolled ? 'bg-brand-dark/85 backdrop-blur-xl border-b border-white/5 py-3.5' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center shrink-0">
          <Logo />
        </Link>

        {/* Desktop Menu (hidden on mobile and tablet, visible on xl screens) */}
        <div className="hidden xl:flex items-center space-x-1 2xl:space-x-2">
          {navItems.map((item) => (
            <motion.div
              key={item.path}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Link
                to={item.path}
                className={cn(
                  'px-2.5 py-1.5 2xl:px-3.5 2xl:py-2 rounded-full text-[11px] 2xl:text-xs uppercase tracking-[0.14em] font-medium transition-all duration-300 border whitespace-nowrap inline-flex items-center justify-center select-none',
                  location.pathname === item.path
                    ? 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                    : 'text-gray-300 border-transparent hover:text-white hover:bg-white/5'
                )}
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile & Tablet Hamburger Toggle */}
        <div className="xl:hidden flex items-center gap-3">
          <button 
            className={cn(
              "p-2 text-white/90 hover:text-brand-cyan hover:bg-white/5 rounded-lg border border-white/10 transition-colors duration-200", 
              isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            )} 
            onClick={() => setIsOpen(true)}
            aria-label="Abrir Menu de Navegação"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Background Overlay */}
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#0B0D14]/80 z-40 xl:hidden"
            />
            
            {/* Menu Drawer Content */}
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 h-full w-[85vw] max-w-sm sm:max-w-md bg-brand-surface border-l border-white/10 p-6 sm:p-8 md:p-10 z-50 xl:hidden shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex justify-end mb-8">
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: 0.15 }}
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-colors"
                    aria-label="Fechar Menu"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.button>
                </div>

                <div className="flex flex-col space-y-4 sm:space-y-5">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.path}
                      variants={itemVariants}
                      whileHover={{ x: 6 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'text-sm sm:text-base md:text-lg font-sans tracking-[0.1em] font-medium flex items-center whitespace-nowrap transition-colors duration-200 group py-1.5',
                          location.pathname === item.path ? 'text-brand-cyan' : 'text-gray-300 hover:text-white'
                        )}
                      >
                        <span className="text-[11px] font-mono tracking-wider text-brand-cyan/80 mr-3 px-2 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/20 shrink-0">
                          0{index + 1}
                        </span>
                        <span className="whitespace-nowrap">{item.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div 
                variants={itemVariants}
                className="mt-8 pt-6 border-t border-white/10"
              >
                <p className="font-sans text-[10px] tracking-widest text-gray-500 uppercase mb-2 whitespace-nowrap">ACCESO / CONTACTO</p>
                <a href="mailto:info@cyberorganicagency.com" className="font-sans text-xs sm:text-sm text-brand-gold hover:text-brand-cyan transition-colors block truncate">
                  info@cyberorganicagency.com
                </a>
                <a href="https://wa.me/5555991812505" target="_blank" rel="noopener noreferrer" className="font-sans text-xs sm:text-sm text-brand-gold hover:text-brand-cyan transition-colors block mt-1 whitespace-nowrap">
                  +55 55 99181 2505
                </a>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
