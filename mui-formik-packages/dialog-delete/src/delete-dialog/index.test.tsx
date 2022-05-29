import { IntlProvider } from "react-intl";
import { cleanup, render } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material";

import { DeleteDialog } from "./index";

afterEach(cleanup);

const i18n = {
  "dialogs.delete": "Delete `{title}`?",
  "dialogs.confirmation": "Please confirm",
  "form.buttons.cancel": "Cancel",
  "form.buttons.ok": "Ok",
};

describe("<DeleteDialog />", () => {
  it("renders open component", () => {
    const container = document.createElement("div");
    document.body.append(container);

    const props = {
      container,
      open: true,
      onConfirm: jest.fn(),
      onCancel: jest.fn(),
      children: "some text",
      initialValues: {
        id: 1,
        title: "Title",
      },
    };

    const { asFragment } = render(
      <ThemeProvider theme={createTheme()}>
        <IntlProvider locale="en" messages={i18n}>
          <DeleteDialog {...props} />
        </IntlProvider>
      </ThemeProvider>,
      { container },
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
