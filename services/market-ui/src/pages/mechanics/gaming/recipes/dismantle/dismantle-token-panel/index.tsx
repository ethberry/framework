import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router";
import { CardContent, Grid, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Construction } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import { useApiCall } from "@gemunion/react-hooks";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import type { IServerSignature } from "@gemunion/types-blockchain";
import { useAppSelector } from "@gemunion/redux";
import { walletSelectors } from "@gemunion/provider-wallet";
import {
  convertDatabaseAssetToChainAsset,
  convertDatabaseAssetToTokenTypeAsset,
  formatItem,
} from "@framework/exchange";
import { StyledListWrapper } from "@framework/styled";
import type { IContract, IDismantle, IToken } from "@framework/types";

import DismantleABI from "@framework/abis/json/ExchangeDismantleFacet/dismantle.json";
import { getDismantleMultiplier } from "./utils";
import { StyledCard } from "./styled";
import { useAllowance } from "../../../../../../utils/use-allowance";
import { StyledToolbar, StyledTypography } from "../../../../../hierarchy/erc721/token/common-token-panel/styled";

export interface IDismantleTokenPanelProps {
  token: IToken;
}

export const DismantleTokenPanel: FC<IDismantleTokenPanelProps> = props => {
  const { token } = props;

  const navigate = useNavigate();
  const referrer = useAppSelector(walletSelectors.referrerSelector);
  const [rows, setRows] = useState<IDismantle[]>([]);

  const { fn: getDismantleFn, isLoading } = useApiCall(
    api =>
      api.fetchJson({
        url: "/recipes/dismantle",
        data: {
          templateId: token.templateId,
        },
      }),
    { success: false, error: false },
  );

  const getDismantle = async () => {
    const json = await getDismantleFn();
    setRows(json.rows);
  };

  const metaFnWithAllowance = useAllowance(
    (web3Context: Web3ContextType, values: IDismantle, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(systemContract.address, DismantleABI, web3Context.provider?.getSigner());

      const price = convertDatabaseAssetToChainAsset(values.price!.components);
      const item = convertDatabaseAssetToChainAsset(values.item!.components);
      // set real token Id
      price[0].tokenId = token.tokenId;

      return contract.dismantle(
        {
          externalId: values.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: utils.formatBytes32String("0x"),
          receiver: values.merchant!.wallet,
          referrer: constants.AddressZero,
        },
        // ITEM to get after dismantle
        item,
        // PRICE token to dismantle
        price[0],
        sign.signature,
      ) as Promise<void>;
    },
  );

  const metaFnWithSign = useServerSignature(
    (values: IDismantle, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const assets = convertDatabaseAssetToTokenTypeAsset(values.price!.components);
      return metaFnWithAllowance(
        { contract: systemContract.address, assets },
        web3Context,
        values,
        sign,
        systemContract,
      );
    },
  );

  const metaFn = useMetamask((values: IDismantle, web3Context: Web3ContextType) => {
    return metaFnWithSign(
      {
        url: "/recipes/dismantle/sign",
        method: "POST",
        data: {
          referrer,
          dismantleId: values.id,
          tokenId: token.id,
        },
      },
      values,
      web3Context,
    ) as Promise<void>;
  });

  const handleDismantle = (dismantle: IDismantle) => {
    return async () =>
      await metaFn(dismantle).then(() => {
        navigate("/tokens");
      });
  };

  useEffect(() => {
    if (!rows.length) {
      void getDismantle();
    }
  }, []);

  if (isLoading) {
    return null;
  }

  if (!rows.length) {
    return null;
  }

  return (
    <StyledCard>
      <CardContent>
        <StyledToolbar disableGutters>
          <StyledTypography gutterBottom variant="h5" component="p">
            <FormattedMessage id="pages.token.dismantle" />
          </StyledTypography>
        </StyledToolbar>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(dismantle => {
            const { multiplier } = getDismantleMultiplier(
              "1",
              token.metadata,
              dismantle.dismantleStrategy,
              dismantle.rarityMultiplier,
            );
            return (
              <ListItemButton key={dismantle.id} onClick={handleDismantle(dismantle)}>
                <ListItemIcon>
                  <Construction />
                </ListItemIcon>
                <ListItemText>
                  <Grid container spacing={1} alignItems="flex-center">
                    <Grid item xs={12}>
                      {formatItem(dismantle.item)}
                    </Grid>
                    <Grid item xs={12}>
                      {multiplier !== 1 ? (
                        <FormattedMessage id="pages.token.rarityMultiplier" values={{ multiplier }} />
                      ) : null}
                    </Grid>
                  </Grid>
                </ListItemText>
              </ListItemButton>
            );
          })}
        </StyledListWrapper>
      </CardContent>
    </StyledCard>
  );
};
