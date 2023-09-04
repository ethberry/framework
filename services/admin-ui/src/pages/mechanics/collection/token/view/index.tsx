import { FC } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { AddressLink } from "@gemunion/mui-scanner";
import { ContractFeatures, IToken } from "@framework/types";

import { shouldShowAttributes, TokenAttributesView } from "../../../../hierarchy/metadata";
import { TokenTraitsView } from "../../traits";

export interface ICollectionTokenViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IToken;
}

export const CollectionTokenViewDialog: FC<ICollectionTokenViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;
  const { template, tokenId, metadata, balance, imageUrl } = initialValues;

  const showAttributes = shouldShowAttributes(metadata);
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
                <FormattedMessage id="form.labels.contract" />
              </TableCell>
              <TableCell align="right">{template?.contract?.title}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.address" />
              </TableCell>
              <TableCell align="right">{template?.contract?.address}</TableCell>
            </TableRow>
            {showAttributes && (
              <TableRow>
                <TableCell component="th" scope="row">
                  <FormattedMessage id="form.labels.metadata" />
                </TableCell>
                <TableCell align="right">
                  <TokenAttributesView metadata={metadata} />
                </TableCell>
              </TableRow>
            )}
            {template?.contract?.contractFeatures.includes(ContractFeatures.TRAITS) ? (
              <TableRow>
                <TableCell component="th" scope="row">
                  <FormattedMessage id="form.labels.traits" />
                </TableCell>
                <TableCell align="right">
                  <TokenTraitsView metadata={metadata} />
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
                <Box component="img" sx={{ maxWidth: "100%" }} src={imageUrl || ""} alt={template?.title} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};
