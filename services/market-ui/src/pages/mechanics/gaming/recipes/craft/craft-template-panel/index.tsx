import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Card, CardContent, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Construction } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import { useApiCall } from "@ethberry/react-hooks";
import { useMetamask, useServerSignature } from "@ethberry/react-hooks-eth";
import type { IServerSignature } from "@ethberry/types-blockchain";
import { useAppSelector } from "@ethberry/redux";
import { walletSelectors } from "@ethberry/provider-wallet";
import { convertDatabaseAssetToChainAsset, formatItem, getEthPrice } from "@framework/exchange";
import { StyledListWrapper } from "@framework/styled";
import type { IContract, ICraft, ITemplate } from "@framework/types";

import ExchangeCraftFacetCraftABI from "@framework/abis/json/ExchangeCraftFacet/craft.json";

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
    (craft: ICraft, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(
        systemContract.address,
        ExchangeCraftFacetCraftABI,
        web3Context.provider?.getSigner(),
      );

      const items = convertDatabaseAssetToChainAsset(craft.item!.components);
      const price = convertDatabaseAssetToChainAsset(craft.price!.components);

      return contract.craft(
        {
          externalId: craft.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: constants.HashZero,
          receiver: craft.merchant!.wallet,
          referrer: constants.AddressZero,
        },
        items,
        price,
        sign.signature,
        {
          value: getEthPrice(craft.price),
        },
      ) as Promise<void>;
    },
    // { error: false },
  );

  const metaFn = useMetamask((values: ICraft, web3Context: Web3ContextType) => {
    return metaFnWithSign(
      {
        url: "/recipes/craft/sign",
        method: "POST",
        data: {
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
