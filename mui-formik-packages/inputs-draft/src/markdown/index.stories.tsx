import { ReactElement } from "react";
import { IntlProvider } from "react-intl";
import { FormikForm } from "@gemunion/mui-form";
import { Story } from "@storybook/react";
import { LicenseProvider } from "@gemunion/provider-license";
import { markdownString } from "@gemunion/draft-js-utils";

import { IMarkdownInputProps, MarkdownInput } from "./index";

const i18n = {
  "form.labels.markdown": "Markdown",
  "form.placeholders.markdown": "Markdown",
};

export default {
  title: "ReachTextEditor/Markdown",
  component: MarkdownInput,
  decorators: [
    (Story: Story): ReactElement => (
      <LicenseProvider licenseKey={process.env.STORYBOOK_GEMUNION_LICENSE as string}>
        <IntlProvider locale="en" messages={i18n}>
          <Story />
        </IntlProvider>
      </LicenseProvider>
    ),
  ],
};

const MarkdownTemplate: Story<IMarkdownInputProps> = args => {
  return (
    <FormikForm onSubmit={() => {}} initialValues={{}}>
      <MarkdownInput {...args} />
    </FormikForm>
  );
};

export const Simple = MarkdownTemplate.bind({});
Simple.args = {
  name: "markdown",
};

const MarkdownDefaultValueTemplate: Story<IMarkdownInputProps> = args => {
  return (
    <FormikForm onSubmit={() => {}} initialValues={{ markdown: markdownString }}>
      <MarkdownInput {...args} />
    </FormikForm>
  );
};

export const DefaultValue = MarkdownDefaultValueTemplate.bind({});
DefaultValue.args = {
  name: "markdown",
};
