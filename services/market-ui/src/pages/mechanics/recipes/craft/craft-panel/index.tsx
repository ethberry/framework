import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { constants, Contract, utils } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { Alert, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Construction } from "@mui/icons-material";

import { useCollection } from "@gemunion/react-hooks";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import type { IServerSignature } from "@gemunion/types-blockchain";
import { useSettings } from "@gemunion/provider-settings";
import type { ICraft, ICraftSearchDto, ITemplate } from "@framework/types";
import { TokenType } from "@framework/types";

import { formatItem, getEthPrice } from "../../../../../utils/money";
import CraftABI from "../../../../../abis/mechanics/craft/craft.abi.json";
import { sorter } from "../../../../../utils/sorter";

import { StyledPaper } from "../../../../hierarchy/erc721/token/styled";

export interface ICraftPanelProps {
  template: ITemplate;
}

export const CraftPanel: FC<ICraftPanelProps> = props => {
  const { template } = props;

  const settings = useSettings();

  const { rows, isLoading } = useCollection<ICraft, ICraftSearchDto>({
    baseUrl: "/craft",
    embedded: true,
    search: {
      templateId: template.id,
    },
  });

  const metaFnWithSign = useServerSignature(
    (craft: ICraft, web3Context: Web3ContextType, sign: IServerSignature) => {
      const contract = new Contract(process.env.EXCHANGE_ADDR, CraftABI, web3Context.provider?.getSigner());

      return contract.craft(
        {
          externalId: craft.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: utils.formatBytes32String("0x"),
          receiver: craft.merchant!.wallet,
          referrer: constants.AddressZero,
        },
        craft.item?.components.sort(sorter("id")).map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId:
            component.contract!.contractType === TokenType.ERC1155
              ? component.template!.tokens![0].tokenId
              : (component.templateId || 0).toString(), // suppression types check with 0
          amount: component.amount,
        })),
        craft.price?.components.sort(sorter("id")).map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId: component.template!.tokens![0].tokenId,
          amount: component.amount,
        })),
        sign.signature,
        {
          value: getEthPrice(craft.price),
        },
      ) as Promise<void>;
    },
    // { error: false },
  );

  const metaFn = useMetamask((craft: ICraft, web3Context: Web3ContextType) => {
    const { chainId, account } = web3Context;

    return metaFnWithSign(
      {
        url: "/craft/sign",
        method: "POST",
        data: {
          chainId,
          account,
          referrer: settings.getReferrer(),
          craftId: craft.id,
        },
      },
      craft,
      web3Context,
    );
  });

  const handleCraft = (craft: ICraft) => {
    return async () => await metaFn(craft);
  };

  if (isLoading) {
    return null;
  }

  if (!rows.length) {
    return null;
  }

  return (
    <StyledPaper>
      <Typography>
        <FormattedMessage id="pages.erc721.token.craft" />
      </Typography>
      <Alert severity="warning">
        <FormattedMessage id="alert.approveCraft" />
      </Alert>

      <List>
        {rows.map(craft => {
          return (
            <ListItemButton key={craft.id} onClick={handleCraft(craft)}>
              <ListItemIcon>
                <Construction />
              </ListItemIcon>
              <ListItemText>{formatItem(craft.price)}</ListItemText>
            </ListItemButton>
          );
        })}
      </List>
    </StyledPaper>
  );
};
