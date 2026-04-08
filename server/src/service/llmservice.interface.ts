export default interface LLMService {
  correctSpelling(userInput: string): Promise<string>;
  compareMeaning(userInput: string, scenarioAnswer: string): Promise<boolean>;
}
