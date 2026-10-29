import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import BackToTop from './components/BackToTop';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import About from './pages/About';
import LivingData from './pages/LivingData';
import AIGenerator from './pages/AIGenerator';
import ProjectDetail from './pages/ProjectDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookieConsent from './components/CookieConsent';
import Preloader from './components/Preloader';
import { AnimatePresence, motion } from 'motion/react';


import Admin from './pages/Admin';
import { Toaster } from 'react-hot-toast';

const routeMetadata: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'CYBER ORGANIC | Infraestructura Bio-Digital & Software Propietario',
    description: 'Startup tecnológica especializada en arquitecturas serverless distribuidas, Living Data Engine y Cyber Organic AI Studio con despliegues en Google Cloud y Firebase.'
  },
  '/servicios': {
    title: 'Módulos de Software e Infraestructura Escalable | CYBER ORGANIC',
    description: 'Ecosistema modular para aprovisionar productos digitales de alta exigencia, desde micro-servicios serverless hasta aplicaciones progresivas con IA integrada.'
  },
  '/nosotros': {
    title: 'Donde la Telemetría se Transforma en Inteligencia | CYBER ORGANIC',
    description: 'Desarrollamos soluciones de software autónomas mediante la unión de arquitecturas serverless de alta escala y modelos de inferencia cognitiva.'
  },
  '/portafolio': {
    title: 'Ecosistemas y Despliegues en Producción | CYBER ORGANIC',
    description: 'Casos de uso de organizaciones y marcas que operan sobre nuestra arquitectura de software y nube gestionada.'
  },
  '/living-data': {
    title: 'Living Data Engine | CYBER ORGANIC',
    description: 'Motor reactivo de ingesta y visualización de datos en tiempo real con aceleración WebGL y telemetría biomimética.'
  },
  '/ai-studio': {
    title: 'AI Studio | CYBER ORGANIC',
    description: 'Infraestructura serverless de inferencia multimodal y generación generativa impulsada por modelos fundacionales Gemini.'
  },
  '/contacto': {
    title: 'Aprovisionamiento y Acceso a la Plataforma | CYBER ORGANIC',
    description: 'Conéctate con nuestro equipo técnico para desplegar instancias dedicadas, integrar agentes cognitivos o acceder al programa piloto.'
  },
  '/admin': {
    title: 'Admin Dashboard | CYBER ORGANIC',
    description: 'Panel de administración técnica para la gestión de infraestructura, usuarios y despliegues en producción.'
  },
  '/privacidad': {
    title: 'Política de Privacidad | CYBER ORGANIC',
    description: 'Información sobre cómo manejamos y protegemos tus datos en nuestros entornos serverless.'
  },
  '/terminos': {
    title: 'Términos de Servicio | CYBER ORGANIC',
    description: 'Términos y condiciones legales para el uso de nuestra suite de software e infraestructura.'
  }
};

function DynamicMetadata() {
  const { pathname } = useLocation();
  
  // Handle dynamic routes like /portafolio/:projectId
  const isProjectDetail = pathname.startsWith('/portafolio/') && pathname.split('/').length === 3;
  
  const metadata = routeMetadata[pathname] || {
    title: isProjectDetail ? 'Deployment | CYBER ORGANIC' : 'CYBER ORGANIC',
    description: 'Startup de software e infraestructura bio-digital. SaaS distribuido, Living Data Engine y AI Studio.'
  };

  return (
    <Helmet>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta property="og:title" content={metadata.title} />
      <meta property="og:description" content={metadata.description} />
      <meta property="og:image" content={`${window.location.origin}/og-image.png`} />
      <meta name="twitter:title" content={metadata.title} />
      <meta name="twitter:description" content={metadata.description} />
      <meta name="twitter:image" content={`${window.location.origin}/og-image.png`} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
    }
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // Duration of the preloader animation

    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1A1A1A',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontFamily: 'sans-serif'
          }
        }}
      />
      <Preloader show={loading} />
      <AnimatePresence mode="wait">
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="min-h-screen bg-brand-dark flex flex-col"
          >
            
              <Router>
                <DynamicMetadata />
                <ScrollToTop />
                {!isStandalone && <Navbar />}
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={isStandalone ? <AIGenerator /> : <Home />} />
                    <Route path="/servicios" element={<Services />} />
                    <Route path="/nosotros" element={<About />} />
                    <Route path="/portafolio" element={<Portfolio />} />
                    <Route path="/portafolio/:projectId" element={<ProjectDetail />} />
                    <Route path="/living-data" element={<LivingData />} />
                    <Route path="/ai-studio" element={<AIGenerator />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/contacto" element={<Contact />} />
                    <Route path="/privacidad" element={<PrivacyPolicy />} />
                    <Route path="/terminos" element={<TermsOfService />} />
                  </Routes>
                </main>
                {!isStandalone && <Chatbot />}
                {!isStandalone && <BackToTop />}
                {!isStandalone && <CookieConsent />}
                {!isStandalone && <Footer />}
              </Router>
            
          </motion.div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );
}
