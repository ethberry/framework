import { ReactElement } from "react";
import { IntlProvider } from "react-intl";
import { Story } from "@storybook/react";
import { FormWrapper } from "@gemunion/mui-form";

import { AutocompleteInput, IAutocompleteInputProps } from "./index";

const i18n = {
  "form.labels.autocomplete": "Autocomplete",
  "form.placeholders.autocomplete": "Star w00t",
};

export default {
  title: "Input/Autocomplete",
  component: AutocompleteInput,
  decorators: [
    (Story: Story): ReactElement => (
      <IntlProvider locale="en" messages={i18n}>
        <FormWrapper onSubmit={() => {}} initialValues={{ autocomplete: "sw" }}>
          <Story />
        </FormWrapper>
      </IntlProvider>
    ),
  ],
};

const Template: Story<IAutocompleteInputProps> = args => <AutocompleteInput {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  name: "autocomplete",
  options: [
    {
      key: "sw",
      value: "Star wars",
    },
    {
      key: "st",
      value: "Star track",
    },
  ],
};
