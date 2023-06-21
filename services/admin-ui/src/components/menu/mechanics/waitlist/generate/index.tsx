import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { constants, Contract, utils } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useApiCall } from "@gemunion/react-hooks";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { IWaitListList, TokenType } from "@framework/types";

import WaitListSetRewardABI from "../../../../../abis/mechanics/waitlist/list/setReward.abi.json";

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
        url: `/waitlist/list/generate`,
        method: "POST",
        data: {
          listId: values,
        },
      });
    },
    { success: false },
  );

  const metaFn = useMetamask((result: IWaitListList, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.WAITLIST_ADDR, WaitListSetRewardABI, web3Context.provider?.getSigner());

    const params = {
      nonce: constants.HashZero,
      externalId: id,
      expiresAt: 0,
      referrer: constants.AddressZero,
      extra: utils.arrayify(result.root),
    };

    return contract.setReward(
      params,
      result.item?.components.map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract!.address,
        tokenId: component.templateId || 0,
        amount: component.amount,
      })),
    ) as Promise<void>;
  });

  const handleUpload = async () => {
    // TODO handle 500 error
    const proof = await fn(null as unknown as any, id);
    return metaFn(proof);
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
