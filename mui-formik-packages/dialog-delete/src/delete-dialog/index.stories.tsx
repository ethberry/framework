import { ReactElement } from "react";
import { IntlProvider } from "react-intl";
import { Story } from "@storybook/react";

import { IDeleteDialogProps, DeleteDialog } from "./index";

const i18n = {
  "dialogs.delete": "Delete `{title}`?",
  "dialogs.confirmation": "Please confirm",
  "form.buttons.cancel": "Cancel",
  "form.buttons.ok": "Ok",
};

export default {
  title: "Dialog/Delete",
  component: DeleteDialog,
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

const Template: Story<IDeleteDialogProps> = args => <DeleteDialog {...args}>some text</DeleteDialog>;

export const Simple = Template.bind({});
Simple.args = {
  open: true,
  initialValues: {
    id: 1,
    title: "Title",
  },
};
