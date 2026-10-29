import dotenv from "dotenv";
dotenv.config({ override: true });
import express from "express";

import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { projects } from "./src/data/projects.js";
import Stripe from "stripe";
import { MercadoPagoConfig, Preference } from "mercadopago";
import nodemailer from "nodemailer";
import { initializeApp as initClientApp } from 'firebase/app';
import { getFirestore as getClientFirestore, doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs, updateDoc, increment } from 'firebase/firestore';
import { emailSequence } from "./src/data/emailSequence.js";
import { generateCognitiveResponse } from "./src/cognitiveAssistant.js";

let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

// Initialize Firebase SDK for Server Environment (bypass admin SDK constraints)
let clientDb: any = null;
try {
  const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf8"));
  const clientApp = initClientApp(firebaseConfig);
  clientDb = getClientFirestore(clientApp, firebaseConfig.firestoreDatabaseId);
  console.log("Firebase Client SDK initialized on server successfully.");
} catch (error: any) {
  console.log("Firebase Client SDK setup failed:", error.message);
}

let transporter: nodemailer.Transporter | null = null;
function getTransporter() {
  if (!transporter) {
    const user = "info@cyberorganicagency.com";
    // Check multiple environment variables because user mixed them up
    const pass = process.env.ZOHO_PASS || process.env.ZOHO_USER_CyberOrganic || process.env.ZOHO_USER;
    if (!pass) {
      console.warn("ZOHO_PASS is missing. Email sending will fail.");
    }
    transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: user,
        pass: pass,
      },
    });
  }
  return transporter;
}

async function sendSequenceEmail(email: string, name: string, dayIndex: number) {
  const template = emailSequence[dayIndex];
  if (!template) return;

  const senderEmail = "info@cyberorganicagency.com";
  const mailOptions = {
    from: `"Cyber Organic Agency" <${senderEmail}>`,
    to: email,
    subject: template.subject,
    html: template.body.replace("Hola,", `Hola ${name},`),
  };

  try {
    const info = await getTransporter().sendMail(mailOptions);
    console.log(`Email sent: Day ${dayIndex + 1} to ${email}`, info.messageId);
    return true;
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
    return false;
  }
}


let mpClient: MercadoPagoConfig | null = null;
export function getMercadoPago() {
  if (!mpClient) {
    const token = process.env.MP_ACCESS_TOKEN || "APP_USR-TEST-TOKEN"; // Fallback for dev
    mpClient = new MercadoPagoConfig({ accessToken: token });
  }
  return mpClient;
}


