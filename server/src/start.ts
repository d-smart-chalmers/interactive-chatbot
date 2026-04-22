import express from "express";
import { initScenariosRouter, scenariosRouter } from "./router/scenarios.js";
import cors from "cors";
import session from "express-session";
import createMemoryStore from "memorystore";
import { aScenarios, bScenarios } from "./lib/scenarios.js";
import { ScenariosService } from "./service/scenarios.js";
import { config as configDotEnv } from "dotenv";
import { Scenario } from "./model/scenarios.interface.js";
import { UserRole } from "@shared/scenarios/model.js";
import path from 'path';
// You'll need to install this: npm install @react-router/express
import { createRequestHandler } from "@react-router/express";

configDotEnv();

export const app = express();

const TwoHours = 2 * 60 * 60 * 1000;

if (!process.env.CLIENT_URL) {
  throw new Error("CLIENT_URL environment variable is not defined");
}

app.use(express.json());

//TODO: This has to be changed when we fetch the scenarios from the database
const aScen: Scenario[] = aScenarios.map((s) => {
  return {
    id: s.id,
    description: s.name,
    participants: {
      starter: {
        role: s.participants.starter.role as UserRole,
        name: s.participants.starter.name,
      },
      responder: {
        role: s.participants.responder.role as UserRole,
        name: s.participants.responder.name,
      },
    },
    scenarioTurns: s.turns.map((t) => {
      return {
        vesselInstruction: t.vessel_instruction ?? "",
        vesselMessage: t.vessel_message ?? "",
        vtsMessage: t.vts_message ?? "",
        vtsInstruction: t.vts_instruction ?? "",
      };
    }),
  };
});

const bScen: Scenario[] = bScenarios.map((s) => {
  return {
    id: s.id,
    description: s.name,
    participants: {
      starter: {
        role: s.participants.starter.role as UserRole,
        name: s.participants.starter.name,
      },
      responder: {
        role: s.participants.responder.role as UserRole,
        name: s.participants.responder.name,
      },
    },
    scenarioTurns: s.turns.map((t) => {
      return {
        vesselInstruction: t.vessel_instruction ?? "",
        vesselMessage: t.vessel_message ?? "",
        vtsMessage: t.vts_message ?? "",
        vtsInstruction: t.vts_instruction ?? "",
      };
    }),
  };
});

const scenariosService = new ScenariosService(aScen, bScen);

const MemoryStore = createMemoryStore(session);
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(
  session({
    cookie: { maxAge: TwoHours, httpOnly: true, sameSite: "lax" },
    store: new MemoryStore({ checkPeriod: TwoHours }),
    secret: process.env.SESSION_SECRET || "test-secret",
    resave: false,
    saveUninitialized: false,
  }),
);
initScenariosRouter(scenariosService);
app.use("/scenarios", scenariosRouter);

// 1. STATISKA FILER - Måste ligga absolut först
const publicPath = path.join(process.cwd(), 'public');

// Denna rad sköter allt under /chat/assets/...
// Vi mappar det direkt så att ingen annan kod hinner lägga sig i
app.use("/chat/assets", express.static(path.join(publicPath, "assets"), {
  immutable: true,
  maxAge: "1y",
  index: false
}));

// Denna sköter favicon och andra filer i roten av public
app.use("/chat", express.static(publicPath, { index: false }));

// 2. LOGGA FÖR ATT SE VAD SOM HÄNDER
app.use((req, res, next) => {
  console.log(`Inkommande: ${req.method} ${req.url}`);
  next();
});

// 3. FIXA URL FÖR REACT ROUTER
app.use((req, res, next) => {
  // Om det INTE är en fil (ingen punkt) och INTE börjar med /chat
  if (!req.url.includes('.') && !req.url.startsWith("/chat")) {
    const oldUrl = req.url;
    req.url = "/chat" + (req.url.startsWith("/") ? "" : "/") + req.url;
    req.originalUrl = req.url;
    console.log(`Rewriting: ${oldUrl} -> ${req.url}`);
  }
  next();
});

// 4. REACT ROUTER HANDLER
const buildPath = "../build/server/index.js";
app.all(
  /^\/chat.*/, 
  async (req, res, next) => {
    try {
      const { createRequestHandler } = await import("@react-router/express");
      const handler = createRequestHandler({
        // @ts-ignore
        build: () => import(buildPath),
      });
      return handler(req, res, next);
    } catch (error) {
      console.error("RR Handler Error:", error);
      next(error);
    }
  }
);