import { ReactElement } from "react";
import { IntlProvider } from "react-intl";
import { FormWrapper } from "@gemunion/mui-form";
import { Story } from "@storybook/react";

import { ISwitchInputProps, SwitchInput } from "./index";

const i18n = {
  "form.labels.switch": "Switch",
};

export default {
  title: "Input/Switch",
  component: SwitchInput,
  decorators: [
    (Story: Story): ReactElement => (
      <IntlProvider locale="en" messages={i18n}>
        <FormWrapper onSubmit={() => {}} initialValues={{ switch: false }}>
          <Story />
        </FormWrapper>
      </IntlProvider>
    ),
  ],
};

const Template: Story<ISwitchInputProps> = args => <SwitchInput {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  name: "switch",
};

export const Disabled = Template.bind({});
Disabled.args = {
  name: "switch",
  disabled: true,
};
