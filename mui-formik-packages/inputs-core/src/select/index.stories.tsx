import { ReactElement } from "react";
import { IntlProvider } from "react-intl";
import { FormWrapper } from "@gemunion/mui-form";
import { Story } from "@storybook/react";

import { ISelectInputProps, SelectInput } from "./index";

const i18n = {
  "enums.select.ONE": "ONE",
  "enums.select.TWO": "TWO",
  "form.labels.select": "Select",
};

enum SelectOptions {
  ONE = "ONE",
  TWO = "TWO",
}

export default {
  title: "Input/Select",
  component: SelectInput,
  decorators: [
    (Story: Story): ReactElement => (
      <IntlProvider locale="en" messages={i18n}>
        <FormWrapper onSubmit={() => {}} initialValues={{ select: SelectOptions.ONE }}>
          <Story />
        </FormWrapper>
      </IntlProvider>
    ),
  ],
};

const Template: Story<ISelectInputProps> = args => <SelectInput {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  name: "select",
  options: SelectOptions,
};

export const Disabled = Template.bind({});
Disabled.args = {
  name: "select",
  options: SelectOptions,
  disabled: true,
};
