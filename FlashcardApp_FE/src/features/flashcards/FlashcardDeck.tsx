import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CustomProgressBar from "@/components/custom-ui/CustomProgressBar";
import useFlashcardKeyboardEvents from "@/features/flashcards/useFlashcardKeyboardEvents";
import { FlashcardTypes } from "@/types/flashcard.types";
import SearchResultCard from "@/features/search/components/SearchResultCard";
import { useParams } from "react-router-dom";
import { mockFlashcards } from "@/test/mockData";

const cardContentStyles = "flex h-full items-center justify-center overflow-hidden align-middle text-center p-4";
const cardTextStyles = "text-4xl leading-tight text-wrap select-none md:text-5xl lg:text-6xl";
const flashcardBadgeStyles = "text-md select-none md:text-xl lg:text-2xl shadow-sm";
const cardFaceStyles = "absolute inset-0 h-full w-full backface-hidden";

export default function FlashcardDeck() {
  const { folderId } = useParams<{ folderId: string }>();
  const [flashcardDeck, setFlashcardDeck] = useState<FlashcardTypes[]>([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setFlip] = useState(false);

  useEffect(() => {
    if (folderId && mockFlashcards[folderId]) {
      // in a real app, fetch flashcards for this folder from API
      setFlashcardDeck(mockFlashcards[folderId]);
    }
  }, [folderId]);

  function clickNavigationButton({ navigationDirection }: { navigationDirection: "previous" | "next" }) {
    setFlip(false); // flip the card back to front
    if (navigationDirection === "previous") {
      // setTimeout at 100ms allow the card to finish flipping before changing the word
      setTimeout(() => {
        setCurrentFlashcardIndex((prevIndex) => {
          return prevIndex > 0 ? prevIndex - 1 : 0;
        });
      }, 100);
    } else if (navigationDirection === "next") {
      // setTimeout at 100ms allow the card to finish flipping before changing the word
      setTimeout(() => {
        setCurrentFlashcardIndex((prevIndex) => {
          return prevIndex < flashcardDeck.length - 1 ? prevIndex + 1 : flashcardDeck.length - 1;
        });
      }, 100);
    }
  }

  // handle keyboard events for navigation and flipping
  useFlashcardKeyboardEvents(clickNavigationButton, setFlip, isFlipped);

  return (
    <div className="container mx-auto">
      {/* Flashcard */}
      <div className="perspective-500 mb-4 aspect-[4/3] cursor-pointer md:mb-8 md:aspect-[4/3] lg:aspect-[21/9]" onClick={() => setFlip(!isFlipped)}>
        <div className={`relative h-full w-full transition-transform duration-300 transform-3d ${isFlipped ? "rotate-x-180" : ""}`}>
          {/* Front */}
          <Card className={cardFaceStyles}>
            <CardHeader className="flex justify-between pt-6">
              <Badge className={flashcardBadgeStyles} variant="secondary">
                {flashcardDeck[currentFlashcardIndex]?.wordType}
              </Badge>
              <Badge className={flashcardBadgeStyles} variant="secondary">
                {flashcardDeck[currentFlashcardIndex]?.phonetic}
              </Badge>
            </CardHeader>
            <CardContent className={cardContentStyles}>
              <p className={cardTextStyles}>{flashcardDeck[currentFlashcardIndex]?.word}</p>
            </CardContent>
          </Card>

          {/* Back */}
          <div className={`${cardFaceStyles} rotate-x-180 overflow-auto`}>
            <div className="flex h-full w-full items-center justify-center">
              <SearchResultCard results={[flashcardDeck[currentFlashcardIndex]]} />
            </div>
          </div>
        </div>
      </div>

      {/* progress bar */}
      <CustomProgressBar currentIndex={currentFlashcardIndex} length={flashcardDeck.length} />

      {/* previous and next button */}
      <div className="flex justify-between select-none">
        {/* previous button */}
        <Button className="cursor-pointer" variant="outline" onClick={() => clickNavigationButton({ navigationDirection: "previous" })}>
          <ChevronLeft />
          <p className="pr-2">Previous</p>
        </Button>

        {/* next button */}
        <Button className="cursor-pointer" variant="outline" onClick={() => clickNavigationButton({ navigationDirection: "next" })}>
          <p className="pl-2">Next</p>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
