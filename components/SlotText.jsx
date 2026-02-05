"use client";

import { useEffect, useState, useRef } from "react";

const CHARS = "-_~=+*!@#$%^&()[]{}|;:,.<>?/";

export const SlotText = ({ text = "", className = "" }) => {
  const [displayText, setDisplayText] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    let iteration = 0;

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            // Preserve spaces visually
            if (letter === " ") return " ";

            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(intervalRef.current);
  }, [text]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{displayText}</span>
    </span>
  );
};
