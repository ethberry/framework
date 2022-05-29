import { ReactElement } from "react";
import { IntlProvider } from "react-intl";
import { FormikForm } from "@gemunion/mui-form";
import { Story } from "@storybook/react";
import { LicenseProvider } from "@gemunion/provider-license";
import { rawStateString } from "@gemunion/draft-js-utils";

import { IRichTextFieldProps, RichTextEditor } from "./index";

const i18n = {
  "form.labels.draft": "Draft",
  "form.placeholders.draft": "Draft",
};

export default {
  title: "ReachTextEditor/Draft",
  component: RichTextEditor,
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

const DraftTemplate: Story<IRichTextFieldProps> = args => {
  return (
    <FormikForm onSubmit={() => {}} initialValues={{ switch: false }}>
      <RichTextEditor {...args} />
    </FormikForm>
  );
};

export const Simple = DraftTemplate.bind({});
Simple.args = {
  name: "draft",
};

const DraftDefaultValueTemplate: Story<IRichTextFieldProps> = args => {
  return (
    <FormikForm onSubmit={() => {}} initialValues={{ draft: rawStateString }}>
      <RichTextEditor {...args} />
    </FormikForm>
  );
};

export const DefaultValue = DraftDefaultValueTemplate.bind({});
DefaultValue.args = {
  name: "draft",
};
