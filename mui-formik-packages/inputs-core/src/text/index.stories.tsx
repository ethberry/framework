import { ReactElement } from "react";
import { IntlProvider } from "react-intl";
import { FormikForm } from "@gemunion/mui-form";
// import { FormProvider, useForm } from "react-hook-form";
import { Story } from "@storybook/react";

import { ITextInputProps, TextInput } from "./index";

const i18n = {
  "form.labels.text": "Text",
  "form.placeholders.text": "Lorem ipsum...",
  "form.validations.required": "Required",
};

export default {
  title: "Input/Text",
  component: TextInput,
  decorators: [
    (Story: Story): ReactElement => (
      <IntlProvider locale="en" messages={i18n}>
        <Story />
      </IntlProvider>
    ),
  ],
  argTypes: {
    variant: {
      control: {
        type: "select",
      },
      options: ["standard", "outlined", "filled"],
    },
    disabled: {
      control: { type: "boolean" },
    },
    readOnly: {
      control: { type: "boolean" },
    },
  },
  args: {
    variant: "standard",
    disabled: false,
    readOnly: false,
  },
};

const SimpleTemplate: Story<ITextInputProps> = args => {
  return (
    <FormikForm onSubmit={() => {}} initialValues={{ text: "qwerty" }}>
      <TextInput {...args} />
    </FormikForm>
  );
};

export const Simple = SimpleTemplate.bind({});
Simple.args = {
  name: "text",
};

// const ErroredTemplate: Story<ITextInputProps> = args => {
//   const form = useForm({
//     defaultValues: {
//       text: "qwerty",
//     },
//   });
//
//   form.setValue("text", "qwerty", { shouldTouch: true });
//   form.setError("text", { message: "form.validations.required" });
//
//   return (
//     <FormProvider {...form}>
//       <TextInput {...args} />
//     </FormProvider>
//   );
// };
//
// export const Errored = ErroredTemplate.bind({});
// Errored.args = {
//   name: "text",
// };
