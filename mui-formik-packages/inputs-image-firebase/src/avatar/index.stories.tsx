import { ReactElement } from "react";
import { IntlProvider } from "react-intl";
import { FormikForm } from "@gemunion/mui-form";
import { SnackbarProvider } from "notistack";
import { Story } from "@storybook/react";

import { AvatarInput, IAvatarInputProps } from "./index";

const i18n = {
  "components.dropzone.file-invalid-type": "You can't upload {type} only {accept} are allowed",
  "components.dropzone.file-too-large": "File is {size}, maximum file size is {maxSize}",
  "components.dropzone.file-too-small": "File is {size}, minimum file size is {minSize}",
  "components.dropzone.too-many-files": "Too many files",
  "form.labels.avatar": "Avatar",
  "form.placeholders.avatar": "Avatar",
  "form.tips.delete": "Delete",
};

export default {
  title: "FileInput/Firebase/Avatar",
  component: AvatarInput,
  decorators: [
    (Story: Story): ReactElement => (
      <IntlProvider locale="en" messages={i18n}>
        <SnackbarProvider>
          <FormikForm onSubmit={() => {}} initialValues={{ avatar: "" }}>
            <Story />
          </FormikForm>
        </SnackbarProvider>
      </IntlProvider>
    ),
  ],
};

const Template: Story<IAvatarInputProps> = args => <AvatarInput {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  name: "avatar",
};
