import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  X, 
  Send, 
  Cpu, 
  Compass, 
  MessageSquare, 
  Mail, 
  ArrowUpRight, 
  CheckCircle2, 
  User, 
  FileText
} from 'lucide-react';

import { generateCognitiveResponse, AssistantOption } from '../cognitiveAssistant';

type Message = {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: AssistantOption[];
  showContactForm?: boolean;
};

const SUGGESTED_TOPICS = [
  { 
    label: '💬 Falar com o Arquiteto Líder', 
    prompt: 'Gostaria de falar diretamente com o Arquiteto Enrique no WhatsApp ou por aqui.' 
  },
  { 
    label: '🌱 O que é Infraestrutura Bio-Digital?', 
    prompt: 'O que é exatamente a infraestrutura bio-digital e em que se diferencia de uma web tradicional?' 
  },
  { 
    label: '⚡ Como funciona o Living Data?', 
    prompt: 'Como funciona o motor Living Data e que vantagens oferece processar telemetria no Edge?' 
  },
  { 
    label: '🤖 Agentes de Vertex AI vs Chatbots', 
    prompt: 'Qual a diferença entre os agentes cognitivos no Vertex AI e os chatbots convencionais?' 
  },
  { 
    label: '🚀 Tiers de Licenciamento', 
    prompt: 'Quais são os tiers de licenciamento disponíveis na Cyber Organic e como solicito uma avaliação?' 
  }
];

