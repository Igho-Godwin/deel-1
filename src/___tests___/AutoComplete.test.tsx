import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { faker } from "@faker-js/faker";
import AutoComplete from "../components/AutoComplete";
import { useUniversities } from "../hooks/useUniversities";

jest.mock("../hooks/useUniversities");

describe("AutoComplete Component", () => {
  const mockFetchUniversities = jest.fn();
  const mockUniversities = Array.from({ length: 5 }, () => ({
    name: faker.company.name(),
  }));

  beforeEach(() => {
    (useUniversities as jest.Mock).mockReturnValue({
      universities: mockUniversities,
      loading: false,
      error: null,
      fetchUniversities: mockFetchUniversities,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render input field correctly", () => {
    render(<AutoComplete />);
    const inputElement = screen.getByTestId("autocomplete-input");
    expect(inputElement).toBeInTheDocument();
  });

  it("should call fetchUniversities with the correct query", async () => {
    render(<AutoComplete />);
    const inputElement = screen.getByTestId("autocomplete-input");
    const query = faker.lorem.word();

    fireEvent.change(inputElement, { target: { value: query } });

    await waitFor(() =>
      expect(mockFetchUniversities).toHaveBeenCalledWith(query)
    );
  });

  it("should display loading indicator when loading", () => {
    (useUniversities as jest.Mock).mockReturnValue({
      universities: [],
      loading: true,
      error: null,
      fetchUniversities: mockFetchUniversities,
    });

    render(<AutoComplete />);
    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
  });

  it("should display error message when there is an error", () => {
    const errorMessage = faker.lorem.sentence();
    (useUniversities as jest.Mock).mockReturnValue({
      universities: [],
      loading: false,
      error: errorMessage,
      fetchUniversities: mockFetchUniversities,
    });

    render(<AutoComplete />);
    expect(screen.getByTestId("error-message")).toHaveTextContent(errorMessage);
  });

  it("should display dropdown with universities when typing", async () => {
    render(<AutoComplete />);
    const inputElement = screen.getByTestId("autocomplete-input");
    fireEvent.change(inputElement, { target: { value: "uni" } });

    await waitFor(() => {
      mockUniversities.forEach((uni) => {
        expect(screen.getByText(new RegExp(uni.name, "i"))).toBeInTheDocument();
      });
    });

    expect(screen.getByTestId("autocomplete-dropdown")).toBeInTheDocument();
  });

  it("should hide dropdown when Escape key is pressed", () => {
    render(<AutoComplete />);
    const inputElement = screen.getByTestId("autocomplete-input");
    fireEvent.change(inputElement, { target: { value: "uni" } });

    fireEvent.keyDown(inputElement, { key: "Escape", code: "Escape" });
    expect(screen.queryByTestId("dropdown")).not.toBeInTheDocument();
  });

  it("should select an item on Enter key press", async () => {
    render(<AutoComplete />);
    const inputElement = screen.getByTestId("autocomplete-input");

    // Simulate typing in the input
    fireEvent.change(inputElement, { target: { value: "uni" } });

    // Wait for the dropdown to display the universities
    await waitFor(
      async () =>
        await expect(
          screen.getByTestId("autocomplete-dropdown")
        ).toBeInTheDocument()
    );

    // Check if the first university is rendered
    const firstUniversity = mockUniversities[0].name;
    await waitFor(
      async () =>
        await expect(
          screen.getByText(new RegExp(firstUniversity, "i"))
        ).toBeInTheDocument()
    );

    // Simulate arrow down to highlight the first item
    fireEvent.keyDown(inputElement, { key: "ArrowDown", code: "ArrowDown" });

    // Simulate pressing the Enter key to select the highlighted item
    fireEvent.keyDown(inputElement, { key: "Enter", code: "Enter" });

    // Wait and check if the input value has been updated to the selected university name
    await waitFor(() => expect(inputElement).toHaveValue(firstUniversity));
  });

  it("should close the dropdown and keep input focused when an item is selected", async () => {
    render(<AutoComplete />);
    const inputElement = screen.getByTestId("autocomplete-input");

    // Simulate typing to trigger dropdown
    fireEvent.change(inputElement, { target: { value: "uni" } });

    // Wait for dropdown to appear
    await waitFor(
      async () =>
        await expect(
          screen.getByTestId("autocomplete-dropdown")
        ).toBeInTheDocument()
    );

    // Check that the first university is rendered
    const firstUniversity = mockUniversities[0].name;
    await waitFor(
      async () =>
        await expect(
          screen.getByText(new RegExp(firstUniversity, "i"))
        ).toBeInTheDocument()
    );

    // Simulate clicking the first item in the dropdown
    fireEvent.click(screen.getByText(new RegExp(firstUniversity, "i")));

    // Check if dropdown has closed
    await waitFor(() =>
      expect(screen.queryByTestId("dropdown")).not.toBeInTheDocument()
    );

    // Check if input still has focus
    expect(inputElement).toHaveFocus();

    // Check if input value matches the selected university
    expect(inputElement).toHaveValue(firstUniversity);
  });

  it("should close the dropdown when clicking outside", () => {
    render(<AutoComplete />);
    const inputElement = screen.getByTestId("autocomplete-input");
    fireEvent.change(inputElement, { target: { value: "uni" } });

    fireEvent.mouseDown(document);
    expect(screen.queryByTestId("dropdown")).not.toBeInTheDocument();
  });

  it("should display NoResults component when no universities are found", async () => {
    (useUniversities as jest.Mock).mockReturnValue({
      universities: [],
      loading: false,
      error: null,
      fetchUniversities: mockFetchUniversities,
    });

    render(<AutoComplete />);
    const inputElement = screen.getByTestId("autocomplete-input");
    fireEvent.change(inputElement, { target: { value: "nonexistentuni" } });

    await waitFor(() => {
      expect(screen.getByTestId("no-results")).toBeInTheDocument();
    });
  });
});
