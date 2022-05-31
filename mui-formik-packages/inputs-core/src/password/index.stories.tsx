import { ReactElement } from "react";
import { IntlProvider } from "react-intl";
import { FormWrapper } from "@gemunion/mui-form";
import { Story } from "@storybook/react";

import { IPasswordInputProps, PasswordInput } from "./index";

const i18n = {
  "form.labels.password": "Password",
  "form.placeholders.password": "******",
};

export default {
  title: "Input/Password",
  component: PasswordInput,
  decorators: [
    (Story: Story): ReactElement => (
      <IntlProvider locale="en" messages={i18n}>
        <FormWrapper onSubmit={() => {}} initialValues={{ password: "" }}>
          <Story />
        </FormWrapper>
      </IntlProvider>
    ),
  ],
};

const Template: Story<IPasswordInputProps> = args => <PasswordInput {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  name: "password",
};

export const Disabled = Template.bind({});
Disabled.args = {
  name: "password",
  disabled: true,
};
