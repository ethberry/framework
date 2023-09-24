import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { constants, Contract, utils } from "ethers";
import { Web3ContextType } from "@web3-react/core";
import { Card, CardContent, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Construction } from "@mui/icons-material";

import { useCollection } from "@gemunion/react-hooks";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import type { IServerSignature } from "@gemunion/types-blockchain";
import { useSettings } from "@gemunion/provider-settings";
import type { IContract, ICraft, ICraftSearchDto, ITemplate } from "@framework/types";
import { TokenType } from "@framework/types";

import CraftABI from "../../../../../abis/mechanics/craft/craft.abi.json";

import { AllowanceInfoPopover } from "../../../../../components/dialogs/allowance";
import { formatItem, getEthPrice } from "../../../../../utils/money";
import { sorter } from "../../../../../utils/sorter";
import { StyledTitle, StyledToolbar } from "./styled";

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
    (values: ICraft, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(systemContract.address, CraftABI, web3Context.provider?.getSigner());

      return contract.craft(
        {
          externalId: values.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: utils.formatBytes32String("0x"),
          receiver: values.merchant!.wallet,
          referrer: constants.AddressZero,
        },
        values.item?.components.sort(sorter("id")).map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId:
            component.contract!.contractType === TokenType.ERC1155
              ? component.template!.tokens![0].tokenId
              : (component.templateId || 0).toString(), // suppression types check with 0
          amount: component.amount,
        })),
        values.price?.components.sort(sorter("id")).map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId: component.template!.tokens![0].tokenId,
          amount: component.amount,
        })),
        sign.signature,
        {
          value: getEthPrice(values.price),
        },
      ) as Promise<void>;
    },
    // { error: false },
  );

  const metaFn = useMetamask((values: ICraft, web3Context: Web3ContextType) => {
    const { chainId, account } = web3Context;

    return metaFnWithSign(
      {
        url: "/craft/sign",
        method: "POST",
        data: {
          chainId,
          account,
          referrer: settings.getReferrer(),
          craftId: values.id,
        },
      },
      values,
      web3Context,
    ) as Promise<void>;
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
        <StyledToolbar disableGutters>
          <StyledTitle gutterBottom variant="h5" component="p">
            <FormattedMessage id="pages.token.craft" />
          </StyledTitle>
          <AllowanceInfoPopover />
        </StyledToolbar>
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
