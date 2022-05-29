import { ReactElement } from "react";
import { IntlProvider } from "react-intl";
import { FormikForm } from "@gemunion/mui-form";
import { SnackbarProvider } from "notistack";
import { Story } from "@storybook/react";

import { ApiProvider } from "@gemunion/provider-api";

import { PhotoInput, IPhotoInputProps } from "./index";

const i18n = {
  "form.labels.photo": "Photo",
  "form.placeholders.photo": "Photo",
  "form.labels.title": "Title",
  "form.placeholders.title": "Title",
  "form.buttons.delete": "Delete",
  "form.buttons.cancel": "Cancel",
  "form.buttons.ok": "Ok",
  "dialogs.confirmation": "Please confirm",
  "dialogs.delete": "Delete `{title}`?",
};

export default {
  title: "FileInput/S3/Photo",
  component: PhotoInput,
  decorators: [
    (Story: Story): ReactElement => (
      <ApiProvider baseUrl={"http://localhost/"}>
        <IntlProvider locale="en" messages={i18n}>
          <SnackbarProvider>
            <FormikForm onSubmit={() => {}} initialValues={{ photo: [] }}>
              <Story />
            </FormikForm>
          </SnackbarProvider>
        </IntlProvider>
      </ApiProvider>
    ),
  ],
};

const Template: Story<IPhotoInputProps> = args => <PhotoInput {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  name: "photo",
};
