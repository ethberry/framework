import { FC, Fragment } from "react";
import { AttachMoney } from "@mui/icons-material";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IPredictionQuestion } from "@framework/types";

export interface IPredictionQuestionReleaseButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
  question: IPredictionQuestion;
}

export const PredictionQuestionReleaseButton: FC<IPredictionQuestionReleaseButtonProps> = props => {
  const { className, disabled, variant = ListActionVariant.iconButton, question } = props;

  const handleClick = () => {
    console.info("CLICK");
  };

  if (!question.endTimestamp) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleClick}
        icon={AttachMoney}
        message="form.buttons.releaseFunds"
        className={className}
        dataTestId="PredictionQuestionReleaseButton"
        disabled={disabled}
        variant={variant}
      />
    </Fragment>
  );
};
