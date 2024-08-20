import React from "react";
import { render, screen } from "@testing-library/react";
import { LoadingIndicator } from "../components/LoadingIndicator";

it("renders the LoadingIndicator component", () => {
  render(<LoadingIndicator />);
  const loadingElement = screen.getByTestId("loading-indicator");
  expect(loadingElement).toBeInTheDocument();
  expect(loadingElement).toHaveTextContent("Loading...");
});
