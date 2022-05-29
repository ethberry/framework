import { IntlProvider } from "react-intl";
import { cleanup, render } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material";
import { MemoryRouter } from "react-router-dom";

import { FormDialog } from "./";

afterEach(cleanup);

const i18n = {
  "dialog.title": "Please fill the form",
  "form.buttons.cancel": "Cancel",
  "form.buttons.ok": "Ok",
  "form.hints.prompt": "Prompt",
};

describe("<FormDialog />", () => {
  it("renders closed dialog", () => {
    const container = document.createElement("div");
    document.body.append(container);

    const props = {
      container,
      open: false,
      onConfirm: jest.fn(),
      onCancel: jest.fn(),
      children: "some text",
      message: "dialog.title",
      initialValues: {
        id: 1,
        title: "Title",
      },
    };

    const { asFragment } = render(
      <MemoryRouter>
        <ThemeProvider theme={createTheme()}>
          <IntlProvider locale="en" messages={i18n}>
            <FormDialog {...props} />
          </IntlProvider>
        </ThemeProvider>
      </MemoryRouter>,
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
      message: "dialog.title",
      initialValues: {
        id: 1,
        title: "Title",
      },
    };

    const { asFragment } = render(
      <MemoryRouter>
        <ThemeProvider theme={createTheme()}>
          <IntlProvider locale="en" messages={i18n}>
            <FormDialog {...props} />
          </IntlProvider>
        </ThemeProvider>
      </MemoryRouter>,
      { container },
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
