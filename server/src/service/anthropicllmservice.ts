import Anthropic from "@anthropic-ai/sdk";
import LLMService from "./llmservice.interface.js";

//TODO: Remove in production
export default class AnthropicLLMService implements LLMService {
  private llmClient: Anthropic;
  constructor() {
    this.llmClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async correctSpelling(userInput: string): Promise<string> {
    const response = await this.llmClient.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      output_config: {
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: {
              corrected_text: { type: "string" },
            },
            required: ["corrected_text"],
            additionalProperties: false,
          },
        },
      },
      system: [
        {
          type: "text",
          text: `
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
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: userInput,
        },
      ],
    });
    console.log(response);
    const json_schema =
      response.content[0]!.type === "text" ? response.content[0]!.text : "";
    const corrected_text = JSON.parse(json_schema).corrected_text as string;
    return corrected_text;
  }

  async compareMeaning(
    userInput: string,
    scenarioAnswer: string,
  ): Promise<boolean> {
    const response = await this.llmClient.messages.create({
      model: "claude-haiku-4-5-20251001",
      output_config: {
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: {
              same_meaning: { type: "boolean" },
            },
            required: ["same_meaning"],
            additionalProperties: false,
          },
        },
      },
      max_tokens: 10,
      system: `
          You compare a maritime communication message to determine if it is are similar and return only true or false.
          
          Rules:
          - Do not return any comments or notes.
          - If the messages have similar meaning and structure, return true.
          - If the message have different meaning, return false.

          Compare the message to: ${scenarioAnswer}`,
      messages: [
        {
          role: "user",
          content: userInput,
        },
      ],
    });
    console.log(response);
    const json_schema =
      response.content[0]!.type === "text" ? response.content[0]!.text : "";
    const same_meaning = JSON.parse(json_schema).same_meaning as boolean;
    return same_meaning;
  }
}
