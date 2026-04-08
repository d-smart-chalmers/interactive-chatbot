export default interface LLMService {
  correctSpelling(userInput: string, scenarioAnswer: string): Promise<string>;
  compareMeaning(userInput: string, scenarioAnswer: string): Promise<boolean>;
}
