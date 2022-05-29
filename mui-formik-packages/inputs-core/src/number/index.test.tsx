import { IntlProvider } from "react-intl";
import { cleanup, render } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material";
import { FormikForm } from "@gemunion/mui-form";

import { NumberInput } from "./index";

afterEach(cleanup);

const i18n = {
  "form.labels.number": "Number",
  "form.placeholders.number": "50",
};

describe("<NumberInput />", () => {
  it("renders positive value", () => {
    const props = {
      name: "number",
      value: 50,
    };

    const { asFragment } = render(
      <ThemeProvider theme={createTheme()}>
        <IntlProvider locale="en" messages={i18n}>
          <FormikForm onSubmit={() => {}} initialValues={{ number: 50 }}>
            <NumberInput {...props} />
          </FormikForm>
        </IntlProvider>
      </ThemeProvider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders negative value", () => {
    const props = {
      name: "number",
      value: -50,
    };

    const { asFragment } = render(
      <ThemeProvider theme={createTheme()}>
        <IntlProvider locale="en" messages={i18n}>
          <FormikForm onSubmit={() => {}} initialValues={{ number: -50 }}>
            <NumberInput {...props} />
          </FormikForm>
        </IntlProvider>
      </ThemeProvider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders decimal value", () => {
    const props = {
      name: "number",
      value: 9.99,
    };

    const { asFragment } = render(
      <ThemeProvider theme={createTheme()}>
        <IntlProvider locale="en" messages={i18n}>
          <FormikForm onSubmit={() => {}} initialValues={{ number: 9.99 }}>
            <NumberInput {...props} />
          </FormikForm>
        </IntlProvider>
      </ThemeProvider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
