import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { Dropdown } from "../components/Dropdown";
import { faker } from "@faker-js/faker";

const generateUniversity = () => ({
  name: faker.company.name(),
  country: faker.location.country(),
});

const universities = Array.from({ length: 5 }, generateUniversity);

const selectItemMock = jest.fn();
const dropdownRef = React.createRef<HTMLUListElement>();

const setup = (highlightedIndex: number = 0, query: string = "") => {
  render(
    <Dropdown
      universities={universities}
      highlightedIndex={highlightedIndex}
      selectItem={selectItemMock}
      dropdownRef={dropdownRef}
      query={query}
    />
  );
};

describe("Dropdown component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the dropdown with correct number of items", () => {
    setup();

    const items = screen.getAllByTestId("autocomplete-option");
    expect(items).toHaveLength(universities.length);
  });

  it("highlights the correct item", () => {
    const highlightedIndex = 2;
    setup(highlightedIndex);

    const items = screen.getAllByTestId("autocomplete-option");
    expect(items[highlightedIndex]).toHaveClass("highlighted");
  });

  it("calls selectItem with correct argument when an item is clicked", () => {
    setup();

    const items = screen.getAllByTestId("autocomplete-option");
    fireEvent.click(items[1]);

    expect(selectItemMock).toHaveBeenCalledWith(universities[1].name);
  });

  it("correctly highlights text that matches the query", () => {
    const query = "Uni";
    const universityWithMatch = {
      name: "Berlin University",
      country: "Germany",
    };
    const customUniversities = [universityWithMatch, ...universities.slice(1)];

    render(
      <Dropdown
        universities={customUniversities}
        highlightedIndex={0}
        selectItem={selectItemMock}
        dropdownRef={dropdownRef}
        query={query}
      />
    );

    // Find the first item in the dropdown
    const firstItem = screen.getAllByTestId("autocomplete-option")[0];

    // Use `within` to query within the specific item
    const highlightedText = within(firstItem).getByText((content, element) => {
      return element?.tagName.toLowerCase() === "strong" && content === query;
    });

    expect(highlightedText).toBeInTheDocument();
  });

  it("dropdown renders with correct accessibility attributes", () => {
    setup();

    const dropdown = screen.getByTestId("autocomplete-dropdown");
    expect(dropdown).toHaveAttribute("role", "listbox");

    const items = screen.getAllByTestId("autocomplete-option");
    items.forEach((item, index) => {
      expect(item).toHaveAttribute("role", "option");
      expect(item).toHaveAttribute(
        "aria-selected",
        index === 0 ? "true" : "false"
      );
    });
  });

  it("renders with unique keys for each item", () => {
    setup();

    const items = screen.getAllByTestId("autocomplete-option");
    const keys = items.map((item, index) => item.id);
    const uniqueKeys = new Set(keys);

    expect(uniqueKeys.size).toBe(universities.length);
  });
});
