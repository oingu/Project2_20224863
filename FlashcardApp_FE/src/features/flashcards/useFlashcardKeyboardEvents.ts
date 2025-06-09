import { useEffect } from "react";

export default function useFlashcardKeyboardEvents(
  clickNavigationButton: ({ navigationDirection }: { navigationDirection: "previous" | "next" }) => void,
  setFlip: React.Dispatch<React.SetStateAction<boolean>>,
  flip: boolean,
) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        clickNavigationButton({ navigationDirection: "previous" });
      } else if (event.key === "ArrowRight") {
        clickNavigationButton({ navigationDirection: "next" });
      } else if (event.key === " " || event.key === "Enter" || event.key === "ArrowUp" || event.key === "ArrowDown") {
        setFlip(!flip);
      }
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [flip, clickNavigationButton]);
}