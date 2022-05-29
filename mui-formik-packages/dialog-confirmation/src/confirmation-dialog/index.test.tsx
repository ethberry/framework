import { IntlProvider } from "react-intl";
import { cleanup, render } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material";

import { ConfirmationDialog } from "./index";

afterEach(cleanup);

const i18n = {
  "dialogs.confirmation": "Please confirm",
  "form.buttons.cancel": "Cancel",
  "form.buttons.ok": "Ok",
};

describe("<ConfirmationDialog />", () => {
  it("renders closed dialog", () => {
    const container = document.createElement("div");
    document.body.append(container);

    const props = {
      container,
      open: false,
      onConfirm: jest.fn(),
      onCancel: jest.fn(),
      children: "some text",
    };

    const { asFragment } = render(
      <ThemeProvider theme={createTheme()}>
        <IntlProvider locale="en" messages={i18n}>
          <ConfirmationDialog {...props} />
        </IntlProvider>
      </ThemeProvider>,
      { container },
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders open dialog", () => {
    const container = document.createElement("div");
    document.body.append(container);

    const props = {
      container,
      open: true,
      onConfirm: jest.fn(),
      onCancel: jest.fn(),
      children: "some text",
    };

    const { asFragment } = render(
      <ThemeProvider theme={createTheme()}>
        <IntlProvider locale="en" messages={i18n}>
          <ConfirmationDialog {...props} />
        </IntlProvider>
      </ThemeProvider>,
      { container },
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
