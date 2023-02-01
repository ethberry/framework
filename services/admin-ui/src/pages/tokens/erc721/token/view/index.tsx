import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { ContractFeatures, IToken } from "@framework/types";

import { TokenAttributesView } from "../../../attributes";
import { AddressLink } from "../../../../../components/common/address-link";
import { TokenGenesView } from "../../../genes";

export interface IErc721ViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IToken;
}

export const Erc721TokenViewDialog: FC<IErc721ViewDialogProps> = props => {
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
                <TokenAttributesView attributes={JSON.parse(attributes)} />
              </TableCell>
            </TableRow>
            {template?.contract?.contractFeatures.includes(ContractFeatures.GENES) ? (
              <TableRow>
                <TableCell component="th" scope="row">
                  <FormattedMessage id="form.labels.genes" />
                </TableCell>
                <TableCell align="right">
                  <TokenGenesView attributes={JSON.parse(attributes)} />
                </TableCell>
              </TableRow>
            ) : null}
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.account" />
              </TableCell>
              <TableCell align="right">
                <AddressLink address={balance?.at(0)?.account} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.imageUrl" />
              </TableCell>
              <TableCell align="right">
                <img src={template?.imageUrl} alt={template?.title} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};
