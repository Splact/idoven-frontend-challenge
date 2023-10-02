import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

import Header from "./index";

test("Renders the Header with the default title", () => {
  const { getByText } = render(<Header />);

  expect(getByText("Idoven.ai Coding Challenge")).toBeInTheDocument();
});

test("Renders the Header with a custom title", () => {
  const randomTitle = Math.random().toString(36).substring(6);

  const { getByText } = render(<Header title={randomTitle} />);

  expect(getByText(randomTitle)).toBeInTheDocument();
});
