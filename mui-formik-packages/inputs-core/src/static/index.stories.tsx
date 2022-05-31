import { ReactElement } from "react";
import { IntlProvider } from "react-intl";
import { FormWrapper } from "@gemunion/mui-form";
import { Story } from "@storybook/react";

import { StaticInput, IStaticInputProps } from "./index";

const i18n = {
  "form.labels.static": "Static",
  "form.placeholders.static": "Static",
};

export default {
  title: "Input/Static",
  component: StaticInput,
  decorators: [
    (Story: Story): ReactElement => (
      <IntlProvider locale="en" messages={i18n}>
        <FormWrapper onSubmit={() => {}} initialValues={{ static: "static" }}>
          <Story />
        </FormWrapper>
      </IntlProvider>
    ),
  ],
};

const Template: Story<IStaticInputProps> = args => <StaticInput {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  name: "static",
};

export const Disabled = Template.bind({});
Disabled.args = {
  name: "static",
  disabled: true,
};
