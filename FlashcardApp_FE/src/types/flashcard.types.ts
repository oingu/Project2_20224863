export interface FlashcardTypes {
  flashcardId: string;
  flashcard_meaningId?: string;
  word: string;
  wordType?: string;
  definition: string[];
  example: string;
  phonetic?: string;
  imageUrl?: string;
  audioUrl?: string;
  word_vi: string;
  wordType_vi?: string;
  definition_vi: string[];
  example_vi?: string;
  slug?: string;
}