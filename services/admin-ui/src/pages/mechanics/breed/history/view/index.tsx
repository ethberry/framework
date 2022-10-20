import { FC } from "react";
import { Link, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import type { IBreedHistory } from "@framework/types";

import { TxHashLink } from "../../../../../components/common/tx-hash-link";

export interface IBreedHistoryViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IBreedHistory;
}

export const BreedHistoryViewDialog: FC<IBreedHistoryViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;
  const { account, child, matron, sire, history } = initialValues;

  const handleConfirm = (): void => {
    onConfirm();
  };

  const domain = window.location.host;
  const proto = window.location.protocol;

  return (
    <ConfirmationDialog message="dialogs.view" onConfirm={handleConfirm} {...rest}>
      <TableContainer component={Paper}>
        <Table aria-label="breed history table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.child" />
              </TableCell>
              {/* <TableCell align="right">{child ? child.tokenId : "not yet born"}</TableCell> */}
              <TableCell align="right">
                {" "}
                {child && child.token ? (
                  <Link target={"_blank"} href={`${proto}//${domain}/erc721-tokens/${child.token.id || 0}`}>
                    {child.token.template ? `${child.token.template?.title} #${child.token.tokenId}` : "not yet born"}
                  </Link>
                ) : (
                  ""
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.matron" />
              </TableCell>
              {/* <TableCell align="right">{matron?.tokenId}</TableCell> */}
              <TableCell align="right">
                {" "}
                {matron && matron.token ? (
                  <Link target={"_blank"} href={`${proto}//${domain}/erc721-tokens/${matron.token.id || 0}`}>
                    {matron.token.template ? `${matron.token.template?.title} #${matron.token.tokenId}` : ""}
                  </Link>
                ) : (
                  ""
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.sire" />
              </TableCell>
              {/* <TableCell align="right">{sire?.tokenId}</TableCell> */}
              <TableCell align="right">
                {" "}
                {sire && sire.token ? (
                  <Link target={"_blank"} href={`${proto}//${domain}/erc721-tokens/${sire.token.tokenId || 0}`}>
                    {sire.token.template ? `${sire.token.template?.title} #${sire.token.tokenId}` : ""}
                  </Link>
                ) : (
                  ""
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.breeder" />
              </TableCell>
              <TableCell align="right">{account}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.txHash" />
              </TableCell>
              <TableCell align="right">{history ? <TxHashLink hash={history.transactionHash} /> : ""}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};
