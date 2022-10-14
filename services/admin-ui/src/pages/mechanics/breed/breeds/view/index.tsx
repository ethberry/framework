import { FC } from "react";
import { Paper, Grid, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { BigNumber } from "ethers";

import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import type { IBreed } from "@framework/types";

import { decodeGenes } from "@framework/genes";

export interface IBreedItemViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IBreed;
}

export const BreedItemViewDialog: FC<IBreedItemViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;
  const { tokenId, genes } = initialValues;

  const DND = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];

  const result = genes
    ? Object.entries(decodeGenes(BigNumber.from(genes), DND)).reduce(
        (memo, [key, value]) => Object.assign(memo, { [key]: value }),
        {} as Record<string, any>,
      )
    : { not: "yet" };
  const handleConfirm = (): void => {
    onConfirm();
  };

  return (
    <ConfirmationDialog message="dialogs.view" onConfirm={handleConfirm} {...rest}>
      <TableContainer component={Paper}>
        <Table aria-label="breed table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.tokenId" />
              </TableCell>
              <TableCell align="right">{tokenId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.genes" />
              </TableCell>
              <TableCell align="right">
                {genes ? (
                  <Grid container>
                    {Object.entries(result).map(([key, value], i) => (
                      <Grid key={i} container>
                        <Grid item xs={6}>
                          {key}
                        </Grid>
                        <Grid item xs={6}>
                          {value}
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  ""
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};
