import { ReactElement } from "react";
import { IntlProvider } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { Story } from "@storybook/react";

import { IPlateInputProps, PlateInput } from "./index";

const i18n = {
  "form.labels.plateMask": "Plate",
  "form.placeholders.plateMask": "Enter plate number",
};

export default {
  title: "MaskedInput/Plate",
  component: PlateInput,
  decorators: [
    (Story: Story): ReactElement => (
      <IntlProvider locale="en" messages={i18n}>
        <FormProvider {...useForm({ defaultValues: { plateMask: "" } })}>
          <Story />
        </FormProvider>
      </IntlProvider>
    ),
  ],
};

const Template: Story<IPlateInputProps> = args => <PlateInput {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  name: "plateMask",
};
