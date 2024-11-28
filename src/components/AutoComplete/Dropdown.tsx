import React from "react";
import { University } from "../../types";

interface DropdownProps {
  universities: University[];
  highlightedIndex: number;
  selectItem: (name: string) => void;
  dropdownRef: React.RefObject<HTMLUListElement>;
  query: string;
  itemRefs: React.RefObject<(HTMLLIElement | null)[]>;
}

const highlightText = (text: string, query: string) => {
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <strong key={index}>{part}</strong>
        ) : (
          part
        )
      )}
    </>
  );
};

export const Dropdown: React.FC<DropdownProps> = ({
  universities,
  highlightedIndex,
  selectItem,
  dropdownRef,
  query,
  itemRefs,
}) => (
  <ul
    className="dropdown"
    id="autocomplete-list"
    role="listbox"
    ref={dropdownRef}
    data-testid="autocomplete-dropdown"
  >
    {universities.map((university, index) => (
      <li
        key={Math.random().toString()}
        id={`option-${index}`}
        className={index === highlightedIndex ? "highlighted" : ""}
        onClick={() => selectItem(university.name)}
        role="option"
        aria-selected={index === highlightedIndex}
        data-testid="autocomplete-option"
      
        ref={(el) => {
          if (itemRefs.current != null) {
            itemRefs.current[index] = el;
            return itemRefs.current[index];
          }
        }}
      >
        {highlightText(`${university.name}, ${university.country}`, query)}
      </li>
    ))}
  </ul>
);
