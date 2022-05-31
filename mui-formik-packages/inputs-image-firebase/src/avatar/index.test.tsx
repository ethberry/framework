import { IntlProvider } from "react-intl";
import { cleanup, render } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material";
import { FormWrapper } from "@gemunion/mui-form";
import { SnackbarProvider } from "notistack";

import { AvatarInput } from "./index";

afterEach(cleanup);

const i18n = {
  "form.labels.avatar": "Avatar",
  "form.tips.delete": "Delete",
  "form.validations.valueMissing": "Avatar is required",
  "form.validations.whitelistValidation": "Property Avatar is not recognized",
};

describe("<AvatarInput />", () => {
  it("renders the empty field", () => {
    const props = {
      name: "avatar",
    };

    const { asFragment } = render(
      <ThemeProvider theme={createTheme()}>
        <IntlProvider locale="en" messages={i18n}>
          <SnackbarProvider maxSnack={3}>
            <FormWrapper onSubmit={() => {}} initialValues={{ avatar: "" }}>
              <AvatarInput {...props} />
            </FormWrapper>
          </SnackbarProvider>
        </IntlProvider>
      </ThemeProvider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders the field with image", () => {
    const props = {
      name: "avatar",
    };

    const { asFragment } = render(
      <ThemeProvider theme={createTheme()}>
        <IntlProvider locale="en" messages={i18n}>
          <SnackbarProvider maxSnack={3}>
            <FormWrapper
              onSubmit={() => {}}
              initialValues={{
                avatar: "https://lms2-dev.s3-us-west-2.amazonaws.com/7f0f427f-eeba-4ffb-a1c8-f730721bfd46.jpeg",
              }}
            >
              <AvatarInput {...props} />
            </FormWrapper>
          </SnackbarProvider>
        </IntlProvider>
      </ThemeProvider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  // it("renders image with error from server", () => {
  //   const props = {
  //     name: "avatar",
  //   };
  //
  //   const { asFragment } = render(
  //     <ThemeProvider theme={createTheme()}>
  //       <IntlProvider locale="en" messages={i18n}>
  //         <SnackbarProvider maxSnack={3}>
  //           <FormWrapper
  //             onSubmit={() => {}}
  //             innerRef={formRef}
  //             initialValues={{
  //               avatar: "https://lms2-dev.s3-us-west-2.amazonaws.com/7f0f427f-eeba-4ffb-a1c8-f730721bfd46.jpeg",
  //             }}
  //           >
  //             <AvatarInput {...props} />
  //           </FormWrapper>
  //         </SnackbarProvider>
  //       </IntlProvider>
  //     </ThemeProvider>,
  //   );
  //
  //   expect(asFragment()).toMatchSnapshot();
  // });

  // it("renders empty field with error: image is required", () => {
  //   const props = {
  //     name: "avatar",
  //   };
  //
  //   // formProps.setValue("avatar", "", { shouldTouch: true });
  //   // formProps.setError("avatar", { type: "custom", message: "form.validations.valueMissing" });
  //
  //   const { asFragment } = render(
  //     <ThemeProvider theme={createTheme()}>
  //       <IntlProvider locale="en" messages={i18n}>
  //         <SnackbarProvider maxSnack={3}>
  //           <FormWrapper {...formProps}>
  //             <AvatarInput {...props} />
  //           </FormWrapper>
  //         </SnackbarProvider>
  //       </IntlProvider>
  //     </ThemeProvider>,
  //   );
  //
  //   expect(asFragment()).toMatchSnapshot();
  // });
});
