import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { AddressLink } from "@gemunion/mui-scanner";
import type { IContract } from "@framework/types";
import { StyledTableCell, StyledTableCellDensed, StyledTableRow } from "./styled";

export interface IPaymentSplitterViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IContract;
}

export const PaymentSplitterViewDialog: FC<IPaymentSplitterViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;

  const { address, parameters } = initialValues;

  const handleConfirm = (): void => {
    onConfirm();
  };

  return (
    <ConfirmationDialog message="dialogs.view" onConfirm={handleConfirm} {...rest}>
      <TableContainer component={Paper}>
        <Table aria-label="table">
          <TableBody>
            <TableRow>
              <StyledTableCell component="th" scope="row">
                <FormattedMessage id="form.labels.address" />
              </StyledTableCell>
              <TableCell>
                <AddressLink address={address} />
              </TableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell component="th" scope="row">
                <FormattedMessage id="form.labels.parameters" />
              </StyledTableCell>
              <StyledTableCellDensed align="right">
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>
                        <FormattedMessage id="form.labels.payee" />
                      </StyledTableCell>
                      <TableCell>
                        <FormattedMessage id="form.labels.shares" />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(parameters.payees as unknown as Array<string>).map((payee, i) => (
                      <StyledTableRow key={i}>
                        <StyledTableCell>
                          <AddressLink address={parameters.payees[i]} />
                        </StyledTableCell>
                        <TableCell>{parameters.shares[i]}</TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableCellDensed>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};
