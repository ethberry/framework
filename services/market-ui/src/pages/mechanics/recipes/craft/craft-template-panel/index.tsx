import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { constants, Contract, utils } from "ethers";
import { Web3ContextType } from "@web3-react/core";
import {
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { Construction } from "@mui/icons-material";

import { useCollection } from "@gemunion/react-hooks";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import type { IServerSignature } from "@gemunion/types-blockchain";
import { useSettings } from "@gemunion/provider-settings";
import type { ICraft, ICraftSearchDto, ITemplate } from "@framework/types";
import { TokenType } from "@framework/types";

import CraftABI from "../../../../../abis/mechanics/craft/craft.abi.json";

import { AllowanceInfoPopover } from "../../../../../components/dialogs/allowance";
import { formatItem, getEthPrice } from "../../../../../utils/money";
import { sorter } from "../../../../../utils/sorter";

export interface ICraftTemplatePanelProps {
  template: ITemplate;
}

export const CraftTemplatePanel: FC<ICraftTemplatePanelProps> = props => {
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
    <Card>
      <CardContent>
        <Toolbar disableGutters={true} sx={{ minHeight: "1em !important" }}>
          <Typography gutterBottom variant="h5" component="p" sx={{ flexGrow: 1 }}>
            <FormattedMessage id="pages.token.craft" />
          </Typography>
          <AllowanceInfoPopover />
        </Toolbar>
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
      </CardContent>
    </Card>
  );
};
