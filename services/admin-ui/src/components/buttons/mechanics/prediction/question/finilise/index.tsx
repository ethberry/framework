import { FC, Fragment } from "react";
import { Done } from "@mui/icons-material";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IPredictionQuestion } from "@framework/types";

export interface IPredictionQuestionResolveButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
  question: IPredictionQuestion;
}

export const PredictionQuestionResolveButton: FC<IPredictionQuestionResolveButtonProps> = props => {
  const { className, disabled, variant = ListActionVariant.button, question } = props;

  const handleClick = () => {
    console.info("CLICK");
  };

  if (!question.startTimestamp || question.endTimestamp) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleClick}
        icon={Done}
        message="form.buttons.resolve"
        className={className}
        dataTestId="PredictionQuestionResolveButton"
        disabled={disabled}
        variant={variant}
      />
    </Fragment>
  );
};