async function startServer() {
  const app = express();
  const PORT = process.env.DEFAULT_APP_PORT || process.env.PORT || 8080;

  let vite: any;

  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);

  } else {
    app.use(express.static(path.join(process.cwd(), "dist"), { index: false }));
  }

  // Use JSON middleware for API routes BEFORE shared routes
  app.use(express.json());

  // Subscribe Lead to 9-day Sequence
  app.post("/api/subscribe", async (req, res) => {
    console.log("Subscription request received:", req.body);
    try {
      const { email, name } = req.body;
      if (!email || !name) {
        console.log("Missing fields:", { email, name });
        return res.status(400).json({ error: "Email and name are required." });
      }

      console.log("Accessing Firestore...");
      if (!clientDb) throw new Error("Database not connected");
      
      // Check if already subscribed
      const leadRef = doc(clientDb, "leads", email.toLowerCase());
      console.log("Getting lead doc for:", email.toLowerCase());
      const leadDoc = await getDoc(leadRef);

      if (leadDoc.exists()) {
        console.log("Lead already exists:", email);
        
        // Resend confirmation email for testing purposes
        console.log("Resending confirmation email to existing lead...");
        const transporter = getTransporter();
        const senderEmail = "info@cyberorganicagency.com";
        try {
          await transporter.sendMail({
            from: `"Cyber Organic Agency" <${senderEmail}>`,
            to: email,
            subject: "✓ Inscripción Confirmada - Desafío de 9 Días (Re-enviado)",
            html: `
              <div style="font-family: 'Space Grotesk', Arial, sans-serif; max-width: 600px; padding: 30px; border: 1px solid #eeeeee; background-color: #050505; color: #ffffff;">
                <h2 style="color: #00dce5; text-transform: uppercase; letter-spacing: 0.1em;">Inscripción Confirmada</h2>
                <p style="font-size: 16px; color: #e5e7eb;">Hola ${name},</p>
                <p style="font-size: 16px; color: #e5e7eb; line-height: 1.6;">Vimos que intentaste inscribirte nuevamente. Tu lugar en el <strong>Desafío de 9 Días: Escala tu Presencia Bio-Digital</strong> ya estaba confirmado, ¡pero aquí tienes tu confirmación nuevamente!</p>
                <p style="font-size: 16px; color: #e5e7eb; line-height: 1.6;">Asegúrate de revisar tu carpeta de "Promociones" o "Spam" si no has visto nuestros correos anteriores.</p>
                <hr style="border: none; border-top: 1px solid #333333; margin: 30px 0;">
                <p style="font-size: 14px; color: #a1a1aa;">Nos vemos en la cima,<br>El equipo de <span style="color: #00dce5;">CYBER ORGANIC</span></p>
              </div>
            `
          });
          console.log("Re-sent confirmation email.");
        } catch (confirmError) {
          console.error("Failed to re-send confirmation email:", confirmError);
        }

        return res.status(200).json({ message: "Ya estás suscrito al desafío. Te hemos reenviado la confirmación." });
      }

      // Save to Firestore
      console.log("Saving new lead to Firestore...");
      await setDoc(leadRef, {
        email: email.toLowerCase(),
        name,
        subscribedAt: serverTimestamp(),
        lastEmailSentIndex: 0, // Day 1
        lastSentAt: serverTimestamp(),
        status: "active",
      });
      console.log("Lead saved successfully.");

      // Send Confirmation Email
      console.log("Sending confirmation email...");
      const transporter = getTransporter();
      const senderEmail = "info@cyberorganicagency.com";
      
      try {
        await transporter.sendMail({
          from: `"Cyber Organic Agency" <${senderEmail}>`,
          to: email,
          subject: "✓ Inscripción Confirmada - Desafío de 9 Días",
          html: `
            <div style="font-family: 'Space Grotesk', Arial, sans-serif; max-width: 600px; padding: 30px; border: 1px solid #eeeeee; background-color: #050505; color: #ffffff;">
              <h2 style="color: #00dce5; text-transform: uppercase; letter-spacing: 0.1em;">Inscripción Confirmada</h2>
              <p style="font-size: 16px; color: #e5e7eb;">Hola ${name},</p>
              <p style="font-size: 16px; color: #e5e7eb; line-height: 1.6;">Tu lugar en el <strong>Desafío de 9 Días: Escala tu Presencia Bio-Digital</strong> está totalmente confirmado.</p>
              <p style="font-size: 16px; color: #e5e7eb; line-height: 1.6;">Estamos muy emocionados de acompañarte en este proceso estratégico de transformación. A partir de hoy, recibirás contenido de alto valor diseñado para elevar la esencia de tu marca al nivel premium.</p>
              <div style="background-color: #111111; padding: 15px; border-left: 4px solid #00dce5; margin: 25px 0;">
                <p style="margin: 0; font-size: 14px; color: #a1a1aa;"><strong>Importante:</strong> Agrega esta dirección (${senderEmail}) a tus contactos y revisa tu carpeta de "Promociones" o "Spam" para asegurarte de recibir cada día del desafío sin interrupciones.</p>
              </div>
              <p style="font-size: 16px; color: #e5e7eb; line-height: 1.6;">En un instante recibirás el correo del <strong>Día 1</strong> con tu primera lección.</p>
              <hr style="border: none; border-top: 1px solid #333333; margin: 30px 0;">
              <p style="font-size: 14px; color: #a1a1aa;">Nos vemos en la cima,<br>El equipo de <span style="color: #00dce5;">CYBER ORGANIC</span></p>
            </div>
          `
        });
        console.log("Confirmation email sent.");
      } catch (confirmError) {
        console.error("Failed to send confirmation email, but continuing:", confirmError);
      }

      // Send Day 1 Email immediately
      console.log("Sending initial email...");
      await sendSequenceEmail(email, name, 0);
      console.log("Email sent sequence initiated.");

      res.status(200).json({ success: true, message: "¡Suscripción exitosa! Revisa tu correo." });
    } catch (error: any) {
      console.error("CRITICAL SUBSCRIPTION ERROR:", error);
      res.status(500).json({ 
        error: "Error en el servidor. Inténtalo de nuevo."
      });
    }
  });

  // B2B Provisioning & Contact Form Submission (sending to enrique.rfm@gmail.com and Firestore)
  app.post("/api/contact", async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        company,
        organization,
        services,
        deploymentTypes,
        description,
        environmentDetails,
        budget,
        deadline,
        tier
      } = req.body;

      const orgName = organization || company || 'N/A';
      const deployments = deploymentTypes || services || [];
      const details = environmentDetails || description || 'N/A';

      // Persist to Firestore if clientDb is initialized
      if (clientDb) {
        try {
          const reqRef = doc(collection(clientDb, "provisioning_requests"));
          await setDoc(reqRef, {
            name: name || '',
            email: (email || '').toLowerCase(),
            phone: phone || null,
            organization: orgName,
            deploymentTypes: Array.isArray(deployments) ? deployments : [deployments],
            environmentDetails: details,
            tier: tier || null,
            createdAt: serverTimestamp(),
            status: "pending_review"
          });
          console.log("Provisioning request persisted to Firestore successfully.");
        } catch (dbErr: any) {
          console.warn("Could not save to Firestore provisioning_requests:", dbErr.message);
        }
      }

      const transporter = getTransporter();
      const senderEmail = "info@cyberorganicagency.com";
      const adminEmail = "enrique.rfm@gmail.com";

      const mailOptions = {
        from: `"Cyber Organic Platform" <${senderEmail}>`,
        to: adminEmail,
        replyTo: email,
        subject: `EVALUACIÓN DE ARQUITECTURA: ${name} (${orgName}) - Cyber Organic`,
        html: `
          <div style="font-family: 'Space Grotesk', Arial, sans-serif; max-width: 600px; padding: 25px; border: 1px solid #1f2937; background-color: #0b0f17; color: #f3f4f6;">
            <div style="border-bottom: 2px solid #00dce5; padding-bottom: 12px; margin-bottom: 20px;">
              <span style="font-size: 11px; color: #00dce5; text-transform: uppercase; letter-spacing: 0.15em;">PORTAL B2B & RUNTIME GATEWAY</span>
              <h2 style="color: #ffffff; margin: 6px 0 0 0; font-size: 20px;">Solicitud de Evaluación de Arquitectura</h2>
            </div>
            
            <p style="margin: 8px 0; font-size: 14px;"><strong style="color: #d4af37;">Solicitante:</strong> ${name} &lt;${email}&gt;</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong style="color: #d4af37;">Organización / Startup:</strong> ${orgName}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong style="color: #d4af37;">Teléfono / WhatsApp:</strong> ${phone || 'N/A'}</p>
            ${tier ? `<p style="margin: 8px 0; font-size: 14px;"><strong style="color: #d4af37;">Licencia / Tier:</strong> ${tier}</p>` : ''}
            
            <div style="margin: 20px 0; padding: 15px; background-color: #111827; border-left: 3px solid #00dce5;">
              <h4 style="margin: 0 0 10px 0; color: #00dce5; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Tipos de Despliegue Solicitados:</h4>
              <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #e5e7eb;">
                ${Array.isArray(deployments) && deployments.length > 0 
                  ? deployments.map(d => `<li style="margin-bottom: 4px;">${d}</li>`).join('')
                  : '<li>No especificado</li>'}
              </ul>
            </div>

            <div style="margin: 20px 0;">
              <h4 style="margin: 0 0 8px 0; color: #d4af37; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Detalles del Entorno / Objetivos:</h4>
              <p style="white-space: pre-wrap; font-size: 13px; color: #d1d5db; background-color: #111827; padding: 12px; border-radius: 4px; border: 1px solid #374151;">${details}</p>
            </div>

            <hr style="border: none; border-top: 1px solid #1f2937; margin: 25px 0;">
            <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">
              Plataforma de Infraestructura Bio-Digital e Inteligencia Artificial Aplicada · Cyber Organic
            </p>
          </div>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Email dispatch completed successfully.");
      } catch (mailErr: any) {
        console.warn("Could not dispatch SMTP email (lead saved to DB/state):", mailErr.message);
      }

      res.status(200).json({ success: true, message: "Solicitud registrada exitosamente." });
    } catch (error: any) {
      console.error("Contacto Error:", error);
      res.status(500).json({ error: "Error interno al enviar el contacto.", details: error.message });
    }
  });

  // Admin Pulse: Send next emails to active leads (manual trigger for demo)
  app.post("/api/admin/process-emails", async (req, res) => {
    try {
      if (!clientDb) throw new Error("Database not connected");
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const q = query(collection(clientDb, "leads"), 
        where("status", "==", "active"),
        where("lastSentAt", "<=", twentyFourHoursAgo)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return res.json({ message: "No hay correos pendientes por enviar hoy." });
      }

      let count = 0;
      for (const snapshotDoc of snapshot.docs) {
        const lead = snapshotDoc.data();
        const nextIndex = lead.lastEmailSentIndex + 1;

        if (nextIndex < emailSequence.length) {
          const success = await sendSequenceEmail(lead.email, lead.name, nextIndex);
          if (success) {
            await updateDoc(snapshotDoc.ref, {
              lastEmailSentIndex: nextIndex,
              lastSentAt: serverTimestamp(),
            });
            count++;
          }
        } else {
          // Finished the sequence
          await updateDoc(snapshotDoc.ref, { status: "completed" });
        }
      }

      res.json({ success: true, emailsSent: count });
    } catch (error: any) {
      console.error("Pulse Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Use raw body for Stripe Webhook BEFORE express.json
  app.post('/api/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const stripe = getStripe();
    // Use an environment variable for the webhook secret
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      console.warn("STRIPE_WEBHOOK_SECRET is not set, webhook cannot be verified.");
      return res.status(400).send(`Webhook Error: Secret not configured.`);
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // IMPORTANT: In order to update the database from the backend, 
    // we need firebase-admin setup. In this AI studio environment without a service account,
    // we would typically use application default credentials or explicitly provide a service account JSON.
    // For now we will log the success and note the next steps.

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan;
      
      console.log(`✅ Payment received for User ID: ${userId}, Plan: ${plan}`);
      
      if (userId) {
        try {
          if (!clientDb) throw new Error("Database not connected");
          
          if (plan === 'Cyber Organic PRO') {
            // Subscription: Give them 1000 limits and "pro" role
            await updateDoc(doc(clientDb, 'users', userId), {
              maxDailyUsage: 1000,
              role: 'pro'
            });
            console.log("Updated user to PRO role");
          } else {
            // 5 USD Pack: Give them 50 credits/generations as a permanent addition
            await updateDoc(doc(clientDb, 'users', userId), {
              maxDailyUsage: increment(50)
            });
            console.log("Added 50 generations to user");
          }
        } catch (dbError) {
          console.error("Failed to update user in Firestore:", dbError);
        }
      }
    }

    res.json({received: true});
  });

  // Use JSON middleware for API routes AFTER raw endpoints
  app.use(express.json());

  // API Routes
  
  // AI Endpoints
  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;
    let aiResponseText = "";

    const apiKey = process.env.MY_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "undefined" && apiKey.trim() !== "") {
      try {
        const ai = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
        const chat = ai.chats.create({
          model: "gemini-3.8-flash",
          config: {
            systemInstruction: `Eres el Asistente Virtual Oficial y Consultor de Arquitectura Tecnológica de Cyber Organic (https://cyberorganic.com). Tu perfil es el de un Ingeniero Consultor de Soluciones Cloud e Inteligencia Artificial: empático, didáctico, tecnológicamente riguroso, sofisticado y altamente capacitado para orientar tanto a perfiles técnicos (CTOs, arquitectos de software, desarrolladores) como a decisores de negocio o visitantes sin conocimientos técnicos.

MISIÓN PEDAGÓGICA PRIORITARIA:
Los conceptos de "Infraestructura Bio-Digital", "Living Data Engine", "Agentes Cognitivos con Vertex AI" y "Arquitectura Serverless Elástica" son muy recientes y la mayoría de las personas no los comprende o los confunde con páginas web estáticas o chatbots genéricos.
Tu función principal es explicar, aclarar, desmitificar y ejemplificar estos temas con absoluta claridad y paciencia:
- Para usuarios no técnicos: Explica con analogías cotidianas e ilustrativas (ej: "un sitio web tradicional es como un cartel estático de papel; una infraestructura bio-digital es como un organismo vivo que percibe en tiempo real lo que el usuario necesita y se adapta al instante").
- Para profesionales técnicos: Proporciona detalles de ingeniería sobre Google Cloud Platform (GCP), Google Cloud Run, Vertex AI, Firebase Hosting, pipelines CI/CD y estándares de certificación Associate Cloud Engineer (ACE).

REGLA DE ORO DE IDIOMA (MULTILINGÜISMO NATIVO):
Detecta automáticamente el idioma en el que escribe el visitante (Portugués, Español, Inglés, etc.) y responde SIEMPRE en ese mismo idioma con fluidez nativa y calidez profesional. Si el usuario escribe en portugués, explica todo con naturalidad y precisión en portugués.

GLOSARIO Y CONCEPTOS FUNDAMENTALES:
1. Infraestructura Bio-Digital:
   - Qué es: Plataforma de software desacoplado donde la interfaz y los servicios perimetrales reaccionan en tiempo real a la telemetría del usuario, comportándose con la adaptabilidad y dinamismo de un organismo vivo.
   - Beneficio clave: Latencia perimetral ultra-baja (<80ms), puntuación perfecta 100/100 en Core Web Vitals, mayor retención y adaptación dinámica del entorno digital.
2. Living Data (Living Data Engine):
   - Qué es: Procesamiento continuo de eventos y flujos de telemetría en tiempo real en el borde (Edge) sin sobrecargar el cliente ni depender de bases de datos lentas.
   - Aplicación: Monitoreo en vivo de flujo y salud de sistemas; puedes invitar al usuario a ver el monitor en tiempo real en la pestaña "/living-data".
3. Agentes Cognitivos & Vertex AI:
   - Qué es: No son chatbots simples ni respuestas prefabricadas. Son agentes autónomos construidos sobre Vertex AI, "grounded" (anclados en datos corporativos reales), capaces de razonar, procesar lenguaje semántico y ejecutar automatizaciones de procesos en entornos cloud seguros.
4. Arquitectura Serverless de Alta Resiliencia:
   - Qué es: Infraestructura basada en Google Cloud Run y Firebase Hosting que escala elásticamente de cero a alta concurrencia sin costos fijos de servidores ociosos, con 99.99% de Uptime Global garantizado y aislamiento de credenciales con Google Service Accounts.

MÓDULOS DE SOFTWARE DE CYBER ORGANIC:
1. Bio-Digital Edge Runtime (Web): Motor front-end desacoplado de máxima optimización, Headless, Edge Caching en la red mundial de Google, CI/CD automatizado.
2. Multi-Tenant & Micro-SaaS Engine: Plataforma base con Google OAuth nativo, control de cuotas diarias en Python y distribución como PWA (Android / iOS / Desktop).
3. Managed Cloud & AI Gateway: Aprovisionamiento elástico en Google Cloud Run, Vertex AI y observabilidad con Cloud Logging & IAM.

TIERS DE LICENCIAMIENTO:
- Starter License: PWA instalable, Google Identity, hasta 4 inferencias/día de IA, despliegue en Firebase/Cloud Run. Ideal para validación rápida.
- Enterprise Runtime: Todo lo de Starter + Living Data Engine, Vertex AI Agent Builder y observabilidad con Cloud Logging.
- Dedicated Cluster Architecture: Para organizaciones con infraestructura crítica. Tenant aislado, estándares de arquitectura Google Cloud ACE y soporte de ingeniería dedicado.

CASOS DE DESPLIEGUE EN PRODUCCIÓN (DEPLOYMENTS):
- Rancho Branco: Runtime transaccional y turismo bio-digital, con alta concurrencia estacional y experiencia móvil ultra-rápida.
- Atalaya 24: Monitoreo crítico y backend serverless sobre Cloud Run y Firebase con tiempos de respuesta bajo 100ms.
- Verdant AI: Orquestación cognitiva y flujo de datos semánticos en tiempo real con Living Data Engine.

LABORATORIO DE I+D:
- SakuraWebs Core Engine: El núcleo experimental de Cyber Organic donde se validan tuberías CI/CD, aislamiento de credenciales con Google Service Accounts, grounding de agentes en Vertex AI y aceleradores de software.

LIDERAZGO Y ARQUITECTURA:
- Enrique Rolando Fernandez Manas — Founder & Lead Cloud Architect. Especialista en diseño de arquitecturas en la nube sobre Google Cloud Platform (GCP) con enfoque en estándares Associate Cloud Engineer (ACE), rendimiento extremo (Core Web Vitals), ciberseguridad perimetral y desarrollo serverless con Python, Cloud Run, Firebase y Vertex AI, con más de dos décadas de experiencia previa en análisis de sistemas y gobernanza de infraestructura crítica.

AI STUDIO:
- En la sección "/ai-studio", Cyber Organic ofrece una suite interactiva de generación de contenido multimodal (texto e imágenes impulsadas por IA) para experimentar de primera mano con la inteligencia artificial aplicada.

CANALES DE CONTACTO Y APROVISIONAMIENTO B2B:
- Si el usuario desea contratar, solicitar una demo, un tier de licencia o una Evaluación de Arquitectura gratuita: ofrécele la opción de dejar sus datos directamente en este chat o conectar con el Lead Cloud Architect Enrique Rolando Fernandez Manas por WhatsApp directo (+55 55 99181 2505) o correo (enrique.rfm@gmail.com). NUNCA lo mandes a buscar datos al pie de página ni al footer; el asistente cuenta con captura directa de requerimientos.`,
          },
          history: history,
        });
        const response = await chat.sendMessage({ message });
        aiResponseText = response.text || "";
      } catch (geminiError: any) {
        console.warn("External Gemini API call error, engaging local Cognitive Assistant engine:", geminiError?.message || geminiError);
      }
    }

    if (aiResponseText && aiResponseText.trim().length > 0) {
      return res.json({ text: aiResponseText });
    }

    // Failover: Cognitive Knowledge Engine
    const cognitiveResult = generateCognitiveResponse(message || "");
    return res.json({
      text: cognitiveResult.text,
      options: cognitiveResult.options
    });
  });

  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      const ai = new GoogleGenAI({ apiKey: (process.env.MY_GEMINI_API_KEY || process.env.GEMINI_API_KEY) });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Generate API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt, aspectRatio } = req.body;
      const ai = new GoogleGenAI({ apiKey: (process.env.MY_GEMINI_API_KEY || process.env.GEMINI_API_KEY) });
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio,
        }
      });
      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64EncodeString = response.generatedImages[0].image.imageBytes;
        res.json({ imageResult: `data:image/jpeg;base64,${base64EncodeString}` });
      } else {
        throw new Error("No se pudo generar la imagen.");
      }
    } catch (error: any) {
      console.error("Image Generate API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/create-mercadopago-preference", async (req, res) => {
    try {
      const mp = getMercadoPago();
      const preference = new Preference(mp);
      const { priceId, mode, amount, name, description, userEmail, userId, currencyId } = req.body;
      const appUrl = process.env.APP_URL || "http://localhost:3000";
      
      const result = await preference.create({
        body: {
          items: [
            {
              id: priceId,
              title: name,
              description: description,
              quantity: 1,
              unit_price: amount,
              currency_id: currencyId || "BRL"
            }
          ],
          payer: {
            email: userEmail
          },
          external_reference: userId,
          metadata: {
            userId: userId,
            plan: name
          },
          back_urls: {
            success: req.body.redirectUrl ? `${appUrl}${req.body.redirectUrl}?checkout=success` : `${appUrl}/ai-studio?checkout=success`,
            pending: req.body.redirectUrl ? `${appUrl}${req.body.redirectUrl}?checkout=pending` : `${appUrl}/ai-studio?checkout=pending`,
            failure: req.body.redirectUrl ? `${appUrl}${req.body.redirectUrl}?checkout=canceled` : `${appUrl}/ai-studio?checkout=canceled`
          },
          auto_return: "approved"
        }
      });

      res.status(200).json({ sessionId: result.id, url: result.init_point });
    } catch (e: any) {
      console.error("MercadoPago Checkout Error:", e);
      res.status(500).json({ error: e.message });
    }
  });

      

  // Intercept all routes and inject OG tags
  app.get("*", async (req, res, next) => {
    try {
      let template: string;
      if (process.env.NODE_ENV !== "production") {
        template = await fsPromises.readFile(path.join(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(req.url, template);
      } else {
        template = await fsPromises.readFile(path.join(process.cwd(), "dist/index.html"), "utf-8");
      }

      const hostUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
      const urlPath = req.url.split('?')[0];

      // Default tags fallback
      let ogTitle = "CYBER ORGANIC AGENCY | Agencia de Marketing Digital y Desarrollo Web";
      let ogDesc = "Agencia creativa global especialista en diseño web de alta gama, servicios de marketing digital, producción de contenido cinematográfico y soluciones con Inteligencia Artificial.";
      let ogImage = `${hostUrl}/og-image.png`;
      let ogType = "website";
      let ogUrl = `${hostUrl}${urlPath}`;
      let isPortfolio = false;

      // Enhance SEO with dynamic matching for common routes
      if (urlPath === '/' || urlPath === '') {
        ogTitle = "CYBER ORGANIC AGENCY | Lujo Digital, Agencia de Marketing y Diseño Web";
        ogDesc = "Potencia tu marca con nuestra agencia líder en servicios de diseño web premium, producción bio-digital y estrategias para creación de contenido en Hispanoamérica y el mundo.";
      } else if (urlPath === '/ai-studio' || urlPath === '/generador') {
        ogTitle = "AI Studio | Creador de Contenido e Imágenes con Inteligencia Artificial | Cyber Organic";
        ogDesc = "Descubre nuestra herramienta premium de Inteligencia Artificial. Crea textos para redes sociales, ideas de marketing, memes e imágenes hiperrealistas en segundos. Innovación en creación de contenido.";
      }

      // If viewing a portfolio item, substitute
      const portafolioMatch = req.url.match(/\/portafolio\/(\d+)/);
      if (portafolioMatch) {
        isPortfolio = true;
        const id = parseInt(portafolioMatch[1]);
        const project = projects.find((p) => p.id === id);
        if (project) {
          ogTitle = project.metaTitle || `${project.title} | CYBER ORGANIC AGENCY`;
          ogDesc = project.metaDesc || project.desc;
          
          // Determine complete image URL if relative
          if (project.image.startsWith("http")) {
            ogImage = project.image;
          } else {
            const imgPath = project.image.startsWith('/') ? project.image : `/${project.image}`;
            ogImage = `${hostUrl}${imgPath}`;
          }
          
          // Match Mime Type for strict parsers like Facebook
          if (ogImage.toLowerCase().includes(".webp")) {
            ogType = "image/webp";
          } else if (ogImage.toLowerCase().includes(".jpg") || ogImage.toLowerCase().includes(".jpeg")) {
            ogType = "image/jpeg";
          } else if (ogImage.toLowerCase().includes(".png")) {
            ogType = "image/png";
          } else {
            ogType = "website"; // fallback
          }
        }
      }

      // Regex replace the tags in HTML
      let htmlWithTags = template
        .replace(/<title>.*<\/title>/, `<title>${ogTitle}</title>`)
        .replace(/<meta name="title" content="[^"]*" \/>/g, `<meta name="title" content="${ogTitle}" />`)
        .replace(/<meta property="og:title" content="[^"]*" \/>/g, `<meta property="og:title" content="${ogTitle}" />`)
        .replace(/<meta property="twitter:title" content="[^"]*" \/>/g, `<meta property="twitter:title" content="${ogTitle}" />`)
        .replace(/<meta name="description" content="[^"]*" \/>/g, `<meta name="description" content="${ogDesc}" />`)
        .replace(/<meta property="og:description" content="[^"]*" \/>/g, `<meta property="og:description" content="${ogDesc}" />`)
        .replace(/<meta property="twitter:description" content="[^"]*" \/>/g, `<meta property="twitter:description" content="${ogDesc}" />`)
        .replace(/<meta property="og:image" content="[^"]*" \/>/g, `<meta property="og:image" content="${ogImage}" />\n    <meta property="og:image:secure_url" content="${ogImage}" />`)
        .replace(/<meta property="twitter:image" content="[^"]*" \/>/g, `<meta property="twitter:image" content="${ogImage}" />`)
        .replace(/<meta property="og:url" content="[^"]*" \/>/g, `<meta property="og:url" content="${ogUrl}" />`)
        .replace(/<meta property="twitter:url" content="[^"]*" \/>/g, `<meta property="twitter:url" content="${ogUrl}" />`)
        .replace(/<meta property="og:image:type" content="[^"]*" \/>/g, `<meta property="og:image:type" content="${ogType}" />`);

      // Removing the deletion of width and height. Facebook strongly prefers them.

      res.status(200).set({ "Content-Type": "text/html" }).end(htmlWithTags);
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        vite.ssrFixStacktrace(e);
      }
      console.error(e);
      next(e);
    }
  });

  app.listen(PORT, () => {
    console.log(`SSR Proxy Server running on http://localhost:${PORT}`);
  });
}

startServer();
