import React from "react";

interface InputProps {
  query: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  highlightedIndex: number;
}

export const Input: React.FC<InputProps> = ({
  query,
  handleChange,
  handleKeyDown,
  inputRef,
  highlightedIndex,
}) => (
  <input
    ref={inputRef}
    type="text"
    value={query}
    onChange={handleChange}
    onKeyDown={handleKeyDown}
    placeholder="Type to search for universities..."
    aria-controls="autocomplete-list"
    aria-activedescendant={
      highlightedIndex >= 0 ? `option-${highlightedIndex}` : undefined
    }
    aria-autocomplete="list"
    data-testid="autocomplete-input"
  />
);


