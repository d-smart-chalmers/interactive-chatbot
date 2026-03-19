import express from "express";
import { initScenariosRouter, scenariosRouter } from "./router/scenarios";
import cors from "cors";
import session from "express-session";
import createMemoryStore from "memorystore";
import { aScenarios, bScenarios } from "./lib/scenarios";
import { ScenariosService } from "./service/scenarios";
import { config as configDotEnv } from "dotenv";
import { Scenario, Starter } from "./model/scenarios.interface";

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
    starter: s.starter as Starter,
    scenarioTurns: s.turns.map((t) => {
      return {
        vesselInstruction: t.vessel_instruction,
        vesselMessage: t.vessel_message,
        vtsMessage: t.vts_message,
        vtsInstruction: t.vts_instruction,
      };
    }),
  };
});
const bScen: Scenario[] = bScenarios.map((s) => {
  return {
    id: s.id,
    description: s.name,
    starter: s.starter as Starter,
    scenarioTurns: s.turns.map((t) => {
      return {
        vesselInstruction: t.vessel_instruction,
        vesselMessage: t.vessel_message,
        vtsMessage: t.vts_message,
        vtsInstruction: t.vts_instruction,
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
