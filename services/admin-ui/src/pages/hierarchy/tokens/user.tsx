import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { constants, Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";
import { TableCell, TableRow } from "@mui/material";

import { AddressLink } from "@gemunion/mui-scanner";
import { useMetamaskValue } from "@gemunion/react-hooks-eth";

import UserOfABI from "../../../abis/pages/hierarchy/tokens/erc4907.userOf.abi.json";

export interface ITokenUserView {
  tokenId: string;
  address: string;
}

export const TokenUserView: FC<ITokenUserView> = props => {
  const { tokenId, address } = props;

  const [tokenUser, setTokenUser] = useState<string | null>(null);

  const getCurrentUser = useMetamaskValue(
    async (_a: null, web3Context: Web3ContextType) => {
      const contract = new Contract(address, UserOfABI, web3Context.provider?.getSigner());
      const user = await contract.userOf(tokenId);
      return user as string;
    },
    { success: false },
  );

  useEffect(() => {
    if (!tokenId || address === undefined) {
      return;
    }

    void getCurrentUser(null).then((user: string) => {
      setTokenUser(user);
    });
  }, [tokenId, address]);

  if (tokenUser === constants.AddressZero) {
    return null;
  }

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        <FormattedMessage id="form.labels.user" />
      </TableCell>
      <TableCell align="right">
        <AddressLink address={tokenUser || ""} length={42} />
      </TableCell>
    </TableRow>
  );
};
