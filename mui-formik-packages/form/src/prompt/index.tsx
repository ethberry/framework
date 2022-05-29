import { FC } from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import { usePrompt } from "./workaround";

interface IPromptIfDirtyProps {
  visible?: boolean;
}

export const PromptIfDirty: FC<IPromptIfDirtyProps> = props => {
  const { visible = true } = props;
  const {
    formState: { isDirty, submitCount },
  } = useFormContext();
  const { formatMessage } = useIntl();

  usePrompt(formatMessage({ id: "form.hints.prompt" }), visible && isDirty && submitCount === 0);

  return null;
};
