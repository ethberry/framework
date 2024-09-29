import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { useApiCall } from "@ethberry/react-hooks";

import type { IPredictionAnswer, IPredictionQuestion } from "@framework/types";

export interface IPredictionQuestionViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IPredictionQuestion;
}

export const PredictionQuestionViewDialog: FC<IPredictionQuestionViewDialogProps> = props => {
  const { onConfirm, ...rest } = props;

  const { fn } = useApiCall(async (api, values) => {
    return api.fetchJson({
      url: "/prediction/answer",
      method: "POST",
      data: values,
    });
  });

  const handleConfirm = async (values: IPredictionAnswer): Promise<void> => {
    await fn(void 0, values).finally(() => {
      onConfirm();
    });
  };

  return (
    <FormDialog message="dialogs.view" onConfirm={handleConfirm} {...rest}>
      <TableContainer component={Paper}>
        <Table aria-label="raffle token table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.question" />
              </TableCell>
              <TableCell align="right">{props.initialValues.title}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </FormDialog>
  );
};
