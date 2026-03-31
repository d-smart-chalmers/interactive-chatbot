import Cerebras from "@cerebras/cerebras_cloud_sdk";
import type LLMService from "./llmservice.interface";

export default class CerebrasLLMService implements LLMService {
  private llmClient: Cerebras;
  constructor() {
    this.llmClient = new Cerebras({
      apiKey: process.env.CEREBRAS_API_KEY,
    });
  }
  async correctSpelling(text: string): Promise<string> {
    const prompt =
      "I want you to correct any obvious spelling or grammar misstakes in this text. Only correct the text, if necessary, and dont add any comments.";
    const response = await this.llmClient.chat.completions.create({
      model: "llama3.1-8b",
      messages: [
        {
          role: "user",
          content: prompt,
        },
        {
          role: "user",
          content: text,
        },
      ],
      prediction: {
        type: "content",
        content: text,
      },
    });
    return (response as any).choices[0].message.content;
  }
  async compareMeaning(text1: string, text2: string): Promise<boolean> {
    const prompt =
      "I want you to compare the following two texts determine if they mean the same thing. Do not return any comments. If they approximately mean the same return 'true', else return 'false'";
    const bool = "true";
    const response = await this.llmClient.chat.completions.create({
      model: "llama3.1-8b",
      messages: [
        {
          role: "user",
          content: prompt,
        },
        {
          role: "user",
          content: "Text 1: " + text1,
        },
        {
          role: "user",
          content: "Text 2: " + text2,
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
