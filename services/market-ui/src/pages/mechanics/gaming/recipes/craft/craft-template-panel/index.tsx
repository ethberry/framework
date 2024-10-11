import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Card, CardContent, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Construction } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import { comparator } from "@ethberry/utils";
import { useApiCall } from "@ethberry/react-hooks";
import { useMetamask, useServerSignature } from "@ethberry/react-hooks-eth";
import type { IServerSignature } from "@ethberry/types-blockchain";
import { useAppSelector } from "@ethberry/redux";
import { walletSelectors } from "@ethberry/provider-wallet";
import { formatItem, getEthPrice } from "@framework/exchange";
import { StyledListWrapper } from "@framework/styled";
import type { IContract, ICraft, ITemplate } from "@framework/types";
import { TokenType } from "@framework/types";

import CraftABI from "@framework/abis/json/ExchangeCraftFacet/craft.json";

import { StyledTitle, StyledToolbar } from "./styled";

export interface ICraftTemplatePanelProps {
  template: ITemplate;
}

export const CraftTemplatePanel: FC<ICraftTemplatePanelProps> = props => {
  const { template } = props;

  const referrer = useAppSelector(walletSelectors.referrerSelector);

  const [rows, setRows] = useState<ICraft[]>([]);

  const { fn: getCraftFn, isLoading } = useApiCall(
    api =>
      api.fetchJson({
        url: "/recipes/craft",
        data: {
          templateId: template.id,
        },
      }),
    { success: false, error: false },
  );

  const getCraft = async () => {
    const json = await getCraftFn();
    setRows(json.rows);
  };

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
        values.item?.components.sort(comparator("id")).map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId:
            component.contract!.contractType === TokenType.ERC1155
              ? component.template!.tokens![0].tokenId
              : (component.templateId || 0).toString(), // suppression types check with 0
          amount: component.amount,
        })),
        values.price?.components.sort(comparator("id")).map(component => ({
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
        url: "/recipies/craft/sign",
        method: "POST",
        data: {
          chainId,
          account,
          referrer,
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

  useEffect(() => {
    void getCraft();
  }, []);

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
        </StyledToolbar>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
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
        </StyledListWrapper>
      </CardContent>
    </Card>
  );
};
