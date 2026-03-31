export default interface LLMService {
    correctSpelling(text: string): Promise<string>;
    compareMeaning(text1: string, text2: string): Promise<boolean>;
}