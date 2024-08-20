import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "../components/Input";

describe("Input component", () => {
  const mockHandleChange = jest.fn();
  const mockHandleKeyDown = jest.fn();
  const mockInputRef = React.createRef<HTMLInputElement>();

  const setup = (highlightedIndex = -1) => {
    render(
      <Input
        query="test"
        handleChange={mockHandleChange}
        handleKeyDown={mockHandleKeyDown}
        inputRef={mockInputRef}
        highlightedIndex={highlightedIndex}
      />
    );
  };

  it("renders correctly with the provided props", () => {
    setup();
    const input = screen.getByTestId("autocomplete-input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("test");
    expect(input).toHaveAttribute(
      "placeholder",
      "Type to search for universities..."
    );
    expect(input).toHaveAttribute("aria-controls", "autocomplete-list");
  });

  it("calls handleChange on input change", () => {
    setup();
    const input = screen.getByTestId("autocomplete-input");
    fireEvent.change(input, { target: { value: "new value" } });
    expect(mockHandleChange).toHaveBeenCalledTimes(1);
  });

  it("calls handleKeyDown on key down", () => {
    setup();
    const input = screen.getByTestId("autocomplete-input");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(mockHandleKeyDown).toHaveBeenCalledTimes(1);
  });

  it("assigns the ref correctly", () => {
    setup();
    expect(mockInputRef.current).toBe(screen.getByTestId("autocomplete-input"));
  });

  it("sets aria-activedescendant correctly when highlightedIndex is positive", () => {
    setup(1);
    const input = screen.getByTestId("autocomplete-input");
    expect(input).toHaveAttribute("aria-activedescendant", "option-1");
  });

  it("does not set aria-activedescendant when highlightedIndex is negative", () => {
    setup(-1);
    const input = screen.getByTestId("autocomplete-input");
    expect(input).not.toHaveAttribute("aria-activedescendant");
  });
});