export default function Chatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // In-Chat Lead Form State
  const [showInChatForm, setShowInChatForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formDetails, setFormDetails] = useState('');
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const [chatHistory, setChatHistory] = useState<{role: string, parts: {text: string}[]}[]>([]);

  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'bot', 
      text: 'Iniciando conexão segura...\nBem-vindo à Cyber Organic. Sou seu Consultor Virtual de Infraestrutura Bio-Digital e IA Cognitiva.\n\nVocê pode esclarecer qualquer dúvida técnica aqui ou conectar-se diretamente com nossa liderança de engenharia sem precisar sair do chat.\n\nComo posso orientar seu projeto hoje?',
      options: [
        {
          label: '💬 Falar no WhatsApp com Enrique',
          action: 'whatsapp',
          href: 'https://wa.me/5555991812505?text=Ol%C3%A1%20Enrique,%20estou%20no%20assistente%20virtual%20e%20gostaria%20de%20conversar%20sobre%20arquitetura.'
        },
        {
          label: '📝 Deixar Mensagem Direta no Chat',
          action: 'in_chat_contact',
          messagePrefill: 'Olá, gostaria de conversar sobre soluções de arquitetura para minha empresa.'
        }
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, showInChatForm]);

  const handleOptionClick = (opt: AssistantOption) => {
    // 1. WhatsApp Action
    if (opt.action === 'whatsapp' || opt.href?.startsWith('https://wa.me')) {
      const url = opt.href || 'https://wa.me/5555991812505';
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    // 2. Email Action
    if (opt.action === 'email' || opt.href?.startsWith('mailto:')) {
      const url = opt.href || 'mailto:enrique.rfm@gmail.com?subject=Consulta%20Tecnica';
      window.location.href = url;
      return;
    }

    // 3. In-Chat Contact Form Action
    if (opt.action === 'in_chat_contact') {
      if (opt.messagePrefill) {
        setFormDetails(opt.messagePrefill);
      }
      setShowInChatForm(true);
      return;
    }

    // 4. Standard Navigation
    if (opt.href) {
      if (opt.href.startsWith('http')) {
        window.open(opt.href, '_blank', 'noopener,noreferrer');
      } else {
        navigate(opt.href);
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formContact.trim()) return;

    setIsSubmittingForm(true);

    const isEmail = formContact.includes('@');
    const leadData = {
      name: formName.trim(),
      email: isEmail ? formContact.trim() : '',
      phone: !isEmail ? formContact.trim() : '',
      organization: 'Lead desde Asistente Virtual',
      deploymentTypes: ['Contacto Directo Asistente'],
      environmentDetails: formDetails.trim() || 'Consulta técnica registrada desde el Asistente Virtual'
    };

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
    } catch (err) {
      console.warn("Contact form notification fallback:", err);
    }

    const submittedName = formName.trim();
    const submittedContact = formContact.trim();
    const submittedDetails = formDetails.trim();

    // Reset inputs & hide form
    setFormName('');
    setFormContact('');
    setFormDetails('');
    setIsSubmittingForm(false);
    setShowInChatForm(false);

    // Append confirmation message directly into conversation
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'bot',
        text: `✅ **Solicitação registrada com sucesso!**\n\nObrigado, **${submittedName}**. Sua mensagem foi transmitida diretamente ao Arquiteto Líder **Enrique Rolando Fernandez Manas**.\n\nRetornaremos em breve no canal fornecido (${submittedContact}).\n\nSe você precisar de atendimento prioritário agora mesmo, pode chamar diretamente pelo WhatsApp:`,
        options: [
          {
            label: '💬 Chamar Enrique no WhatsApp Agora',
            action: 'whatsapp',
            href: `https://wa.me/5555991812505?text=${encodeURIComponent(`Olá Enrique, sou ${submittedName}. Registrei uma solicitação no assistente sobre: ${submittedDetails || 'arquitetura de software'}.`)}`
          }
        ]
      }
    ]);
  };

  const sendUserMessage = async (rawText: string) => {
    const userText = rawText.trim();
    if (!userText || isTyping) return;

    setInputValue('');
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userText }]);
    setIsTyping(true);

    const currentCount = interactionCount + 1;
    setInteractionCount(currentCount);

    try {
      let botText = "";
      let options: AssistantOption[] | undefined = undefined;
      let shouldShowForm = false;
      let prefillContent = "";
      
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userText, history: chatHistory })
        });
        
        if (response.ok) {
          const data = await response.json();
          botText = data.text || "";
          if (data.options && Array.isArray(data.options) && data.options.length > 0) {
            options = data.options;
          }
        }
      } catch (fetchErr) {
        console.warn("Fetch failed, engaging client-side cognitive knowledge engine:", fetchErr);
      }
      
      // If server or fetch didn't provide text, generate client-side cognitive response
      if (!botText || botText.trim().length === 0) {
        const clientCognitive = generateCognitiveResponse(userText);
        botText = clientCognitive.text;
        if (!options && clientCognitive.options) {
          options = clientCognitive.options;
        }
        if (clientCognitive.showContactForm) {
          shouldShowForm = true;
          prefillContent = clientCognitive.contactPrefill || "";
        }
      }
      
      setChatHistory(prev => [
        ...prev,
        { role: "user", parts: [{ text: userText }] },
        { role: "model", parts: [{ text: botText }] }
      ]);

      // If options are still not populated, check intent intelligently
      if (!options) {
        const isContactOrLead = /(contato|contacto|falar|conversar|whatsapp|zap|telefone|telefono|email|e-mail|reuniao|reunião|agendar|contratar)/i.test(userText);
        const isCreatorQuestion = /(quien|quién|quem).*(creo|creó|hizo|desarrollo|desarrolló|invento|inventó|fundador|criador|arquiteto|arquitecto)/i.test(userText) || /(fundador|enrique|architect|lider|creador)/i.test(userText);
        const isTier = /(tier|tiers|licencia|licencias|precio|precios|costo|costos|presupuesto|orçamento|comprar)/i.test(userText);
        const isLivingData = /(living data|telemetria|telemetría|tempo real|tiempo real)/i.test(userText);
        const isAiStudio = /(ai studio|gerador|generador|prompts)/i.test(userText);

        if (isContactOrLead) {
          shouldShowForm = true;
          prefillContent = 'Interesse em consultoria de arquitetura e contratação de serviços.';
          options = [
            { 
              label: '💬 Falar no WhatsApp com Enrique', 
              action: 'whatsapp',
              href: 'https://wa.me/5555991812505?text=Ol%C3%A1%20Enrique,%20gostaria%20de%20conversar%20diretamente.' 
            },
            { 
              label: '📝 Enviar Mensagem Rápida no Chat', 
              action: 'in_chat_contact',
              messagePrefill: 'Gostaria de agendar uma consulta técnica sobre arquitetura e agentes de IA.' 
            },
            { 
              label: '✉️ Enviar E-mail Direto', 
              action: 'email',
              href: 'mailto:enrique.rfm@gmail.com?subject=Consulta%20de%20Arquitectura' 
            }
          ];
        } else if (isCreatorQuestion) {
          options = [
            { 
              label: '💬 Conectar com Enrique (WhatsApp)', 
              action: 'whatsapp',
              href: 'https://wa.me/5555991812505?text=Ol%C3%A1%20Enrique,%20estou%20no%20assistente%20e%20gostaria%20de%20conversar%20sobre%20arquitetura.' 
            },
            { 
              label: '📝 Deixar Mensagem no Chat', 
              action: 'in_chat_contact',
              messagePrefill: 'Consulta direta para Enrique Rolando Fernandez Manas.'
            },
            { 
              label: 'Ver Perfil e Trajetória Técnica ↗', 
              href: '/tecnologia' 
            }
          ];
        } else if (isTier) {
          options = [
            { 
              label: '💬 Consultar Tiers no WhatsApp', 
              action: 'whatsapp',
              href: 'https://wa.me/5555991812505?text=Ol%C3%A1%20Enrique,%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20Tiers%20de%20Licenciamento.' 
            },
            { 
              label: '📝 Solicitar Avaliação Direto no Chat', 
              action: 'in_chat_contact',
              messagePrefill: 'Gostaria de solicitar uma avaliação sobre os Tiers de Licenciamento.' 
            },
            { 
              label: 'Ver Módulos de Software ↗', 
              href: '/tecnologia' 
            }
          ];
        } else if (isLivingData) {
          options = [
            { 
              label: 'Acessar Monitor Living Data ↗', 
              href: '/living-data' 
            },
            { 
              label: '💬 Falar no WhatsApp com Enrique', 
              action: 'whatsapp',
              href: 'https://wa.me/5555991812505?text=Ol%C3%A1%20Enrique,%20gostaria%20de%20integrar%20o%20Living%20Data%20Engine.' 
            },
            { 
              label: '📝 Solicitar Instância no Chat', 
              action: 'in_chat_contact',
              messagePrefill: 'Interesse na integração do Living Data Engine para telemetria.' 
            }
          ];
        } else if (isAiStudio) {
          options = [
            { 
              label: 'Ir para o AI Studio ↗', 
              href: '/ai-studio' 
            },
            { 
              label: '💬 Tirar Dúvidas no WhatsApp', 
              action: 'whatsapp',
              href: 'https://wa.me/5555991812505?text=Ol%C3%A1%20Enrique,%20gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20IA.' 
            }
          ];
        }
      }

      if (shouldShowForm) {
        if (prefillContent) setFormDetails(prefillContent);
        setShowInChatForm(true);
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: botText, options }]);

    } catch (error) {
      console.error("Chat processing error:", error);
      const fallback = generateCognitiveResponse(userText);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        sender: 'bot', 
        text: fallback.text,
        options: fallback.options
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendUserMessage(inputValue);
  };

  return (
    <>
      {/* Floating Activation Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 group"
            aria-label="Abrir Asistente Virtual"
          >
            <div className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-brand-dark border border-brand-cyan/40 shadow-[0_0_30px_rgba(0,220,229,0.25)] overflow-hidden transition-transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-cyan/20 to-brand-gold/20 animate-pulse" />
              <Cpu className="w-6 h-6 text-brand-cyan relative z-10 group-hover:text-brand-gold transition-colors" />
            </div>
            {/* Ping indicator */}
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brand-cyan"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] md:w-[440px] h-[600px] max-h-[88vh] bg-[#070a0f]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-brand-cyan/15 flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-3.5 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-cyan/10 border border-brand-cyan/30 rounded-lg">
                  <Terminal className="w-5 h-5 text-brand-cyan" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif italic text-white text-base leading-none">Asistente Virtual</h3>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 font-semibold tracking-wider">
                      COGNITIVE ENGINE
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-[9px] text-gray-400 uppercase tracking-wider">
                      Atendimento & Engenharia Online
                    </span>
                  </div>
                </div>
              </div>

              {/* Header Fast Actions */}
              <div className="flex items-center gap-1">
                <a
                  href="https://wa.me/5555991812505?text=Ol%C3%A1%20Enrique,%20estou%20no%20site%20da%20Cyber%20Organic%20e%20gostaria%20de%20falar%20diretamente."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30 transition-all"
                  title="Falar direto no WhatsApp (+55 55 99181-2505)"
                  aria-label="Falar no WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setShowInChatForm(!showInChatForm)}
                  className={`p-1.5 rounded-lg transition-all ${
                    showInChatForm 
                      ? 'text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/30' 
                      : 'text-gray-400 hover:text-brand-cyan hover:bg-white/5 border border-transparent'
                  }`}
                  title="Deixar mensagem rápida no chat"
                  aria-label="Abrir formulário rápido"
                >
                  <FileText className="w-4 h-4" />
                </button>

                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
                  aria-label="Cerrar Asistente"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[90%] p-3.5 rounded-xl ${
                      msg.sender === 'user' 
                        ? 'bg-brand-cyan/15 border border-brand-cyan/30 text-white rounded-tr-sm' 
                        : 'bg-white/[0.04] border border-white/10 text-gray-300 rounded-tl-sm'
                    }`}
                  >
                    <div className={`text-sm leading-relaxed whitespace-pre-wrap ${msg.sender === 'bot' ? 'font-mono text-xs text-gray-200' : 'font-sans'}`}>
                      {msg.text}
                    </div>
                    
                    {/* Action Buttons */}
                    {msg.options && msg.options.length > 0 && (
                      <div className="mt-3 flex flex-col gap-2 pt-2 border-t border-white/5">
                        {msg.options.map((opt, i) => {
                          const isWhatsApp = opt.action === 'whatsapp' || opt.href?.startsWith('https://wa.me');
                          const isInChat = opt.action === 'in_chat_contact';
                          const isEmail = opt.action === 'email' || opt.href?.startsWith('mailto:');

                          let btnClasses = "text-[11px] font-mono transition-all px-3 py-2 rounded flex items-center justify-between text-left font-semibold shadow-sm";
                          
                          if (isWhatsApp) {
                            btnClasses += " bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black";
                          } else if (isInChat) {
                            btnClasses += " bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/35 hover:bg-brand-cyan hover:text-brand-dark";
                          } else if (isEmail) {
                            btnClasses += " bg-amber-950/40 text-amber-300 border border-amber-500/30 hover:bg-amber-400 hover:text-black";
                          } else {
                            btnClasses += " bg-white/[0.03] text-gray-300 border border-white/10 hover:border-brand-gold/50 hover:text-brand-gold hover:bg-white/[0.06]";
                          }

                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleOptionClick(opt)}
                              className={btnClasses}
                            >
                              <span className="flex items-center gap-1.5">
                                {isWhatsApp && <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400 group-hover:text-black" />}
                                {isInChat && <FileText className="w-3.5 h-3.5 flex-shrink-0 text-brand-cyan" />}
                                {isEmail && <Mail className="w-3.5 h-3.5 flex-shrink-0 text-amber-300" />}
                                <span>{opt.label}</span>
                              </span>
                              <ArrowUpRight className="w-3.5 h-3.5 opacity-60 flex-shrink-0 ml-1" />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Inline In-Chat Contact / Evaluation Card */}
              <AnimatePresence>
                {showInChatForm && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-brand-cyan/[0.07] to-brand-gold/[0.05] border border-brand-cyan/30 shadow-lg text-gray-200"
                  >
                    <div className="flex items-start justify-between pb-3 mb-3 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                          <h4 className="font-serif italic text-white text-sm">
                            Conectar com o Arquiteto Líder
                          </h4>
                        </div>
                        <p className="font-mono text-[10px] text-gray-400 mt-0.5">
                          Envie sua mensagem direto aqui, sem sair do assistente.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowInChatForm(false)}
                        className="text-gray-400 hover:text-white p-1"
                        aria-label="Cerrar formulario"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-2.5">
                      <div>
                        <label className="block font-mono text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                          Seu Nome Completo *
                        </label>
                        <div className="relative">
                          <User className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-500" />
                          <input
                            type="text"
                            required
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="Ex: Carlos Silva"
                            className="w-full bg-black/40 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-cyan/60 font-sans"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-mono text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                          Seu E-mail ou WhatsApp *
                        </label>
                        <div className="relative">
                          <Mail className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-500" />
                          <input
                            type="text"
                            required
                            value={formContact}
                            onChange={(e) => setFormContact(e.target.value)}
                            placeholder="carlos@empresa.com ou +55 (11) 99999-9999"
                            className="w-full bg-black/40 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-cyan/60 font-sans"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-mono text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                          Objetivo / Requerimentos
                        </label>
                        <textarea
                          rows={2}
                          value={formDetails}
                          onChange={(e) => setFormDetails(e.target.value)}
                          placeholder="Descreva seu projeto, dúvidas de arquitetura ou modelos de IA..."
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-cyan/60 font-sans resize-none"
                        />
                      </div>

                      <div className="pt-1 flex flex-col sm:flex-row gap-2">
                        <button
                          type="submit"
                          disabled={isSubmittingForm || !formName.trim() || !formContact.trim()}
                          className="flex-1 py-2 px-3 bg-brand-cyan hover:bg-brand-gold text-brand-dark font-mono text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          {isSubmittingForm ? (
                            <span>Enviando...</span>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>Enviar ao Arquiteto</span>
                            </>
                          )}
                        </button>

                        <a
                          href="https://wa.me/5555991812505?text=Ol%C3%A1%20Enrique,%20estava%20no%20assistente%20e%20gostaria%20de%20uma%20consulta%20direta."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-3 bg-emerald-950/60 hover:bg-emerald-500 text-emerald-300 hover:text-black border border-emerald-500/40 font-mono text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 text-center"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp Direto</span>
                        </a>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl rounded-tl-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="font-mono text-[10px] text-brand-cyan/80 ml-1">Sintetizando resposta...</span>
                  </div>
                </motion.div>
              )}

              {/* Quick Topic Chips */}
              {messages.length <= 2 && !isTyping && (
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 mb-2 text-gray-400">
                    <Compass className="w-3.5 h-3.5 text-brand-cyan" />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400">
                      Tópicos frequentes e contato direto:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_TOPICS.map((topic, i) => (
                      <button
                        key={i}
                        onClick={() => sendUserMessage(topic.prompt)}
                        className="text-[11px] font-mono text-left px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-brand-cyan/15 border border-white/10 hover:border-brand-cyan/40 text-gray-300 hover:text-brand-cyan transition-all"
                      >
                        {topic.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-white/10 bg-black/60">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Pergunte sobre arquitetura, Vertex AI ou solicite contato..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-3.5 pr-11 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan/50 focus:bg-white/10 transition-all font-mono"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-1.5 p-2 text-brand-cyan hover:text-brand-gold disabled:opacity-30 disabled:hover:text-brand-cyan transition-colors"
                  aria-label="Enviar mensagem"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
