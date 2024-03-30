import { FC } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { AddressLink } from "@gemunion/mui-scanner";
import type { IToken } from "@framework/types";
import { ContractFeatures, ModuleType } from "@framework/types";

import { shouldShowAttributes, TokenAttributesView } from "../../../metadata";
import { TokenTraitsView } from "../../../traits";
import { MysteryboxContent } from "../../../mysterybox-content";
import { TokenUserMetadataView } from "../../../user-metadata";

export interface IErc721ViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IToken;
}

export const Erc721TokenViewDialog: FC<IErc721ViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;

  const { template, tokenId, metadata, balance } = initialValues;

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
              <TableCell align="right" sx={{ maxWidth: "100%" }}>
                <RichTextDisplay data={template?.description} />
              </TableCell>
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
            {template?.contract?.contractFeatures.includes(ContractFeatures.GENES) ? (
              <TableRow>
                <TableCell component="th" scope="row">
                  <FormattedMessage id="form.labels.traits" />
                </TableCell>
                <TableCell align="right">
                  <TokenTraitsView metadata={metadata} />
                </TableCell>
              </TableRow>
            ) : null}
            {template?.contract?.contractModule === ModuleType.MYSTERY ? (
              <TableRow>
                <TableCell component="th" scope="row">
                  <FormattedMessage id="form.labels.content" />
                </TableCell>
                <TableCell align="right">
                  {/* @ts-ignore */}
                  <MysteryboxContent mysterybox={template.box} />
                </TableCell>
              </TableRow>
            ) : null}
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.account" />
              </TableCell>
              <TableCell align="right">
                <AddressLink address={balance?.at(0)?.account} length={42} />
              </TableCell>
            </TableRow>
            {template?.contract?.contractFeatures.includes(ContractFeatures.RENTABLE) && metadata && metadata.USER ? (
              <TokenUserMetadataView metadata={metadata} />
            ) : null}
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.imageUrl" />
              </TableCell>
              <TableCell align="right">
                <Box component="img" src={template?.imageUrl} alt={template?.title} sx={{ maxWidth: "100%" }} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};
