import React from "react";
import { render, screen } from "@testing-library/react";
import { ErrorMessage } from "../components/AutoComplete/ErrorMessage";

describe("ErrorMessage component", () => {
  it("renders with the correct error message", () => {
    const errorText = "Something went wrong!";
    render(<ErrorMessage error={errorText} />);

    const errorMessage = screen.getByTestId("error-message");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(`Error: ${errorText}`);
  });

  it("renders with a different error message", () => {
    const errorText = "Unable to fetch data!";
    render(<ErrorMessage error={errorText} />);

    const errorMessage = screen.getByTestId("error-message");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(`Error: ${errorText}`);
  });
});
