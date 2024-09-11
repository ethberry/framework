import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { constants } from "ethers";
import { TableCell, TableRow } from "@mui/material";

import { AddressLink } from "@gemunion/mui-scanner";

export interface ITokenUserMetadataView {
  metadata: any;
}

export const TokenUserMetadataView: FC<ITokenUserMetadataView> = props => {
  const { metadata } = props;

  if (!metadata?.USER || metadata.USER === constants.AddressZero) {
    return null;
  }

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        <FormattedMessage id="form.labels.user" />
      </TableCell>
      <TableCell align="right">
        <AddressLink address={metadata.USER} length={42} />
      </TableCell>
    </TableRow>
  );
};
