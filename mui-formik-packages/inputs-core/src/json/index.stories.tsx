import { ReactElement } from "react";
import { IntlProvider } from "react-intl";
import { MemoryRouter } from "react-router-dom";
import { FormWrapper } from "@gemunion/mui-form";
import { Story } from "@storybook/react";

import { JsonInput } from "./index";
import { TextFieldProps } from "@mui/material";

const i18n = {
  "form.labels.json": "JSON",
  "form.placeholders.json": "JSON",
  "form.validations.valueMissing": "Value missing",
  "form.validations.invalidJSON": "JSON is invalid",
};

export default {
  title: "Input/Json",
  component: JsonInput,
  decorators: [
    (Story: Story): ReactElement => (
      <MemoryRouter>
        <IntlProvider locale="en" messages={i18n}>
          <FormWrapper
            onSubmit={() => {}}
            initialValues={{
              json: JSON.stringify({
                a: 1,
              }),
            }}
          >
            <Story />
          </FormWrapper>
        </IntlProvider>
      </MemoryRouter>
    ),
  ],
};

const Template: Story<TextFieldProps & { name: string }> = args => <JsonInput {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  name: "json",
};
