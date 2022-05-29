import { ReactElement } from "react";
import { IntlProvider } from "react-intl";
import { Story } from "@storybook/react";

import { ConfirmationDialog, IConfirmationDialogProps } from "./index";

const i18n = {
  "dialogs.confirmation": "Please confirm",
  "form.buttons.cancel": "Cancel",
  "form.buttons.ok": "Ok",
};

export default {
  title: "Dialog/Confirmation",
  component: ConfirmationDialog,
  decorators: [
    (Story: Story): ReactElement => (
      <IntlProvider locale="en" messages={i18n}>
        <Story />
      </IntlProvider>
    ),
  ],
  argTypes: {
    onConfirm: { action: "confirmed" },
    onCancel: { action: "canceled" },
  },
};

const Template: Story<IConfirmationDialogProps> = args => <ConfirmationDialog {...args}>some text</ConfirmationDialog>;

export const Simple = Template.bind({});
Simple.args = {
  open: true,
};
