export interface ProjectDeployment {
  id: number | string;
  title: string;
  scope: string; // Architectural Scope
  category: 'AGENTES COGNITIVOS & IA' | 'APLICACIONES PWA / RUNTIME' | 'SERVERLESS CLUSTER';
  image: string;
  desc: string;
  metaTitle: string;
  metaDesc: string;
  alt: string;
  link: string;
  fullDesc: string;
  client: string;
  website?: string;
  year: string;
  services: string[]; // Capas de arquitectura
  metrics?: {
    uptime?: string;
    latency?: string;
    stack?: string;
    vitals?: string;
  };
  gallery: string[];
}

export const projects: ProjectDeployment[] = [
  {
    id: 1,
    title: 'Rancho Branco',
    scope: 'RUNTIME TRANSACCIONAL & TURISMO BIO-DIGITAL',
    category: 'APLICACIONES PWA / RUNTIME',
    image: 'https://ranchobranco.com.br/1.1.jpeg',
    desc: 'Plataforma distribuida para tráfico estacional concurrente y Core Web Vitals en móviles.',
    metaTitle: 'Rancho Branco | Runtime Transaccional & PWA | CYBER ORGANIC',
    metaDesc: 'Deployment de runtime transaccional desacoplado y PWA distribuida en Google Cloud para Rancho Branco con 100/100 en Core Web Vitals.',
    alt: 'Arquitectura de software y runtime PWA para Rancho Branco',
    link: '/portafolio/1',
    fullDesc: 'Plataforma distribuida diseñada para soportar picos de tráfico estacional concurrente sin degradación de rendimiento. Implementada sobre un runtime PWA desacoplado con edge caching en la red global de Google Cloud, garantizando una calificación 100/100 en Core Web Vitals en dispositivos móviles de baja conectividad y alta latencia perimetral.',
    client: 'Rancho Branco Eco-Resort',
    website: 'https://ranchobranco.com.br',
    year: '2026',
    services: [
      'Runtime PWA Distribuido',
      'Edge Caching en Google Cloud',
      'Optimización Core Web Vitals 100/100',
      'Procesamiento Transaccional Concurrente',
      'Aislamiento de Carga Móvil'
    ],
    metrics: {
      uptime: '99.99%',
      latency: '< 45ms',
      stack: 'PWA · Google CDN · Cloud Run · Web Vitals',
      vitals: '100/100'
    },
    gallery: [
      'https://ranchobranco.com.br/1.1.jpeg',
      'https://ranchobranco.com.br/1.2.jpeg',
      'https://picsum.photos/seed/ranch-tech-1/1200/800'
    ]
  },
  {
    id: 2,
    title: 'Atalaya 24',
    scope: 'MONITOREO CRÍTICO & BACKEND SERVERLESS',
    category: 'SERVERLESS CLUSTER',
    image: 'https://atalaya24.com/wp-content/uploads/2026/01/ELIAS.webp',
    desc: 'Arquitectura de alta disponibilidad sobre Cloud Run y Firebase con respuesta inferior a 100ms.',
    metaTitle: 'Atalaya 24 | Monitoreo Crítico & Backend Serverless | CYBER ORGANIC',
    metaDesc: 'Deployment serverless de alta disponibilidad para Atalaya 24 sobre Google Cloud Run y Firebase, con respuesta <100ms y nodo cognitivo ELIAS.',
    alt: 'Arquitectura serverless de alta disponibilidad para Atalaya 24',
    link: '/portafolio/2',
    fullDesc: 'Arquitectura de alta disponibilidad y tolerancia a fallos diseñada para monitoreo crítico perimetral y seguridad distribuida. Implementada mediante microservicios serverless en Google Cloud Run y Firebase Firestore en tiempo real, operando con cuotas de inferencia biométrica a través del nodo cognitivo ELIAS y manteniendo tiempos de respuesta inferiores a 100ms bajo alta concurrencia transfronteriza.',
    client: 'Atalaya 24 Security Systems',
    website: 'https://atalaya24.com',
    year: '2026',
    services: [
      'Microservicios en Google Cloud Run',
      'Base de Datos Reactiva Firebase Firestore',
      'Nodo Cognitivo ELIAS & Inferencia Perimetral',
      'Gobernanza IAM & Cloud Logging',
      'SLA 99.99% en Producción'
    ],
    metrics: {
      uptime: '99.99%',
      latency: '< 80ms',
      stack: 'Cloud Run · Firebase · Vertex AI · IAM',
      vitals: '99/100'
    },
    gallery: [
      'https://atalaya24.com/wp-content/uploads/2026/03/avatar-elias.webp',
      'https://atalaya24.com/wp-content/uploads/2026/03/Logo-Atalaya24-Transparente-e1773704261258.webp',
      '/Atalaya3.jpeg'
    ]
  },
  {
    id: 3,
    title: 'Verdant AI',
    scope: 'ORQUESTACIÓN COGNITIVA & DATA FLOW',
    category: 'AGENTES COGNITIVOS & IA',
    image: 'https://picsum.photos/seed/green-tech/800/800',
    desc: 'Flujo de procesamiento semántico en tiempo real integrado con Living Data Engine.',
    metaTitle: 'Verdant AI | Orquestación Cognitiva & Data Flow | CYBER ORGANIC',
    metaDesc: 'Deployment de orquestación cognitiva en Vertex AI integrado con Living Data Engine para telemetría ambiental y análisis semántico continuo.',
    alt: 'Pipeline de inferencia y orquestación semántica para Verdant AI',
    link: '/portafolio/3',
    fullDesc: 'Pipeline de orquestación cognitiva continua para procesamiento de datos no estructurados y análisis semántico multimodal. Integrado directamente con el Living Data Engine para visualización reactiva y telemetría de eventos biológicos y climáticos, alimentado por agentes de Vertex AI con grounding determinista y cero alucinaciones operativas.',
    client: 'Verdant Solutions Global',
    year: '2025',
    services: [
      'Living Data Engine Runtime',
      'Orquestación de Agentes en Vertex AI',
      'Pipeline Semántico Multimodal',
      'Telemetry Ingestion & Grounding',
      'Aceleración WebGL'
    ],
    metrics: {
      uptime: '99.95%',
      latency: '< 120ms',
      stack: 'Vertex AI · Living Data Engine · Python · WebGL',
      vitals: '100/100'
    },
    gallery: [
      'https://picsum.photos/seed/green-1/1200/800',
      'https://picsum.photos/seed/green-2/1200/800'
    ]
  },
  {
    id: 4,
    title: 'Cyber Organic AI Studio',
    scope: 'INFERENCIA MULTIMODAL & RUNTIME GENERATIVO',
    category: 'AGENTES COGNITIVOS & IA',
    image: 'https://picsum.photos/seed/ai-studio-runtime/1200/800',
    desc: 'Micro-SaaS serverless con streaming de tokens, control de cuotas y pipeline de visión sintética.',
    metaTitle: 'AI Studio | Runtime Generativo Serverless | CYBER ORGANIC',
    metaDesc: 'Infraestructura serverless para inferencia multimodal de alta velocidad con modelos Gemini y SDK @google/genai.',
    alt: 'Plataforma de inferencia generativa Cyber Organic AI Studio',
    link: '/ai-studio',
    fullDesc: 'Infraestructura serverless de generación multimodal operando bajo el SDK @google/genai sobre Google Cloud. Incorpora streaming perimetral de tokens, persistencia reactiva en Firebase Firestore, control estricto de cuotas por usuario y exportación en tiempo real para flujos de trabajo de ingeniería cognitiva.',
    client: 'Cyber Organic Core Labs',
    year: '2026',
    services: [
      'Streaming de Inferencia Perimetral',
      'Orquestación de Modelos Fundacionales',
      'Persistencia Reactiva en Firestore',
      'Autenticación Federada Google Identity'
    ],
    metrics: {
      uptime: '99.99%',
      latency: '< 65ms',
      stack: 'Gemini 2.5 · Firestore · Cloud Run · TypeScript',
      vitals: '100/100'
    },
    gallery: [
      'https://picsum.photos/seed/ai-studio-gallery-1/1200/800',
      'https://picsum.photos/seed/ai-studio-gallery-2/1200/800'
    ]
  },
  {
    id: 5,
    title: 'Nexus Cloud Engine',
    scope: 'ARQUITECTURA MULTI-TENANT & AUTO-ESCALADO',
    category: 'SERVERLESS CLUSTER',
    image: 'https://picsum.photos/seed/cloud/800/800',
    desc: 'Cluster elástico sobre Cloud Run con aislamiento de inquilinos y observabilidad en Cloud Logging.',
    metaTitle: 'Nexus Cloud Engine | Cluster Serverless Multi-Tenant | CYBER ORGANIC',
    metaDesc: 'Arquitectura de microservicios distribuida con auto-escalado a cero y observabilidad avanzada con Google Cloud Logging.',
    alt: 'Despliegue de cluster elástico serverless Nexus Cloud',
    link: '/portafolio/5',
    fullDesc: 'Solución de arquitectura en la nube para organizaciones con cargas de trabajo variables. Incorpora despliegue de contenedores en Google Cloud Run con escala automática a cero para optimización de costes, segregación lógica de datos mediante reglas de seguridad de Firestore y telemetría de rendimiento centralizada en Cloud Logging.',
    client: 'Nexus Systems Ltd.',
    year: '2025',
    services: [
      'Arquitectura Serverless Multi-Tenant',
      'Escala a Cero en Google Cloud Run',
      'Gobernanza de Identidad & IAM',
      'Pipeline de Observabilidad Centralizada'
    ],
    metrics: {
      uptime: '99.99%',
      latency: '< 70ms',
      stack: 'Cloud Run · Cloud Logging · Python · Firestore',
      vitals: '98/100'
    },
    gallery: [
      'https://picsum.photos/seed/cloud-1/1200/800',
      'https://picsum.photos/seed/cloud-2/1200/800'
    ]
  },
  {
    id: 6,
    title: 'Living Data Sensory Runtime',
    scope: 'TELEMETRÍA REACTIVA & PROCESAMIENTO DISTRIBUIDO',
    category: 'APLICACIONES PWA / RUNTIME',
    image: 'https://picsum.photos/seed/quantum/1200/800',
    desc: 'Ingesta continua de eventos de red y aceleración WebGL perimetral con sincronización en tiempo real.',
    metaTitle: 'Living Data Sensory Runtime | Telemetría Reactiva | CYBER ORGANIC',
    metaDesc: 'Motor de telemetría de eventos reactivos y visualización biomimética con aceleración WebGL perimetral.',
    alt: 'Runtime de telemetría y procesamiento de datos Living Data',
    link: '/living-data',
    fullDesc: 'Motor de telemetría y visualización biomimética acelerado por WebGL y Shaders GLSL. Procesa flujos de eventos de red y telemetría de interacción en el borde, actualizando parámetros visuales dinámicos a 60 FPS sin sobrecargar el hilo principal de ejecución ni la CPU del dispositivo.',
    client: 'Cyber Organic R&D',
    year: '2026',
    services: [
      'Ingesta de Telemetría Perimetral',
      'Shaders GLSL & Aceleración WebGL',
      'Pipeline Reactivo sin Bloqueo',
      'Compilación PWA Standalone'
    ],
    metrics: {
      uptime: '100%',
      latency: '< 16ms (60 FPS)',
      stack: 'Three.js / WebGL · GLSL · Web Workers · PWA',
      vitals: '100/100'
    },
    gallery: [
      'https://picsum.photos/seed/quantum-1/1200/800',
      'https://picsum.photos/seed/quantum-2/1200/800'
    ]
  }
];
