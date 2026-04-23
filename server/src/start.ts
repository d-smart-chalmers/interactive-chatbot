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
import path from "path";
import { createRequestHandler } from "@react-router/express";

configDotEnv();

export const app = express();

const TwoHours = 2 * 60 * 60 * 1000;

if (!process.env.CLIENT_URL) {
  throw new Error("CLIENT_URL environment variable is not defined");
}
app.use((req, _res, next) => {
  if (!req.path.startsWith("/chat") && process.env.BASE_PATH === "/chat") {
    req.url = "/chat" + req.url;
    req.originalUrl = "/chat" + req.originalUrl;
  }
  next();
});
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
    cookie: {
      maxAge: TwoHours,
      httpOnly: true,
      sameSite: "lax",
      path: process.env.BASE_PATH || "/",
    },
    store: new MemoryStore({ checkPeriod: TwoHours }),
    secret: process.env.SESSION_SECRET || "test-secret",
    resave: false,
    saveUninitialized: false,
  }),
);
initScenariosRouter(scenariosService);
const basePath = process.env.BASE_PATH || "";
app.use(`${basePath}/scenarios`, scenariosRouter);
console.log(`${basePath}/scenarios`)

// STATISKA FILER
const publicPath = path.join(process.cwd(), "public");
// Serve resten av public (favicon etc)
app.use(`${basePath}/assets`, express.static(path.join(publicPath, "assets")));
app.use(basePath || "/", express.static(publicPath));

// REACT ROUTER HANDLER
const buildPath = "../build/server/index.js";

let build;
try {
  build = await import(buildPath);
} catch {
  console.warn("No React Router build found, skipping SSR handler");
  build = null;
}

if (build) {
  app.use(new RegExp(`^${basePath}(\\/.*)?$`), createRequestHandler({ build }));
}
