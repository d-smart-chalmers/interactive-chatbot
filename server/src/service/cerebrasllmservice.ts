import Cerebras from "@cerebras/cerebras_cloud_sdk";
import type LLMService from "./llmservice.interface";

export default class CerebrasLLMService implements LLMService {
  private llmClient: Cerebras;
  constructor() {
    this.llmClient = new Cerebras({
      apiKey: process.env.CEREBRAS_API_KEY,
    });
  }
  async correctSpelling(
    userInput: string,
    scenarioAnswer: string,
  ): Promise<string> {
    const response = await this.llmClient.chat.completions.create({
      model: "llama3.1-8b",
      messages: [
        {
          role: "system",
          content: `
          You correct spelling in maritime communication messages.

          Rules:
          - Fix obvious spelling mistakes.
          - Correct NATO phonetic alphabet words if misspelled. The correct forms are:
            Alpha, Bravo, Charlie, Delta, Echo, Foxtrot, Golf, Hotel, India, Juliett,
            Kilo, Lima, Mike, November, Oscar, Papa, Quebec, Romeo, Sierra, Tango,
            Uniform, Victor, Whiskey, X-ray, Yankee, Zulu.
          - If they are spelled correctly, do not change them.
          - Do not modify call signs, coordinates, or numbers.
          - Return only the corrected text without comments.
          `,
        },
        {
          role: "user",
          content: userInput,
        },
      ],
      prediction: {
        type: "content",
        content: scenarioAnswer,
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
          content: `
          You compare two texts to determine if they mean the same thing.
          
          Rules:
          - Do not return any comments.
          - If they mean approximately the same thing, return true.
          - If they do not approximately the same thing, return false.
          `,
        },
        {
          role: "user",
          content: "Text 1: " + userInput,
        },
        {
          role: "user",
          content: "Text 2: " + scenarioAnswer,
        },
      ],
      prediction: {
        type: "content",
        content: bool,
      },
    });
    return (response as any).choices[0].message.content === bool;
  }
}
