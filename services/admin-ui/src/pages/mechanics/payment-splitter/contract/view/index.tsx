import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { AddressLink } from "@gemunion/mui-scanner";
import type { IContract } from "@framework/types";

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
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.address" />
              </TableCell>
              <TableCell>
                <AddressLink address={address} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.parameters" />
              </TableCell>
              <TableCell align="right">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <FormattedMessage id="form.labels.payee" />
                      </TableCell>
                      <TableCell>
                        <FormattedMessage id="form.labels.shares" />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(parameters.payees as unknown as Array<string>).map((payee, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <AddressLink address={parameters.payees[i]} />
                        </TableCell>
                        <TableCell>{parameters.shares[i]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};
