import { IntlProvider } from "react-intl";
import { cleanup, render } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material";
import { MemoryRouter } from "react-router-dom";

import { CommonSearchForm } from "./index";

afterEach(cleanup);

const i18n = {
  "form.labels.query": "Query",
  "form.placeholders.query": "Query",
  "form.hints.prompt": "Prompt",
};

// https://github.com/jaredpalmer/formik/issues/1543
describe.skip("<CommonSearchForm />", () => {
  it("renders component", () => {
    const formikProps = {
      onSearch: jest.fn(),
      initialValues: {
        number: 50,
      },
    };

    const { asFragment } = render(
      <MemoryRouter>
        <ThemeProvider theme={createTheme()}>
          <IntlProvider locale="en" messages={i18n}>
            <CommonSearchForm {...formikProps} />
          </IntlProvider>
        </ThemeProvider>
      </MemoryRouter>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
