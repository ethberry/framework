import { IntlProvider } from "react-intl";
import { cleanup, render } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material";
import { FormikForm } from "@gemunion/mui-form";
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
            <FormikForm
              onSubmit={() => {}}
              initialValues={{
                avatar: "",
              }}
            >
              <AvatarInput {...props} />
            </FormikForm>
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
            <FormikForm
              onSubmit={() => {}}
              initialValues={{
                avatar: "https://lms2-dev.s3-us-west-2.amazonaws.com/7f0f427f-eeba-4ffb-a1c8-f730721bfd46.jpeg",
              }}
            >
              <AvatarInput {...props} />
            </FormikForm>
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
  //   const formProps = useForm({
  //     defaultValues: {
  //       avatar: "https://lms2-dev.s3-us-west-2.amazonaws.com/7f0f427f-eeba-4ffb-a1c8-f730721bfd46.jpeg",
  //     },
  //   });
  //
  //   formProps.setError("avatar", { type: "custom", message: "form.validations.whitelistValidation" });
  //
  //   const { asFragment } = render(
  //     <ThemeProvider theme={createTheme()}>
  //       <IntlProvider locale="en" messages={i18n}>
  //         <SnackbarProvider maxSnack={3}>
  //           <FormikForm {...formProps}>
  //             <AvatarInput {...props} />
  //           </FormikForm>
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
  //   const formProps = useForm({
  //     defaultValues: {
  //       avatar: "",
  //     },
  //   });
  //
  //   formProps.setValue("avatar", "", { shouldTouch: true });
  //   formProps.setError("avatar", { type: "custom", message: "form.validations.valueMissing" });
  //
  //   const { asFragment } = render(
  //     <ThemeProvider theme={createTheme()}>
  //       <IntlProvider locale="en" messages={i18n}>
  //         <SnackbarProvider maxSnack={3}>
  //           <FormikForm {...formProps}>
  //             <AvatarInput {...props} />
  //           </FormikForm>
  //         </SnackbarProvider>
  //       </IntlProvider>
  //     </ThemeProvider>,
  //   );
  //
  //   expect(asFragment()).toMatchSnapshot();
  // });
});
