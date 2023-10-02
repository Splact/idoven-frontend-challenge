import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

import App from "./index";

test("Renders the App correctly", () => {
  const { getByText } = render(<App />);

  expect(getByText("Idoven.ai Coding Challenge")).toBeInTheDocument();
  expect(
    getByText("Drag 'n' drop some files here, or click to select files")
  ).toBeInTheDocument();
});
