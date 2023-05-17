import { FC } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { IToken } from "@framework/types";

import { TokenGenesView } from "../../../../hierarchy/tokens/genes";

export interface IErc721ViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IToken;
}

export const MysteryTokenViewDialog: FC<IErc721ViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;

  const { template, tokenId, attributes, balance } = initialValues;

  const handleConfirm = (): void => {
    onConfirm();
  };

  return (
    <ConfirmationDialog message="dialogs.view" onConfirm={handleConfirm} {...rest}>
      <TableContainer component={Paper}>
        <Table aria-label="table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.tokenId" />
              </TableCell>
              <TableCell align="right">{tokenId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.title" />
              </TableCell>
              <TableCell align="right">{template?.title}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.description" />
              </TableCell>
              <TableCell align="right">
                <RichTextDisplay data={template?.description} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.attributes" />
              </TableCell>
              <TableCell align="right">
                <TokenGenesView attributes={attributes} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.account" />
              </TableCell>
              <TableCell align="right">{balance?.at(0)?.account}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.imageUrl" />
              </TableCell>
              <TableCell align="right">
                <Box component="img" sx={{ maxWidth: "100%" }} src={template?.imageUrl} alt={template?.title} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};
