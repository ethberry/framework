import { FC } from "react";
import { Grid, Link, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { BigNumber } from "ethers";

import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import type { IBreed } from "@framework/types";
import { decodeTraits, DND } from "@framework/traits-ui";

export interface IBreedItemViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IBreed;
}

export const BreedItemViewDialog: FC<IBreedItemViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;
  const { token, tokenId, traits, children } = initialValues;

  const result = traits
    ? Object.entries(decodeTraits(BigInt(traits), DND)).reduce(
        (memo, [key, value]) => Object.assign(memo, { [key]: value }),
        {} as Record<string, any>,
      )
    : { not: "yet" };
  const handleConfirm = (): void => {
    onConfirm();
  };
  const domain = window.location.host;
  const proto = window.location.protocol;

  return (
    <ConfirmationDialog message="dialogs.view" onConfirm={handleConfirm} {...rest}>
      <TableContainer component={Paper}>
        <Table aria-label="breed table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.tokenId" />
              </TableCell>
              <TableCell align="right">
                {token ? (
                  <Typography variant="body1" color="textSecondary">
                    <Link target={"_blank"} href={`${proto}//${domain}/erc721-tokens/${tokenId || 0}`}>
                      {token.template ? `${token.template?.title} #${token.tokenId}` : tokenId}
                    </Link>
                  </Typography>
                ) : null}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.parents" />
              </TableCell>
              <TableCell align="right">
                {children && children.length ? (
                  <>
                    {/* <Typography variant="body1" color="textSecondary"> */}
                    {/*  <Link */}
                    {/*    target={"_blank"} */}
                    {/*    href={`${proto}//${domain}/erc721-tokens/${children ? children[0]?.matron?.tokenId : 0}`} */}
                    {/*  > */}
                    {/*    {children[0]?.matron?.token?.template?.title} #{children[0]?.matron?.token?.tokenId} */}
                    {/*  </Link> */}
                    {/* </Typography> */}
                    {/* <Typography variant="body1" color="textSecondary"> */}
                    {/*  <Link */}
                    {/*    target={"_blank"} */}
                    {/*    href={`${proto}//${domain}/erc721-tokens/${children ? children[0]?.sire?.tokenId : 0}`} */}
                    {/*  > */}
                    {/*    {children[0]?.sire?.token?.template?.title} #{children[0]?.sire?.token?.tokenId} */}
                    {/*  </Link> */}
                    {/* </Typography> */}
                  </>
                ) : (
                  "genesisZero"
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.traits" />
              </TableCell>
              <TableCell align="right">
                {traits ? (
                  <Grid container>
                    {Object.entries(result).map(([key, value], i) => (
                      <Grid key={i} container>
                        <Grid item xs={6}>
                          <FormattedMessage id={`enums.geneName.${key}`} />
                        </Grid>
                        <Grid item xs={6}>
                          {value}
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                ) : null}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};
