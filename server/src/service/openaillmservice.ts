import OpenAI from "openai";
import LLMService from "./llmservice.interface.js";
import { zodResponseFormat } from "openai/helpers/zod";
import z from "zod";
import { HttpError } from "@src/router/httpError.js";

export default class OpenAILLMService implements LLMService {
  private llmClient: OpenAI;
  private correctSpellingResponse = z.object({
    corrected_text: z.string(),
  });
  private compareMeaningResponse = z.object({
    same_meaning: z.boolean(),
  });
  constructor() {
    this.llmClient = new OpenAI({
      baseURL: process.env.OPENAI_BASE_URL,
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  async correctSpelling(userInput: string): Promise<string> {
    try {
      const response = await this.llmClient.chat.completions.create({
        model: "gpt-5.4-nano",
        reasoning_effort: "none",
        messages: [
          {
            role: "system",
            content: `
            You correct spelling in maritime communication messages.
  
            Rules:
            - Fix only obvious spelling mistakes.
            - Correct NATO phonetic alphabet words if slightly misspelled.
            - If phonetic alphabet words are spelled correctly, do not change them.
            - Do not modify call signs, coordinates, or numbers.
            - Return only the original text with corrected spelling.
            - Do not add any comments or notes.
            - Do not alter the meaning of the message.
            `,
          },
          {
            role: "user",
            content: userInput,
          },
        ],
        response_format: zodResponseFormat(
          this.correctSpellingResponse,
          "json_schema",
        ),
      });
      console.log(response);
      const json_schema = response.choices[0]?.message?.content as string;
      console.log(json_schema);
      const corrected_text = JSON.parse(json_schema).corrected_text as string;
      return corrected_text;
    } catch (error) {
      const status =
        error instanceof Error && "status" in error
          ? (error as any).status
          : 500;
      throw new HttpError(
        "Problem with LLM access to generate feedback.",
        status,
      );
    }
  }
  async compareMeaning(
    userInput: string,
    scenarioAnswer: string,
  ): Promise<boolean> {
    try {
      const response = await this.llmClient.chat.completions.create({
        model: "gpt-5.4-nano",
        reasoning_effort: "medium",
        messages: [
          {
            role: "system",
            content: `
            You compare a maritime communication message to determine if it is are similar and return only true or false.
            
            Rules:
            - Do not return any comments or notes.
            - If the messages have similar meaning, return true.
            - If the message have different meaning, return false.
  
            Compare the message to: ${scenarioAnswer}`,
          },
          {
            role: "user",
            content: userInput,
          },
        ],
        response_format: zodResponseFormat(
          this.compareMeaningResponse,
          "json_schema",
        ),
      });

      console.log(response);
      const json_schema = response.choices[0]?.message?.content as string;
      console.log(json_schema);
      const same_meaning = JSON.parse(json_schema).same_meaning as boolean;
      return same_meaning;
    } catch (error) {
      const status =
        error instanceof Error && "status" in error
          ? (error as any).status
          : 500;
      throw new HttpError(
        "Problem with LLM access to generate feedback.",
        status,
      );
    }
  }
}
