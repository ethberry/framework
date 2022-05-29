import { ReactElement } from "react";
import { IntlProvider } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { Story } from "@storybook/react";

import { IPhoneInputProps, PhoneInput } from "./index";

const i18n = {
  "form.labels.phoneMask": "Phone",
  "form.placeholders.phoneMask": "Enter phone number",
};

export default {
  title: "MaskedInput/Phone",
  component: PhoneInput,
  decorators: [
    (Story: Story): ReactElement => (
      <IntlProvider locale="en" messages={i18n}>
        <FormProvider {...useForm({ defaultValues: { phoneMask: "" } })}>
          <Story />
        </FormProvider>
      </IntlProvider>
    ),
  ],
};

const Template: Story<IPhoneInputProps> = args => <PhoneInput {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  name: "phoneMask",
};
