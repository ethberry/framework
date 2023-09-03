import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { constants, Contract, utils } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useApiCall } from "@gemunion/react-hooks";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { IWaitListList, TokenType } from "@framework/types";

import WaitListSetRewardABI from "../../../../../abis/mechanics/wait-list/list/setReward.abi.json";

export interface IGenerateMenuItemProps {
  waitListList: IWaitListList;
}

export const GenerateMenuItem: FC<IGenerateMenuItemProps> = props => {
  const {
    waitListList: { id },
  } = props;

  const { fn } = useApiCall(
    async (api, values) => {
      return api.fetchJson({
        url: `/wait-list/list/generate`,
        method: "POST",
        data: {
          listId: values,
        },
      });
    },
    { success: false },
  );

  const metaFn = useMetamask((result: IWaitListList, web3Context: Web3ContextType) => {
    const contract = new Contract(result.contract.address, WaitListSetRewardABI, web3Context.provider?.getSigner());

    return contract.setReward(
      {
        externalId: id,
        expiresAt: 0,
        nonce: constants.HashZero,
        extra: utils.arrayify(result.root),
        receiver: constants.AddressZero,
        referrer: constants.AddressZero,
      },
      result.item?.components.map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract!.address,
        tokenId: component.templateId || 0,
        amount: component.amount,
      })),
    ) as Promise<void>;
  });

  const handleUpload = async () => {
    await fn(void 0, id).then(async proof => {
      // proof can be undefined in case of http error
      // the error is handled by useApiCall
      if (proof) {
        await metaFn(proof);
      }
    });
  };

  return (
    <Fragment>
      <MenuItem onClick={handleUpload}>
        <ListItemIcon>
          <Settings />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.submit" />
        </Typography>
      </MenuItem>
    </Fragment>
  );
};