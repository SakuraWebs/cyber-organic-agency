/**
 * Cyber Organic - Cognitive & Architectural Knowledge Engine
 * 
 * Provides rich, pedagogical, and technically authoritative responses
 * about Bio-Digital Infrastructure, Living Data Engine, Vertex AI Cognitive Agents,
 * Serverless Architecture, and Licensing Tiers.
 * 
 * Supports Portuguese, Spanish, and English seamlessly.
 * Facilitates direct in-chat lead capture and 1-click WhatsApp/Email
 * without sending users away to footers or distant contact pages.
 */

export interface AssistantOption {
  label: string;
  href?: string;
  action?: 'in_chat_contact' | 'whatsapp' | 'email';
  messagePrefill?: string;
}

export interface CognitiveResponse {
  text: string;
  options?: AssistantOption[];
  showContactForm?: boolean;
  contactPrefill?: string;
}

// Detect language from prompt
function detectLanguage(text: string): 'pt' | 'es' | 'en' {
  const lower = text.toLowerCase();
  
  // Portuguese specific markers
  const ptSignals = [
    'você', 'voce', 'não', 'nao', 'o que é', 'o que e', 'como funciona', 'quais são',
    'quais sao', 'olá', 'ola', 'obrigado', 'obrigada', 'bom dia', 'boa tarde',
    'boa noite', 'também', 'tambem', 'está', 'esta', 'preço', 'preco', 'orçamento',
    'orcamento', 'quem criou', 'quem é', 'quem e', 'desenvolvido', 'funciona',
    'diferença', 'diferenca', 'pode me', 'gostaria', 'quero', 'ajudar', 'por que',
    'por quê', 'entender', 'explicar', 'empresa', 'serviços', 'servicos', 'licença',
    'licenca', 'módulos', 'modulos', 'dados vivos', 'rede', 'nuvem', 'nuvens',
    'falar', 'contato', 'contatar', 'conversar', 'chamar', 'reunião', 'reuniao'
  ];

  // English markers
  const enSignals = [
    'what is', 'how does', 'tell me about', 'hello', 'hi', 'pricing', 'who is',
    'cloud architect', 'serverless', 'license', 'features', 'explain', 'why', 'contact'
  ];

  for (const signal of ptSignals) {
    if (lower.includes(signal)) return 'pt';
  }

  for (const signal of enSignals) {
    if (lower.includes(signal)) return 'en';
  }

  return 'es'; // default to Spanish
}

