import React, { useState, useRef, useEffect } from "react";
import { useUniversities } from "../../hooks/useUniversities";
import { Input } from "./Input";
import { Dropdown } from "./Dropdown";
import { NoResults } from "./NoResults";
import { LoadingIndicator } from "./LoadingIndicator";
import { ErrorMessage } from "./ErrorMessage";
import useDebounce from "../../hooks/useDebounce";

const AutoComplete: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const { universities, loading, error, fetchUniversities } = useUniversities();
  
  const debouncedSearchValue = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedSearchValue) {
      fetchUniversities(debouncedSearchValue);
      setShowDropdown(true);
    }
  }, [debouncedSearchValue, fetchUniversities]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (!value) {
      setShowDropdown(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) =>
        Math.min(prev + 1, universities.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      setQuery(universities[highlightedIndex].name);
      setShowDropdown(false);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && itemRefs.current[highlightedIndex]) {
      const highlightedItem = itemRefs.current[highlightedIndex];
      const dropdownElement = dropdownRef.current;

      if (highlightedItem && dropdownElement) {
        const dropdownRect = dropdownElement.getBoundingClientRect();
        const itemRect = highlightedItem.getBoundingClientRect();

        if (itemRect.bottom > dropdownRect.bottom) {
          dropdownElement.scrollTop += itemRect.bottom - dropdownRect.bottom;
        } else if (itemRect.top < dropdownRect.top) {
          dropdownElement.scrollTop -= dropdownRect.top - itemRect.top;
        }
      }
    }
  }, [highlightedIndex]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectItem = (name: string) => {
    setQuery(name);
    setShowDropdown(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="autocomplete" aria-expanded={showDropdown}>
      <Input
        query={query}
        handleChange={handleChange}
        handleKeyDown={handleKeyDown}
        inputRef={inputRef}
        highlightedIndex={highlightedIndex}
      />
      {loading && <LoadingIndicator />}
      {error && <ErrorMessage error={error} />}
      {showDropdown && universities.length > 0 && (
        <Dropdown
          universities={universities}
          highlightedIndex={highlightedIndex}
          selectItem={selectItem}
          dropdownRef={dropdownRef}
          query={query}
          itemRefs={itemRefs}
        />
      )}
      {showDropdown && universities.length === 0 && !loading && !error && (
        <NoResults />
      )}
    </div>
  );
};

export default React.memo(AutoComplete);
