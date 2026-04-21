import Cerebras from "@cerebras/cerebras_cloud_sdk";
import type LLMService from "./llmservice.interface.js";

//TODO: Remove in production
export default class CerebrasLLMService implements LLMService {
  private llmClient: Cerebras;
  constructor() {
    this.llmClient = new Cerebras({
      apiKey: process.env.CEREBRAS_API_KEY,
    });
  }
  async correctSpelling(userInput: string): Promise<string> {
    const response = await this.llmClient.chat.completions.create({
      model: "llama3.1-8b",
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
      prediction: {
        type: "content",
        content: userInput,
      },
    });
    return (response as any).choices[0].message.content;
  }
  async compareMeaning(
    userInput: string,
    scenarioAnswer: string,
  ): Promise<boolean> {
    const bool = "true";
    const response = await this.llmClient.chat.completions.create({
      model: "llama3.1-8b",
      messages: [
        {
          role: "system",
          content:
            `
          You compare a maritime communication message to determine if it is are similar and return only true or false.
          
          Rules:
          - Do not return any comments or notes.
          - If the messages have similar meaning and structure, return true.
          - If the message have different meaning, return false.

          Compare the message to: 
          ` + scenarioAnswer,
        },
        {
          role: "user",
          content: userInput,
        },
      ],
      prediction: {
        type: "content",
        content: bool,
      },
    });
    return (response as any).choices[0].message.content.toLowerCase() === bool;
  }
}
