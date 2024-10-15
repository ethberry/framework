import { FC, Fragment } from "react";
import { PlayArrow } from "@mui/icons-material";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IPredictionQuestion } from "@framework/types";

export interface IPredictionQuestionStartButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
  question: IPredictionQuestion;
}

export const PredictionQuestionStartButton: FC<IPredictionQuestionStartButtonProps> = props => {
  const { className, disabled, variant = ListActionVariant.iconButton, question } = props;

  const handleClick = () => {
    console.info("CLICK");
  };

  if (question.startTimestamp) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleClick}
        icon={PlayArrow}
        message="form.buttons.start"
        className={className}
        dataTestId="PredictionQuestionStartButton"
        disabled={disabled}
        variant={variant}
      />
    </Fragment>
  );
};
