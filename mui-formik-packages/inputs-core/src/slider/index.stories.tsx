import { ReactElement } from "react";
import { IntlProvider } from "react-intl";
import { FormikForm } from "@gemunion/mui-form";
import { Story } from "@storybook/react";

import { ISliderInputProps, SliderInput } from "./index";

const i18n = {
  "form.labels.slider": "Slider",
};

export default {
  title: "Input/Slider",
  component: SliderInput,
  decorators: [
    (Story: Story): ReactElement => (
      <IntlProvider locale="en" messages={i18n}>
        <FormikForm onSubmit={() => {}} initialValues={{ slider: 250 }}>
          <Story />
        </FormikForm>
      </IntlProvider>
    ),
  ],
};

const Template: Story<ISliderInputProps> = args => <SliderInput {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  name: "slider",
  min: 100,
  max: 1000,
};

export const Disabled = Template.bind({});
Disabled.args = {
  name: "slider",
  min: 100,
  max: 1000,
  disabled: true,
};
