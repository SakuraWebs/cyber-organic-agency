import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, Send, Check, CheckCircle2, X, Shield, Cpu, Terminal, ArrowRight, Layers } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

const DEPLOYMENT_OPTIONS = [
  'Despliegue de Cyber Organic AI Studio (PWA / Desktop)',
  'Integración de Living Data Engine (Telemetría en Vivo)',
  'Licencia de Micro-SaaS Serverless (Cloud Run + Vertex AI)',
  'Consulta de Arquitectura en Google Cloud'
];

export default function Contact() {
  const [searchParams] = useSearchParams();
  const tierParam = searchParams.get('tier');

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    deploymentTypes: [] as string[],
    environmentDetails: ''
  });

  // Handle tier pre-selection if routed from Services / Licensing Tiers
  useEffect(() => {
    if (tierParam) {
      const preselected: string[] = [];
      const lower = tierParam.toLowerCase();
      if (lower.includes('starter')) {
        preselected.push('Despliegue de Cyber Organic AI Studio (PWA / Desktop)');
      }
      if (lower.includes('enterprise')) {
        preselected.push('Integración de Living Data Engine (Telemetría en Vivo)');
        preselected.push('Licencia de Micro-SaaS Serverless (Cloud Run + Vertex AI)');
      }
      if (lower.includes('dedicated')) {
        preselected.push('Consulta de Arquitectura en Google Cloud');
        preselected.push('Licencia de Micro-SaaS Serverless (Cloud Run + Vertex AI)');
      }

      setFormState(prev => ({
        ...prev,
        deploymentTypes: preselected.length > 0 ? preselected : prev.deploymentTypes,
        environmentDetails: prev.environmentDetails || `Solicitud formal de aprovisionamiento para el tier: ${tierParam}.`
      }));
    }
  }, [tierParam]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateField = (name: string, value: any) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value || !value.trim()) {
          error = 'El nombre completo es requerido';
        } else if (value.trim().length < 3) {
          error = 'El nombre debe tener al menos 3 caracteres';
        }
        break;
      case 'email':
        if (!value || !value.trim()) {
          error = 'El correo corporativo es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Formato de correo corporativo no válido (ej. nombre@empresa.com)';
        }
        break;
      case 'organization':
        if (!value || !value.trim()) {
          error = 'La organización o startup es requerida';
        }
        break;
      case 'deploymentTypes':
        if (!value || value.length === 0) {
          error = 'Selecciona al menos un tipo de despliegue para la evaluación';
        }
        break;
      case 'environmentDetails':
        if (!value || !value.trim()) {
          error = 'Por favor describe los detalles de tu entorno u objetivos de arquitectura';
        } else if (value.trim().length < 15) {
          error = 'Detalla con mayor precisión tu arquitectura u objetivos (mínimo 15 caracteres)';
        }
        break;
    }
    return error;
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, (formState as any)[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (name: string, value: any) => {
    setFormState(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const toggleDeploymentType = (option: string) => {
    const nextDeployments = formState.deploymentTypes.includes(option)
      ? formState.deploymentTypes.filter(item => item !== option)
      : [...formState.deploymentTypes, option];

    handleChange('deploymentTypes', nextDeployments);
    setTouched(prev => ({ ...prev, deploymentTypes: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fieldsToValidate = ['name', 'email', 'organization', 'deploymentTypes', 'environmentDetails'];
    const newErrors: Record<string, string> = {};

    fieldsToValidate.forEach(key => {
      const error = validateField(key, (formState as any)[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched(fieldsToValidate.reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = document.getElementById(Object.keys(newErrors)[0]);
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast.error('Corrige los campos marcados para proceder con la evaluación');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Registrando solicitud de evaluación arquitectónica...');

    try {
      const payload = {
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        organization: formState.organization,
        company: formState.organization,
        deploymentTypes: formState.deploymentTypes,
        services: formState.deploymentTypes,
        environmentDetails: formState.environmentDetails,
        description: formState.environmentDetails,
        tier: tierParam || 'B2B Provisioning Portal',
        budget: 'Enterprise Architecture Evaluation',
        deadline: 'Aprovisionamiento Prioritario'
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success('Solicitud de aprovisionamiento enviada exitosamente', { id: loadingToast });
        setIsSuccess(true);
      } else {
        throw new Error('Error al procesar la solicitud en el gateway');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      toast.error('Error de comunicación con el gateway de aprovisionamiento', { id: loadingToast });
      setErrors({ submit: 'No fue posible registrar la solicitud en este momento. Intenta de nuevo o contacta directamente a info@cyberorganicagency.com.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsSuccess(false);
    setFormState({
      name: '',
      email: '',
      phone: '',
      organization: '',
      deploymentTypes: [],
      environmentDetails: ''
    });
    setErrors({});
    setTouched({});
  };

  return (
    <>
      <Helmet>
        <title>Aprovisionamiento y Acceso a la Plataforma | CYBER ORGANIC</title>
        <meta
          name="description"
          content="Conéctate con nuestro equipo técnico para desplegar instancias dedicadas, integrar agentes cognitivos o acceder al programa piloto."
        />
      </Helmet>

      <div className="pt-36 md:pt-44 pb-28 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="flex items-center gap-2 px-3 py-1 bg-brand-cyan/10 border border-brand-cyan/30 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-brand-cyan">
                PORTAL B2B & RUNTIME GATEWAY
              </span>
            </div>
            {tierParam && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-brand-gold/10 border border-brand-gold/30 rounded-full">
                <span className="font-mono text-[11px] uppercase tracking-wider text-brand-gold">
                  Tier Seleccionado: {tierParam}
                </span>
              </div>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white max-w-5xl leading-[1.1] tracking-tight"
          >
            Aprovisionamiento y Acceso a la Plataforma
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-gray-400 font-sans text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed"
          >
            Conéctate con nuestro equipo técnico para desplegar instancias dedicadas, integrar agentes cognitivos o acceder al programa piloto.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Form Container */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <form
              noValidate
              onSubmit={handleSubmit}
              className="bg-brand-surface/40 p-8 sm:p-10 md:p-12 rounded-sm border border-white/10 shadow-2xl backdrop-blur-md relative overflow-hidden"
            >
              {/* Subtle tech border gradient */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-cyan via-brand-gold to-brand-cyan opacity-80" />

              <div className="space-y-8">
                {/* Row 1: Nombre & Correo Corporativo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block font-mono text-[11px] uppercase tracking-widest text-gray-400">
                      Nombre Completo <span className="text-brand-gold">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formState.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      className={cn(
                        "w-full bg-brand-dark/70 border px-4 py-3.5 font-sans text-white text-sm focus:outline-none transition-all rounded-sm",
                        errors.name && touched.name
                          ? "border-red-500/60 focus:border-red-500 bg-red-950/10"
                          : "border-white/10 focus:border-brand-gold focus:bg-white/[0.02]"
                      )}
                      placeholder="Tu nombre completo"
                    />
                    {errors.name && touched.name && (
                      <p className="text-red-400 font-mono text-[10px] tracking-wider mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block font-mono text-[11px] uppercase tracking-widest text-gray-400">
                      Correo Corporativo (nombre@empresa.com) <span className="text-brand-gold">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formState.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      className={cn(
                        "w-full bg-brand-dark/70 border px-4 py-3.5 font-sans text-white text-sm focus:outline-none transition-all rounded-sm",
                        errors.email && touched.email
                          ? "border-red-500/60 focus:border-red-500 bg-red-950/10"
                          : "border-white/10 focus:border-brand-gold focus:bg-white/[0.02]"
                      )}
                      placeholder="nombre@empresa.com"
                    />
                    {errors.email && touched.email && (
                      <p className="text-red-400 font-mono text-[10px] tracking-wider mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: Organización / Startup & Teléfono Corporativo (Opcional) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="organization" className="block font-mono text-[11px] uppercase tracking-widest text-gray-400">
                      Organización / Startup <span className="text-brand-gold">*</span>
                    </label>
                    <input
                      id="organization"
                      type="text"
                      value={formState.organization}
                      onChange={(e) => handleChange('organization', e.target.value)}
                      onBlur={() => handleBlur('organization')}
                      className={cn(
                        "w-full bg-brand-dark/70 border px-4 py-3.5 font-sans text-white text-sm focus:outline-none transition-all rounded-sm",
                        errors.organization && touched.organization
                          ? "border-red-500/60 focus:border-red-500 bg-red-950/10"
                          : "border-white/10 focus:border-brand-gold focus:bg-white/[0.02]"
                      )}
                      placeholder="Nombre de tu organización o startup"
                    />
                    {errors.organization && touched.organization && (
                      <p className="text-red-400 font-mono text-[10px] tracking-wider mt-1">{errors.organization}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block font-mono text-[11px] uppercase tracking-widest text-gray-400">
                      Teléfono / WhatsApp Directo <span className="text-gray-500">(Opcional)</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formState.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full bg-brand-dark/70 border border-white/10 px-4 py-3.5 font-sans text-white text-sm focus:outline-none focus:border-brand-gold transition-all rounded-sm"
                      placeholder="+55 55 99181 2505"
                    />
                  </div>
                </div>

                {/* Section: Tipo de Despliegue (Checkboxes) */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-mono text-[11px] uppercase tracking-widest text-gray-300">
                      Tipo de Despliegue <span className="text-brand-gold">*</span>
                    </label>
                    <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                      Selección Múltiple
                    </span>
                  </div>

                  <div id="deploymentTypes" className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    {DEPLOYMENT_OPTIONS.map((option) => {
                      const isSelected = formState.deploymentTypes.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleDeploymentType(option)}
                          className={cn(
                            "flex items-start gap-3.5 p-4 rounded-sm border text-left transition-all duration-300 group relative",
                            isSelected
                              ? "bg-brand-cyan/10 border-brand-cyan text-white shadow-lg shadow-brand-cyan/5"
                              : "bg-brand-dark/40 border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200"
                          )}
                        >
                          <div
                            className={cn(
                              "w-4 h-4 mt-0.5 rounded-sm border flex items-center justify-center shrink-0 transition-colors",
                              isSelected
                                ? "bg-brand-cyan border-brand-cyan text-brand-dark"
                                : "border-gray-600 group-hover:border-gray-400"
                            )}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="font-mono text-xs leading-relaxed tracking-wide select-none">
                            {option}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.deploymentTypes && touched.deploymentTypes && (
                    <p className="text-red-400 font-mono text-[10px] tracking-wider mt-1">{errors.deploymentTypes}</p>
                  )}
                </div>

                {/* Section: Detalles del Entorno / Objetivos */}
                <div className="space-y-2 pt-2">
                  <label htmlFor="environmentDetails" className="block font-mono text-[11px] uppercase tracking-widest text-gray-400">
                    Detalles del Entorno / Objetivos <span className="text-brand-gold">*</span>
                  </label>
                  <textarea
                    id="environmentDetails"
                    rows={5}
                    value={formState.environmentDetails}
                    onChange={(e) => handleChange('environmentDetails', e.target.value)}
                    onBlur={() => handleBlur('environmentDetails')}
                    className={cn(
                      "w-full bg-brand-dark/70 border p-4 font-sans text-white text-sm focus:outline-none transition-all rounded-sm resize-y leading-relaxed",
                      errors.environmentDetails && touched.environmentDetails
                        ? "border-red-500/60 focus:border-red-500 bg-red-950/10"
                        : "border-white/10 focus:border-brand-gold focus:bg-white/[0.02]"
                    )}
                    placeholder="Describe tu arquitectura actual, volumen estimado de eventos y modelos de IA a integrar..."
                  />
                  {errors.environmentDetails && touched.environmentDetails && (
                    <p className="text-red-400 font-mono text-[10px] tracking-wider mt-1">{errors.environmentDetails}</p>
                  )}
                </div>

                {/* Error Banner */}
                {errors.submit && (
                  <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-sm">
                    <p className="text-red-400 font-mono text-xs leading-relaxed">{errors.submit}</p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-5 px-8 bg-brand-gold hover:bg-white text-brand-dark font-mono text-xs uppercase tracking-[0.2em] font-bold rounded-sm transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-brand-gold/10 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 animate-spin text-brand-dark" />
                        PROCESANDO EVALUACIÓN ARQUITECTÓNICA...
                      </span>
                    ) : (
                      <>
                        <span>SOLICITAR EVALUACIÓN DE ARQUITECTURA</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <div className="flex items-center justify-between text-gray-500 font-mono text-[10px] mt-3 uppercase tracking-widest px-1">
                    <span>Aislamiento de credenciales IAM</span>
                    <span>SLA de respuesta &lt; 24h</span>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Technical Info & Direct Access Channels */}
          <div className="lg:col-span-4 order-1 lg:order-2 space-y-8">
            <div className="bg-brand-surface/30 p-8 rounded-sm border border-white/5 space-y-8 sticky top-36">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-brand-cyan block mb-2">
                  CANAL DIRECTO DE INGENIERÍA
                </span>
                <h3 className="font-serif text-2xl text-white">
                  Lead Cloud Architect & R&D
                </h3>
                <p className="text-gray-400 font-sans text-xs mt-2 leading-relaxed">
                  Evaluación técnica personalizada conducida bajo estándares de certificación Google Cloud Associate Cloud Engineer (ACE).
                </p>
              </div>

              <div className="space-y-6 pt-2">
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-brand-dark border border-white/10 rounded-sm flex items-center justify-center shrink-0 group-hover:border-brand-gold transition-colors">
                    <Mail className="w-4 h-4 text-brand-gold" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] tracking-widest text-gray-500 uppercase block mb-1">
                      Correo Institucional
                    </span>
                    <a
                      href="mailto:info@cyberorganicagency.com"
                      className="font-mono text-xs text-white hover:text-brand-gold transition-colors block break-all"
                    >
                      info@cyberorganicagency.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-brand-dark border border-white/10 rounded-sm flex items-center justify-center shrink-0 group-hover:border-brand-gold transition-colors">
                    <Phone className="w-4 h-4 text-brand-gold" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] tracking-widest text-gray-500 uppercase block mb-1">
                      WhatsApp Técnico Directo
                    </span>
                    <a
                      href="https://wa.me/5555991812505"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-white hover:text-brand-gold transition-colors block"
                    >
                      +55 55 99181 2505
                    </a>
                  </div>
                </div>
              </div>

              {/* Architecture Guarantee Card */}
              <div className="border-t border-white/10 pt-6 space-y-4">
                <span className="font-mono text-[10px] tracking-widest text-brand-gold uppercase block">
                  GARANTÍAS DE DESPLIEGUE
                </span>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Shield className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                    <p className="font-sans text-xs text-gray-300">
                      <strong className="text-white font-mono text-[11px] block">Aislamiento por Tenant</strong>
                      Gobernanza con Service Accounts dedicadas y Cloud IAM.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <Cpu className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                    <p className="font-sans text-xs text-gray-300">
                      <strong className="text-white font-mono text-[11px] block">Vertex AI & Model Grounding</strong>
                      Agentes cognitivos con latencia edge optimizada y cuotas en tiempo real.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <Layers className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                    <p className="font-sans text-xs text-gray-300">
                      <strong className="text-white font-mono text-[11px] block">SLA de Alta Disponibilidad</strong>
                      99.99% uptime sobre infraestructura Google Cloud Run y Firebase Hosting.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {isSuccess && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                className="absolute inset-0 bg-brand-dark/90 backdrop-blur-xl"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-lg bg-brand-surface border border-brand-gold/30 p-10 md:p-12 rounded-sm shadow-2xl text-center overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-cyan via-brand-gold to-brand-cyan" />
                <button
                  onClick={closeModal}
                  aria-label="Cerrar modal"
                  className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative z-10 space-y-6">
                  <div className="w-16 h-16 bg-brand-gold/10 border border-brand-gold/30 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-brand-gold" />
                  </div>

                  <div className="space-y-2">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-brand-cyan block">
                      SOLICITUD REGISTRADA
                    </span>
                    <h3 className="font-serif text-3xl text-white">
                      Evaluación en Proceso
                    </h3>
                  </div>

                  <p className="font-sans text-gray-300 text-sm leading-relaxed max-w-md mx-auto">
                    Tu solicitud de aprovisionamiento ha sido remitida al equipo de arquitectura en Google Cloud. Recibirás un diagnóstico de viabilidad y esquema de despliegue en un plazo no mayor a 24 horas hábiles.
                  </p>

                  <div className="p-3 bg-brand-dark/80 border border-white/5 rounded-sm font-mono text-[11px] text-gray-400 text-left space-y-1">
                    <div><span className="text-brand-gold">Entidad:</span> {formState.organization || 'Organización'}</div>
                    <div><span className="text-brand-cyan">Módulos:</span> {formState.deploymentTypes.length} seleccionados</div>
                  </div>

                  <button
                    onClick={closeModal}
                    className="w-full py-3.5 bg-brand-gold hover:bg-white text-brand-dark font-mono text-xs uppercase tracking-widest font-bold rounded-sm transition-colors cursor-pointer"
                  >
                    ENTENDIDO
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