export function generateCognitiveResponse(userPrompt: string): CognitiveResponse {
  const prompt = userPrompt.trim().toLowerCase();
  const lang = detectLanguage(prompt);

  // 0. DIRECT CONTACT, WHATSAPP, EMAIL, CALL, CONSULTATION INTENT (HIGHEST PRIORITY)
  if (
    prompt.includes('contato') ||
    prompt.includes('contacto') ||
    prompt.includes('falar com') ||
    prompt.includes('conversar com') ||
    prompt.includes('whatsapp') ||
    prompt.includes('zap') ||
    prompt.includes('telefone') ||
    prompt.includes('telefono') ||
    prompt.includes('email') ||
    prompt.includes('e-mail') ||
    prompt.includes('reuniao') ||
    prompt.includes('reunião') ||
    prompt.includes('reunión') ||
    prompt.includes('agendar') ||
    prompt.includes('atendimento') ||
    prompt.includes('como contratar') ||
    prompt.includes('como entro em contato') ||
    prompt.includes('como contactar') ||
    prompt.includes('como falar')
  ) {
    if (lang === 'pt') {
      return {
        text: `🤝 **Canais de Contato Direto & Aprovisionamento**

Você não precisa sair desta conversa nem navegar até o rodapé para falar conosco! Temos canais diretos e imediatos com a nossa liderança de engenharia:

💬 **WhatsApp Direto com o Fundador:**
Conecte-se em tempo real com **Enrique Rolando Fernandez Manas** (Lead Cloud Architect) para tirar dúvidas de arquitetura, prazos e viabilidade.

📝 **Mensagem Rápida no Próprio Chat:**
Você pode preencher o formulário interativo abaixo diretamente nesta janela. O chamado é enviado instantaneamente para a nossa equipe técnica com prioridade de resposta.

✉️ **E-mail Corporativo Direto:**
\`enrique.rfm@gmail.com\` | \`info@cyberorganicagency.com\`

Qual canal você prefere utilizar agora?`,
        options: [
          { 
            label: '💬 Falar no WhatsApp com Enrique', 
            action: 'whatsapp', 
            href: 'https://wa.me/5555991812505?text=Ol%C3%A1%20Enrique,%20estou%20conversando%20com%20o%20assistente%20virtual%20da%20Cyber%20Organic%20e%20gostaria%20de%20conversar%20diretamente.' 
          },
          { 
            label: '📝 Enviar Mensagem Rápida no Chat', 
            action: 'in_chat_contact',
            messagePrefill: 'Gostaria de agendar uma conversa técnica sobre arquitetura e agentes de IA.' 
          },
          { 
            label: '✉️ Enviar E-mail Direto', 
            action: 'email', 
            href: 'mailto:enrique.rfm@gmail.com?subject=Consulta%20de%20Arquitetura%20-%20Cyber%20Organic' 
          },
          { 
            label: '📄 Abrir Portal B2B Completo ↗', 
            href: '/contacto' 
          }
        ],
        showContactForm: true,
        contactPrefill: 'Gostaria de agendar uma conversa técnica sobre arquitetura e agentes de IA.'
      };
    }

    return {
      text: `🤝 **Canales de Contacto Directo y Aprovisionamiento**

¡No necesitas salir de esta conversación ni desplazarte al pie de página para comunicarte con nosotros! Ponemos a tu disposición vías directas con nuestro equipo de ingeniería:

💬 **WhatsApp Directo con el Fundador:**
Comunícate en tiempo real con **Enrique Rolando Fernandez Manas** (Lead Cloud Architect) para resolver requerimientos técnicos, cotizaciones y tiempos.

📝 **Mensaje Rápido en el Chat:**
Puedes completar el formulario interactivo aquí abajo directamente en esta ventana. Tu requerimiento se remitirá de inmediato a nuestro equipo técnico.

✉️ **Correo Corporativo Directo:**
\`enrique.rfm@gmail.com\` | \`info@cyberorganicagency.com\`

¿Cómo deseas conectar ahora?`,
      options: [
        { 
          label: '💬 Hablar por WhatsApp con Enrique', 
          action: 'whatsapp', 
          href: 'https://wa.me/5555991812505?text=Hola%20Enrique,%20estoy%20conversando%20con%20el%20asistente%20virtual%20de%20Cyber%20Organic%20y%20quisiera%20hacerte%20una%20consulta.' 
        },
        { 
          label: '📝 Enviar Mensaje Rápido en el Chat', 
          action: 'in_chat_contact',
          messagePrefill: 'Quisiera agendar una consulta técnica sobre arquitectura cloud y agentes de IA.' 
        },
        { 
          label: '✉️ Enviar Correo Directo', 
          action: 'email', 
          href: 'mailto:enrique.rfm@gmail.com?subject=Consulta%20de%20Arquitectura%20-%20Cyber%20Organic' 
        },
        { 
          label: '📄 Abrir Portal B2B Completo ↗', 
          href: '/contacto' 
        }
      ],
      showContactForm: true,
      contactPrefill: 'Quisiera agendar una consulta técnica sobre arquitectura cloud y agentes de IA.'
    };
  }

  // 1. INFRAESTRUCTURA BIO-DIGITAL
  if (
    prompt.includes('bio-digital') ||
    prompt.includes('biodigital') ||
    (prompt.includes('infraestructura') && (prompt.includes('qué') || prompt.includes('que') || prompt.includes('diferencia'))) ||
    (prompt.includes('infraestrutura') && (prompt.includes('o que') || prompt.includes('como') || prompt.includes('diferença'))) ||
    prompt.includes('web tradicional') ||
    prompt.includes('estática') ||
    prompt.includes('estatica')
  ) {
    if (lang === 'pt') {
      return {
        text: `🌱 **O que é a Infraestrutura Bio-Digital e por que ela supera uma web tradicional?**

Uma **infraestrutura bio-digital** é uma arquitetura de software desacoplada na qual as interfaces e os serviços perimetrais (Edge) reagem em tempo real à telemetria do usuário, comportando-se com a adaptabilidade e resiliência de um **organismo vivo**.

💡 **A analogia para entender fácil:**
- **Uma página web tradicional** é como um *cartaz impresso*: estático, monolítico, com tempo de carregamento lento e incapaz de perceber quem o está visualizando.
- **A Infraestrutura Bio-Digital de Cyber Organic** é como um *ecossistema inteligente*: detecta em milissegundos o comportamento e o dispositivo do visitante, reconfigura o consumo de recursos na borda e entrega dados ultra-otimizados.

⚡ **Vantagens de Engenharia:**
1. **Latência perimetral ultra-baixa (<80ms):** Edge Caching global distribuído na rede da Google.
2. **Core Web Vitals 100/100:** Carregamento instantâneo em qualquer conexão móvel.
3. **Arquitetura Headless:** O front-end é totalmente independente do backend, garantindo segurança perimetral máxima e zero impacto em falhas centrais.

Você pode acompanhar a telemetria ao vivo ou solicitar uma avaliação de arquitetura diretamente aqui:`,
        options: [
          { label: 'Ver Living Data em Tempo Real ↗', href: '/living-data' },
          { label: 'Ver Arquitetura e Módulos ↗', href: '/tecnologia' },
          { 
            label: '💬 Falar com o Arquiteto (WhatsApp)', 
            action: 'whatsapp', 
            href: 'https://wa.me/5555991812505?text=Ol%C3%A1%20Enrique,%20gostaria%20de%20conversar%20sobre%20Infraestrutura%20Bio-Digital.' 
          },
          { 
            label: '📝 Solicitar Avaliação no Chat', 
            action: 'in_chat_contact',
            messagePrefill: 'Quero avaliar a migração de um site tradicional para Infraestrutura Bio-Digital.' 
          }
        ]
      };
    }

    return {
      text: `🌱 **¿Qué es la Infraestructura Bio-Digital y en qué se diferencia de una web tradicional?**

Una **infraestructura bio-digital** es una arquitectura de software desacoplado donde la interfaz y los servicios perimetrales (Edge) reaccionan en tiempo real a la telemetría del usuario, comportándose con la adaptabilidad y dinamismo de un **organismo vivo**.

💡 **La analogía clave para comprenderlo:**
- **Un sitio web tradicional** es como un *cartel impreso*: estático, pesado, con tiempos de respuesta lentos e insensible al contexto del visitante.
- **La Infraestructura Bio-Digital de Cyber Organic** es como un *sistema nervioso digital*: percibe la interacción del usuario en tiempo real, distribuye la carga en microservicios serverless y entrega una experiencia fluida e instantánea.

⚡ **Diferenciales de Ingeniería:**
1. **Latencia perimetral ultra-baja (<80ms):** Edge Caching en la red mundial de Google.
2. **Puntuación 100/100 en Core Web Vitals:** Optimización radical para móviles.
3. **Arquitectura Headless & Serverless:** Front-end desacoplado, sin servidores ociosos y con escalabilidad automática.`,
      options: [
        { label: 'Ver Living Data en Vivo ↗', href: '/living-data' },
        { label: 'Conocer Módulos de Software ↗', href: '/tecnologia' },
        { 
          label: '💬 Hablar con el Arquitecto (WhatsApp)', 
          action: 'whatsapp', 
          href: 'https://wa.me/5555991812505?text=Hola%20Enrique,%20quisiera%20consultar%20sobre%20Infraestructura%20Bio-Digital.' 
        },
        { 
          label: '📝 Solicitar Evaluación en el Chat', 
          action: 'in_chat_contact',
          messagePrefill: 'Quiero evaluar la migración hacia una Infraestructura Bio-Digital.' 
        }
      ]
    };
  }

  // 2. LIVING DATA ENGINE
  if (
    prompt.includes('living data') ||
    prompt.includes('dados vivos') ||
    prompt.includes('telemetria') ||
    prompt.includes('telemetría') ||
    prompt.includes('tempo real') ||
    prompt.includes('tiempo real')
  ) {
    if (lang === 'pt') {
      return {
        text: `⚡ **Como funciona o Living Data Engine?**

O **Living Data Engine** é o motor proprietário da Cyber Organic responsável pelo processamento contínuo de fluxos de eventos e telemetria na borda (Edge Computing), sem sobrecarregar o dispositivo do usuário nem depender de consultas lentas a bancos de dados centrais.

🔬 **O que o motor faz em milissegundos:**
1. **Captura de Telemetria Fina:** Analisa velocidade de navegação, cadência de rolagem, integridade de conexão e carga perimetral.
2. **Cálculo de Pulso Sistêmico:** Sintetiza métricas de saúde da plataforma em tempo real com renderização visual reativa.
3. **Alimentação de Modelos Cognitivos:** Fornece contexto operacional imediato aos agentes de IA no Vertex AI.

Você pode acompanhar este ecossistema pulsando ao vivo agora mesmo na aba **LIVING DATA**.`,
        options: [
          { label: 'Acessar Monitor Living Data ↗', href: '/living-data' },
          { label: 'Ver Arquitetura Técnica ↗', href: '/tecnologia' },
          { 
            label: '💬 Falar no WhatsApp com Enrique', 
            action: 'whatsapp', 
            href: 'https://wa.me/5555991812505?text=Ol%C3%A1%20Enrique,%20gostaria%20de%20integrar%20o%20Living%20Data%20Engine.' 
          },
          { 
            label: '📝 Solicitar Instância no Chat', 
            action: 'in_chat_contact',
            messagePrefill: 'Interesse na integração do Living Data Engine para telemetria em tempo real.' 
          }
        ]
      };
    }

    return {
      text: `⚡ **¿Cómo funciona el motor Living Data y qué telemetría procesa?**

El **Living Data Engine** es el motor propietario de Cyber Organic diseñado para el procesamiento continuo de eventos y flujos de telemetría en el borde (Edge Computing), sin sobrecargar el cliente ni depender de bases de datos relacionales tradicionales.

🔬 **Mecanismos clave:**
1. **Captura de Telemetría Dinámica:** Ritmo de interacción, latencia de red, rendimiento en el dispositivo y eventos de flujo.
2. **Pulso de Salud Sistémica:** Estado continuo de operatividad y carga con renderización reactiva.
3. **Contexto para Inferencia Cognitiva:** Alimenta con contexto operacional en vivo a los agentes de IA desplegados en Vertex AI.

Puedes ver el monitor de telemetría operando en vivo en la sección **LIVING DATA**.`,
      options: [
        { label: 'Ver Monitor Living Data en Vivo ↗', href: '/living-data' },
        { label: 'Detalles de la Arquitectura ↗', href: '/tecnologia' },
        { 
          label: '💬 Hablar por WhatsApp con Enrique', 
          action: 'whatsapp', 
          href: 'https://wa.me/5555991812505?text=Hola%20Enrique,%20quisiera%20integrar%20el%20Living%20Data%20Engine.' 
        },
        { 
          label: '📝 Solicitar Instancia en el Chat', 
          action: 'in_chat_contact',
          messagePrefill: 'Interés en integrar Living Data Engine para telemetría en vivo.' 
        }
      ]
    };
  }

  // 3. AGENTES COGNITIVOS & VERTEX AI
  if (
    prompt.includes('vertex') ||
    prompt.includes('cognitivo') ||
    prompt.includes('cognitiva') ||
    prompt.includes('agente') ||
    prompt.includes('agentes') ||
    prompt.includes('chatbot') ||
    prompt.includes('chatbots') ||
    (prompt.includes('ia') && (prompt.includes('diferencia') || prompt.includes('diferença') || prompt.includes('comum') || prompt.includes('común')))
  ) {
    if (lang === 'pt') {
      return {
        text: `🤖 **Qual a diferença entre Agentes Cognitivos no Vertex AI e Chatbots Convencionais?**

Muitas plataformas oferecem "chatbots", mas a diferença técnica é profunda:

❌ **Chatbots Convencionais:**
- Operam com respostas estáticas, árvores de decisão rígidas ou prompts genéricos sem contexto.
- "Alucinam" facilmente e não têm acesso seguro aos dados reais da empresa.
- Funcionam como uma camada isolada sem capacidade de disparar rotinas de infraestrutura.

✅ **Agentes Cognitivos no Google Cloud Vertex AI (Cyber Organic):**
1. **Enterprise Grounding:** Ancorados em dados estruturados e documentos corporativos reais via Vertex AI Agent Builder.
2. **Segurança e Isolamento IAM:** Execução protegida dentro da Google Cloud com Service Accounts dedicadas, sem vazamento de dados confidenciais.
3. **Raciocínio Semântico & Autonomia:** Capacidade de interpretar objetivos complexos, acionar microserviços serverless e responder em múltiplos idiomas com precisão contextual.

Gostaria de ver como estruturar um agente cognitivo para a sua organização?`,
        options: [
          { 
            label: '💬 Falar com o Arquiteto Líder (WhatsApp)', 
            action: 'whatsapp', 
            href: 'https://wa.me/5555991812505?text=Ol%C3%A1%20Enrique,%20gostaria%20de%20conversar%20sobre%20Agentes%20Cognitivos%20com%20Vertex%20AI.' 
          },
          { 
            label: '📝 Solicitar Avaliação de IA no Chat', 
            action: 'in_chat_contact',
            messagePrefill: 'Quero integrar agentes cognitivos com Vertex AI e grounding empresarial.' 
          },
          { label: 'Ver Desdobramentos em Produção ↗', href: '/despliegues' }
        ]
      };
    }

    return {
      text: `🤖 **¿Por qué los Agentes Cognitivos en Vertex AI son diferentes a un chatbot común?**

A diferencia de los asistentes conversacionales estándar, nuestros agentes operan con nivel empresarial:

❌ **Chatbots Comunes:**
- Respuestas fijas, patrones rígidos de texto o llamadas a APIs públicas no controladas.
- Sin anclaje de datos reales, alta tasa de error e incapacidad de interactuar con la infraestructura.

✅ **Agentes Cognitivos en Google Cloud Vertex AI (Cyber Organic):**
1. **Grounding Corporativo:** Respuestas basadas exclusivamente en datos corporativos verificados mediante Vertex AI Agent Builder.
2. **Aislamiento de Seguridad:** Integración con Google Service Accounts y Google IAM para proteger credenciales y datos sensibles.
3. **Orquestación de Procesos:** Capacidad de razonar y disparar microservicios en Cloud Run para resolver solicitudes reales de negocio.`,
      options: [
        { 
          label: '💬 Hablar con el Arquitecto (WhatsApp)', 
          action: 'whatsapp', 
          href: 'https://wa.me/5555991812505?text=Hola%20Enrique,%20quisiera%20consultar%20sobre%20Agentes%20Cognitivos%20en%20Vertex%20AI.' 
        },
        { 
          label: '📝 Solicitar Evaluación en el Chat', 
          action: 'in_chat_contact',
          messagePrefill: 'Quiero evaluar la implementación de agentes cognitivos con Vertex AI.' 
        },
        { label: 'Ver Casos en Producción ↗', href: '/despliegues' }
      ]
    };
  }

  // 4. TIERS DE LICENCIAMIENTO & APROVISIONAMIENTO
  if (
    prompt.includes('tier') ||
    prompt.includes('licencia') ||
    prompt.includes('licença') ||
    prompt.includes('precio') ||
    prompt.includes('preço') ||
    prompt.includes('costo') ||
    prompt.includes('orçamento') ||
    prompt.includes('presupuesto') ||
    prompt.includes('contratar') ||
    prompt.includes('aprovisionar') ||
    prompt.includes('starter') ||
    prompt.includes('enterprise') ||
    prompt.includes('cluster')
  ) {
    if (lang === 'pt') {
      return {
        text: `🚀 **Tiers de Licenciamento da Cyber Organic**

Nossa suíte de software e infraestrutura está dividida em 3 níveis modulares:

1. 📦 **Tier 1: Starter License**
   - Runtime Web PWA instalável (Android / iOS / Desktop).
   - Autenticação nativa com Google Identity (OAuth).
   - Até 4 inferências cognitivas de IA por dia.
   - Desdobramento e hospedagem em Firebase & Cloud Run.
   - *Ideal para: Validação rápida de produtos digitais com custo mínimo.*

2. ⚡ **Tier 2: Enterprise Runtime**
   - Inclui tudo da licença Starter.
   - **Living Data Engine** com telemetria ativa e edge caching.
   - **Vertex AI Agent Builder** para orquestração de IA corporativa.
   - Observabilidade completa com Google Cloud Logging & IAM.
   - *Ideal para: Startups e empresas em fase de expansão.*

3. 🏛️ **Tier 3: Dedicated Cluster Architecture**
   - Tenant dedicado e isolado em nuvem Google.
   - Padrões de arquitetura alinhados com certificação Google Cloud ACE.
   - Suporte técnico de engenharia e SLA empresarial 99.99%.
   - *Ideal para: Operações de missão crítica e alta concorrência.*

Você pode solicitar a avaliação de arquitetura agora mesmo pelo chat ou falar direto com Enrique:`,
        options: [
          { 
            label: '💬 Consultar Tiers no WhatsApp', 
            action: 'whatsapp', 
            href: 'https://wa.me/5555991812505?text=Ol%C3%A1%20Enrique,%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20Tiers%20de%20Licenciamento.' 
          },
          { 
            label: '📝 Solicitar Avaliação Direto no Chat', 
            action: 'in_chat_contact',
            messagePrefill: 'Gostaria de uma proposta/avaliação sobre os Tiers de Licenciamento.' 
          },
          { label: 'Ver Detalhes dos Módulos ↗', href: '/tecnologia' },
          { label: '📄 Abrir Portal B2B Completo ↗', href: '/contacto' }
        ],
        showContactForm: true,
        contactPrefill: 'Gostaria de uma proposta/avaliação sobre os Tiers de Licenciamento.'
      };
    }

    return {
      text: `🚀 **Tiers de Licenciamiento e Infraestructura Escalable**

Cyber Organic ofrece tres niveles de aprovisionamiento según las exigencias de tu proyecto:

1. 📦 **Tier 1: Starter License**
   - Aplicación Web Progresiva (PWA instalable en Android y Desktop).
   - Google Identity & OAuth nativo.
   - Hasta 4 inferencias cognitivas diarias.
   - Despliegue elástico sobre Firebase Hosting y Cloud Run.

2. ⚡ **Tier 2: Enterprise Runtime**
   - Todo lo del Tier Starter.
   - Integración completa de **Living Data Engine** (telemetría en vivo).
   - **Vertex AI Agent Builder** para agentes cognitivos con grounding.
   - Observabilidad avanzada con Cloud Logging y políticas IAM.

3. 🏛️ **Tier 3: Dedicated Cluster Architecture**
   - Tenant completamente aislado para la organización.
   - Estándares de arquitectura certificada Google Cloud ACE.
   - Soporte directo de ingeniería cloud y SLA de 99.99% de Uptime.

Puedes coordinar tu evaluación directamente aquí en el chat o por WhatsApp:`,
      options: [
        { 
          label: '💬 Consultar Tiers por WhatsApp', 
          action: 'whatsapp', 
          href: 'https://wa.me/5555991812505?text=Hola%20Enrique,%20quisiera%20solicitar%20información%20sobre%20los%20Tiers%20de%20Licenciamiento.' 
        },
        { 
          label: '📝 Solicitar Evaluación en el Chat', 
          action: 'in_chat_contact',
          messagePrefill: 'Quisiera solicitar información y cotización sobre los Tiers de Licenciamiento.' 
        },
        { label: 'Ver Módulos de Software ↗', href: '/tecnologia' },
        { label: '📄 Abrir Portal B2B Completo ↗', href: '/contacto' }
      ],
      showContactForm: true,
      contactPrefill: 'Quisiera solicitar información y cotización sobre los Tiers de Licenciamiento.'
    };
  }

  // 5. FUNDADOR / ARQUITECTO (Enrique Rolando Fernandez Manas)
  if (
    prompt.includes('enrique') ||
    prompt.includes('fundador') ||
    prompt.includes('fundou') ||
    prompt.includes('arquiteto') ||
    prompt.includes('arquitecto') ||
    prompt.includes('criador') ||
    prompt.includes('creador') ||
    prompt.includes('lider') ||
    prompt.includes('quién eres') ||
    prompt.includes('quem é') ||
    prompt.includes('quien es')
  ) {
    if (lang === 'pt') {
      return {
        text: `👨‍💻 **Enrique Rolando Fernandez Manas — Founder & Lead Cloud Architect**

A Cyber Organic é liderada por **Enrique Rolando Fernandez Manas**, especialista em arquitetura em nuvem sobre **Google Cloud Platform (GCP)** com rigor técnico alinhado aos padrões da certificação **Associate Cloud Engineer (ACE)**.

🛡️ **Trajetória e Especialidades Técnicas:**
- **Engenharia de Performance Extrema:** Padrão 100/100 em Core Web Vitals e renderização perimetral instantânea.
- **Desenvolvimento Serverless Distribuído:** Microsserviços elásticos com Python 3, Google Cloud Run, Firebase e Vertex AI.
- **Cibersegurança e Governança:** Mais de duas décadas de experiência prévia em análise de sistemas, operações de segurança técnica e proteção de infraestrutura crítica.

Enrique lidera a Cyber Organic com a visão de transformar sistemas corporativos tradicionais em ecossistemas bio-digitais resilientes e autônomos.`,
        options: [
          { 
            label: '💬 Falar com Enrique no WhatsApp', 
            action: 'whatsapp', 
            href: 'https://wa.me/5555991812505?text=Ol%C3%A1%20Enrique,%20vi%20seu%20perfil%20no%20assistente%20e%20gostaria%20de%20conversar%20sobre%20arquitetura.' 
          },
          { 
            label: '📝 Deixar Mensagem Direta no Chat', 
            action: 'in_chat_contact',
            messagePrefill: 'Gostaria de uma consulta técnica com Enrique Rolando Fernandez Manas.' 
          },
          { label: 'Ver Perfil e Certificações ↗', href: '/tecnologia' }
        ]
      };
    }

    return {
      text: `👨‍💻 **Enrique Rolando Fernandez Manas — Founder & Lead Cloud Architect**

Cyber Organic es fundada y dirigida técnicamente por **Enrique Rolando Fernandez Manas**, especialista en diseño de arquitecturas cloud sobre **Google Cloud Platform (GCP)** con estándares de certificación **Associate Cloud Engineer (ACE)**.

🛡️ **Especialidades Técnicas:**
- **Rendimiento Web Extremo:** Máxima optimización de Core Web Vitals y baja latencia en móviles.
- **Arquitectura Serverless Distribuida:** Desarrollo elástico con Python 3, Cloud Run, Firebase y Vertex AI.
- **Ciberseguridad y Gobernanza:** Más de 20 años de experiencia previa en análisis de sistemas, seguridad técnica y gobernanza de infraestructura crítica.

Lidera la visión de Cyber Organic como plataforma tecnológica para la resiliencia operativa y la eficiencia bio-digital.`,
      options: [
        { 
          label: '💬 Hablar con el Arquitecto (WhatsApp)', 
          action: 'whatsapp', 
          href: 'https://wa.me/5555991812505?text=Hola%20Enrique,%20estaba%20conversando%20con%20el%20Asistente%20Virtual%20y%20quisiera%20consultarte%20sobre%20arquitectura.' 
        },
        { 
          label: '📝 Dejar Mensaje en el Chat', 
          action: 'in_chat_contact',
          messagePrefill: 'Quisiera una consulta técnica directa con Enrique Rolando Fernandez Manas.' 
        },
        { label: 'Ver Trayectoria en Ingeniería ↗', href: '/tecnologia' }
      ]
    };
  }

  // 6. SERVERLESS & GOOGLE CLOUD RESILIENCIA
  if (
    prompt.includes('serverless') ||
    prompt.includes('uptime') ||
    prompt.includes('nuvem') ||
    prompt.includes('cloud') ||
    prompt.includes('cloud run') ||
    prompt.includes('core web vitals') ||
    prompt.includes('resiliencia') ||
    prompt.includes('resiliência') ||
    prompt.includes('servidores')
  ) {
    if (lang === 'pt') {
      return {
        text: `🏛️ **Por que a Arquitetura Serverless no Google Cloud garante 99.99% de Uptime e 100/100 Core Web Vitals?**

Diferente de servidores tradicionais (VPS ou servidores dedicados legados) que ficam ociosos ou caem em picos de tráfego, nossa engenharia no Google Cloud adota princípios serverless de última geração:

1. ⚡ **Google Cloud Run (Zero a Infinito):**
   - Os serviços escalam de 0 a milhares de instâncias em frações de segundo apenas quando há requisições reais.
   - Custo fixo zero de servidores ligados sem uso.
2. 🌐 **Google Global Edge Caching:**
   - O conteúdo perimetral é distribuído nos pontos de presença (PoPs) mundiais do Google, entregando TTFB (Time to First Byte) inferior a 80ms.
3. 🔒 **Isolamento de Segurança com Service Accounts:**
   - Nenhuma chave secreta fica exposta no front-end. O tráfego interno opera sob permissões mínimas (Princípio de Menor Privilégio).

Essa estrutura garante que a sua aplicação suporte picos massivos sem lentidão e com estabilidade ininterrupta.`,
        options: [
          { 
            label: '💬 Falar no WhatsApp com Enrique', 
            action: 'whatsapp', 
            href: 'https://wa.me/5555991812505?text=Ol%C3%A1%20Enrique,%20gostaria%20de%20avaliar%20minha%20infraestrutura%20serverless.' 
          },
          { 
            label: '📝 Solicitar Análise no Chat', 
            action: 'in_chat_contact',
            messagePrefill: 'Quero avaliar a viabilidade de arquitetura serverless no Google Cloud para minha empresa.' 
          },
          { label: 'Ver Módulos de Infraestrutura ↗', href: '/tecnologia' },
          { label: 'Ver Casos em Produção ↗', href: '/despliegues' }
        ]
      };
    }

    return {
      text: `🏛️ **¿Por qué la arquitectura serverless en Google Cloud garantiza 99.99% de Uptime y 100/100 Core Web Vitals?**

En lugar de servidores fijos que consumen costos ociosos o colapsan con el tráfico pico, la arquitectura de Cyber Organic en Google Cloud se basa en:

1. ⚡ **Google Cloud Run:**
   - Contenedores serverless que escalan instantáneamente de 0 a alta concurrencia según la demanda.
   - Cero costos de mantenimiento de servidores ociosos.
2. 🌐 **Edge Caching Global de Google:**
   - Distribución de activos estáticos y dinámicos en la red perimetral de Google, logrando tiempos de respuesta inferiores a 80ms.
3. 🔒 **Aislamiento Seguro con Google Service Accounts:**
   - Mitigación de riesgos perimetrales y gobierno estricto de accesos mediante Cloud IAM.

Esto permite garantizar una disponibilidad continua (99.99% Uptime) con métricas de Core Web Vitals insuperables.`,
      options: [
        { 
          label: '💬 Hablar por WhatsApp con Enrique', 
          action: 'whatsapp', 
          href: 'https://wa.me/5555991812505?text=Hola%20Enrique,%20quisiera%20evaluar%20mi%20arquitectura%20serverless.' 
        },
        { 
          label: '📝 Solicitar Evaluación en el Chat', 
          action: 'in_chat_contact',
          messagePrefill: 'Quiero evaluar arquitectura serverless en Google Cloud para mi empresa.' 
        },
        { label: 'Ver Módulos de Software ↗', href: '/tecnologia' },
        { label: 'Explorar Despliegues ↗', href: '/despliegues' }
      ]
    };
  }

  // 7. DESPLIEGUES / CASOS DE PRODUCCIÓN
  if (
    prompt.includes('despliegue') ||
    prompt.includes('despliegues') ||
    prompt.includes('casos') ||
    prompt.includes('producción') ||
    prompt.includes('producao') ||
    prompt.includes('rancho branco') ||
    prompt.includes('atalaya 24') ||
    prompt.includes('verdant ai') ||
    prompt.includes('portfolio') ||
    prompt.includes('portfólio')
  ) {
    if (lang === 'pt') {
      return {
        text: `💼 **Ecossistemas e Desdobramentos em Produção:**

Nossa arquitetura sustenta sistemas reais de alta exigência:

1. 🏖️ **Rancho Branco** *(Runtime Transacional & Turismo Bio-Digital)*:
   - Plataforma distribuída de alta conversão para tráfego sazonal concorrente.
   - Pontuação máxima em Core Web Vitals em dispositivos móveis e checkout instantâneo.

2. 🛡️ **Atalaya 24** *(Monitoramento Crítico & Backend Serverless)*:
   - Arquitetura de telemetria e segurança com alta disponibilidade sobre Cloud Run e Firebase.
   - Tempos de resposta inferiores a 100ms em situações de alerta.

3. 🌿 **Verdant AI** *(Orquestração Cognitiva & Data Flow)*:
   - Pipeline de processamento semântico integrado ao Living Data Engine para tomada de decisões autônomas.

Você pode explorar todos os detalhes arquiteturais na aba **DESPLIEGUES**.`,
        options: [
          { label: 'Ver Desdobramentos em Produção ↗', href: '/despliegues' },
          { 
            label: '💬 Falar no WhatsApp sobre Casos Reais', 
            action: 'whatsapp', 
            href: 'https://wa.me/5555991812505?text=Ol%C3%A1%20Enrique,%20vi%20os%20casos%20de%20produ%C3%A7%C3%A3o%20e%20gostaria%20de%20conversar.' 
          },
          { 
            label: '📝 Solicitar Avaliação no Chat', 
            action: 'in_chat_contact',
            messagePrefill: 'Quero avaliar uma arquitetura similar aos casos de produção da Cyber Organic.' 
          }
        ]
      };
    }

    return {
      text: `💼 **Ecosistemas y Despliegues en Producción:**

Nuestra infraestructura opera en casos reales con alto volumen y criticidad:

1. 🏖️ **Rancho Branco** *(Runtime Transaccional & Turismo Bio-Digital)*:
   - Plataforma distribuida para absorber picos estacionales de tráfico con Core Web Vitals impecable.

2. 🛡️ **Atalaya 24** *(Monitoreo Crítico & Backend Serverless)*:
   - Resiliencia sobre Cloud Run y Firebase con tiempos de respuesta bajo 100ms para seguridad.

3. 🌿 **Verdant AI** *(Orquestación Cognitiva & Data Flow)*:
   - Flujo de procesamiento semántico en tiempo real integrado con Living Data Engine.

Puedes revisar los detalles de cada arquitectura en la sección **DESPLIEGUES**.`,
      options: [
        { label: 'Ver Despliegues en Producción ↗', href: '/despliegues' },
        { 
          label: '💬 Hablar por WhatsApp con Enrique', 
          action: 'whatsapp', 
          href: 'https://wa.me/5555991812505?text=Hola%20Enrique,%20vi%20los%20casos%20de%20despliegue%20y%20quisiera%20conversar.' 
        },
        { 
          label: '📝 Solicitar Evaluación en el Chat', 
          action: 'in_chat_contact',
          messagePrefill: 'Quiero evaluar una arquitectura similar a los despliegues en producción.' 
        }
      ]
    };
  }

  // 8. AI STUDIO
  if (
    prompt.includes('ai studio') ||
    prompt.includes('estudio') ||
    prompt.includes('gerar') ||
    prompt.includes('generar') ||
    prompt.includes('imagem') ||
    prompt.includes('imagen')
  ) {
    if (lang === 'pt') {
      return {
        text: `🎨 **Cyber Organic AI Studio**

O **AI Studio** é o nosso laboratório interativo de inteligência artificial aplicada. Nele, você pode experimentar diretamente:
- Geração de conteúdo textual e síntese multimodal com modelos Google Gemini.
- Criação e experimentação de prompts de engenharia com parâmetros de temperatura e contexto.
- Geração de ativos visuais em alta resolução.

Você pode testar a ferramenta livremente na aba **AI STUDIO**!`,
        options: [
          { label: 'Ir para o AI Studio ↗', href: '/ai-studio' },
          { label: 'Conhecer as Licenças ↗', href: '/tecnologia' },
          { 
            label: '💬 Tirar Dúvidas no WhatsApp', 
            action: 'whatsapp', 
            href: 'https://wa.me/5555991812505?text=Ol%C3%A1%20Enrique,%20testei%20o%20AI%20Studio%20e%20gostaria%20de%20integrar%20IA%20em%20meu%20produto.' 
          }
        ]
      };
    }

    return {
      text: `🎨 **Cyber Organic AI Studio**

El **AI Studio** es nuestro entorno interactivo de experimentación con modelos de IA de Google.
En él puedes:
- Probar síntesis multimodal y generación de texto con Gemini.
- Ajustar parámetros de temperatura e instrucciones de sistema.
- Experimentar con generación de imágenes de alta fidelidad.

Puedes ingresar directamente desde la pestaña **AI STUDIO**.`,
      options: [
        { label: 'Ingresar al AI Studio ↗', href: '/ai-studio' },
        { label: 'Ver Tiers de Licencia ↗', href: '/tecnologia' },
        { 
          label: '💬 Consultar sobre IA por WhatsApp', 
          action: 'whatsapp', 
          href: 'https://wa.me/5555991812505?text=Hola%20Enrique,%20prob%C3%A9%20el%20AI%20Studio%20y%20quisiera%20integrar%20IA.' 
        }
      ]
    };
  }

  // 9. LAB I+D: SAKURAWEBS CORE ENGINE
  if (
    prompt.includes('sakura') ||
    prompt.includes('i+d') ||
    prompt.includes('p&d') ||
    prompt.includes('laboratorio') ||
    prompt.includes('laboratório') ||
    prompt.includes('r&d')
  ) {
    if (lang === 'pt') {
      return {
        text: `🔬 **Laboratório de I+D: SakuraWebs Core Engine**

O **SakuraWebs Core Engine** é o núcleo de pesquisa e desenvolvimento (R&D) da Cyber Organic. É onde nossos engenheiros testam e homologam novas tecnologias antes de irem para produção:
- Validação de esteiras CI/CD automatizadas.
- Isolamento de credenciais e segurança avançada com Google Service Accounts.
- Grounding de agentes autônomos no Vertex AI.
- Criação de templates de aceleração e motores de micro-serviços.`,
        options: [
          { label: 'Ver Módulos de Software ↗', href: '/tecnologia' },
          { 
            label: '💬 Falar com Enrique no WhatsApp', 
            action: 'whatsapp', 
            href: 'https://wa.me/5555991812505?text=Ol%C3%A1%20Enrique,%20gostaria%20de%20saber%20mais%20sobre%20o%20SakuraWebs%20Core%20Engine.' 
          },
          { 
            label: '📝 Enviar Pergunta no Chat', 
            action: 'in_chat_contact',
            messagePrefill: 'Gostaria de saber como utilizar aceleradores do SakuraWebs Core Engine.' 
          }
        ]
      };
    }

    return {
      text: `🔬 **Laboratorio de I+D: SakuraWebs Core Engine**

El **SakuraWebs Core Engine** es el núcleo experimental donde Cyber Organic valida continuamente:
- Tuberías de integración y despliegue continuo (CI/CD) automatizadas.
- Aislamiento estricto de credenciales con Google Service Accounts.
- Grounding de agentes cognitivos en Vertex AI.
- Plantillas base de aceleración para micro-servicios serverless.`,
      options: [
        { label: 'Ver Módulos y R&D ↗', href: '/tecnologia' },
        { 
          label: '💬 Hablar con el Arquitecto (WhatsApp)', 
          action: 'whatsapp', 
          href: 'https://wa.me/5555991812505?text=Hola%20Enrique,%20quisiera%20saber%20más%20del%20SakuraWebs%20Core%20Engine.' 
        },
        { 
          label: '📝 Enviar Mensaje en el Chat', 
          action: 'in_chat_contact',
          messagePrefill: 'Quisiera saber sobre aceleradores del SakuraWebs Core Engine.' 
        }
      ]
    };
  }

  // 10. GREETINGS OR GENERAL ASSISTANCE
  if (
    prompt.includes('olá') ||
    prompt.includes('ola') ||
    prompt.includes('oi') ||
    prompt.includes('hola') ||
    prompt.includes('buenos') ||
    prompt.includes('bom dia') ||
    prompt.includes('boa tarde') ||
    prompt.includes('boa noite') ||
    prompt.length < 15
  ) {
    if (lang === 'pt') {
      return {
        text: `Olá! Seja bem-vindo à **Cyber Organic**. 

Como estes temas são recentes na indústria e envolvem conceitos avançados de computação em nuvem e inteligência artificial, estou aqui para esclarecer qualquer dúvida de forma simples ou com profundidade técnica:

🌱 **O que podemos explorar:**
1. **Infraestrutura Bio-Digital:** O que é e por que supera páginas web estáticas.
2. **Living Data Engine:** Como processamos telemetria contínua no Edge em tempo real.
3. **Agentes Cognitivos no Vertex AI:** Como a IA com grounding difere de chatbots comuns.
4. **Tiers de Licenciamento:** Como aprovisionar instâncias Starter, Enterprise ou Clusters Dedicados.

Sobre qual desses temas você gostaria de saber mais?`,
        options: [
          { label: 'O que é Infraestrutura Bio-Digital?', href: '/tecnologia' },
          { label: 'Como funciona o Living Data? ↗', href: '/living-data' },
          { label: 'Agentes Vertex AI vs Chatbots', href: '/tecnologia' },
          { 
            label: '💬 Falar Direto com Arquiteto (WhatsApp)', 
            action: 'whatsapp', 
            href: 'https://wa.me/5555991812505?text=Ol%C3%A1%20Enrique,%20gostaria%20de%20uma%20conversa%20t%C3%A9cnica.' 
          },
          { 
            label: '📝 Deixar Contato no Chat', 
            action: 'in_chat_contact',
            messagePrefill: 'Olá, gostaria de conhecer as opções de arquitetura da Cyber Organic.' 
          }
        ]
      };
    }

    return {
      text: `¡Hola! Bienvenido a **Cyber Organic**.

Dado que los conceptos de infraestructura bio-digital, telemetría continua y agentes cognitivos son vanguardistas y recientes, estoy aquí para aclarar cualquier duda con explicaciones pedagógicas o precisión de ingeniería:

🌱 **Temas clave que podemos explorar:**
1. **Infraestructura Bio-Digital:** Por qué supera radicalmente a los sitios web estáticos tradicionales.
2. **Living Data Engine:** Procesamiento de telemetría y flujo de eventos en tiempo real.
3. **Agentes Cognitivos con Vertex AI:** Razonamiento y grounding empresarial seguro.
4. **Tiers de Licenciamiento:** Cómo desplegar instancias Starter, Enterprise o Dedicated Clusters en Google Cloud.

¿Qué tema te gustaría profundizar hoy?`,
      options: [
        { label: '¿Qué es Infraestructura Bio-Digital?', href: '/tecnologia' },
        { label: 'Ver Living Data en Vivo ↗', href: '/living-data' },
        { label: 'Agentes de Vertex AI vs Chatbots', href: '/tecnologia' },
        { 
          label: '💬 Hablar por WhatsApp con Enrique', 
          action: 'whatsapp', 
          href: 'https://wa.me/5555991812505?text=Hola%20Enrique,%20quisiera%20hacerte%20una%20consulta%20técnica.' 
        },
        { 
          label: '📝 Dejar Contacto en el Chat', 
          action: 'in_chat_contact',
          messagePrefill: 'Hola, quisiera conocer las opciones de arquitectura de Cyber Organic.' 
        }
      ]
    };
  }

  // 11. GENERAL / PEDAGOGICAL FALLBACK (Always relevant, clear, and action-oriented)
  if (lang === 'pt') {
    return {
      text: `Excelente pergunta! Na **Cyber Organic**, nosso propósito é transformar telemetria e computação serverless em inteligência operacional autônoma.

💡 **Resumo dos pontos centrais da nossa arquitetura:**
- **Bio-Digital Edge Runtime:** Front-end desacoplado com latência <80ms e 100/100 Core Web Vitals na rede do Google.
- **Living Data Engine:** Processamento de eventos contínuos no Edge sem sobrecarregar bancos de dados.
- **Agentes Cognitivos no Vertex AI:** Agentes inteligentes ancorados em dados reais de negócios com isolamento de credenciais via Google Service Accounts.
- **Tiers Modulares:** Licenciamento desde instâncias Starter (PWA + Cloud Run) até Dedicated Clusters com padrões de certificação Google Cloud ACE.

Você pode explorar nossa tecnologia em detalhes ou solicitar uma avaliação de arquitetura diretamente aqui:`,
      options: [
        { label: 'Ver Módulos de Software ↗', href: '/tecnologia' },
        { label: 'Monitor Living Data em Vivo ↗', href: '/living-data' },
        { 
          label: '💬 Falar no WhatsApp com Enrique', 
          action: 'whatsapp', 
          href: 'https://wa.me/5555991812505?text=Ol%C3%A1%20Enrique,%20estou%20no%20site%20da%20Cyber%20Organic%20e%20gostaria%20de%20uma%20consulta%20t%C3%A9cnica.' 
        },
        { 
          label: '📝 Solicitar Avaliação no Chat', 
          action: 'in_chat_contact',
          messagePrefill: 'Gostaria de solicitar uma avaliação de arquitetura para a minha empresa.' 
        }
      ]
    };
  }

  return {
    text: `Excelente consulta. En **Cyber Organic**, unimos la arquitectura serverless elástica de Google Cloud con agentes cognitivos y telemetría perimetral:

💡 **Puntos clave de nuestra plataforma:**
- **Bio-Digital Edge Runtime:** Experiencia web desacoplada con 100/100 Core Web Vitals y caché distribuida en la red global de Google.
- **Living Data Engine:** Procesamiento dinámico de telemetría e interacción en tiempo real en el borde.
- **Agentes Cognitivos en Vertex AI:** Inteligencia autónoma con grounding corporativo y gobierno de seguridad IAM.
- **Tiers de Licenciamiento:** Opciones desde Starter (PWA + Cloud Run) hasta Dedicated Clusters para infraestructura crítica.

¿Deseas solicitar una evaluación técnica para tu empresa o profundizar en alguno de nuestros módulos?`,
    options: [
      { label: 'Ver Módulos de Software ↗', href: '/tecnologia' },
      { label: 'Ver Living Data en Vivo ↗', href: '/living-data' },
      { 
        label: '💬 Hablar por WhatsApp con Enrique', 
        action: 'whatsapp', 
        href: 'https://wa.me/5555991812505?text=Hola%20Enrique,%20quisiera%20conversar%20sobre%20la%20arquitectura%20de%20Cyber%20Organic.' 
      },
      { 
        label: '📝 Solicitar Evaluación en el Chat', 
        action: 'in_chat_contact',
        messagePrefill: 'Quisiera solicitar una evaluación técnica de arquitectura para mi empresa.' 
      }
    ]
  };
}
