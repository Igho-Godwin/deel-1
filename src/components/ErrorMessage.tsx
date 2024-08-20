import React from "react";

interface ErrorMessageProps {
  error: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => (
  <div data-testid="error-message">Error: {error}</div>
);


