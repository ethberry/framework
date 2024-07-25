import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router";
import { Card, CardContent, Grid, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Construction } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import { useApiCall } from "@gemunion/react-hooks";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import type { IServerSignature } from "@gemunion/types-blockchain";
import { useAppSelector } from "@gemunion/redux";
import { walletSelectors } from "@gemunion/provider-wallet";
import { formatItem } from "@framework/exchange";
import { StyledListWrapper } from "@framework/styled";
import type { IContract, IDismantle, IToken } from "@framework/types";
import { TokenType } from "@framework/types";

import DismantleABI from "@framework/abis/json/ExchangeDismantleFacet/dismantle.json";

import { sorter } from "../../../../../../utils/sorter";
import { AllowanceInfoPopover } from "../../../../../../components/dialogs/allowance";
import { getDismantleMultiplier } from "./utils";
import { StyledCard, StyledToolbar, StyledTypography } from "./styled";

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

  const metaFnWithSign = useServerSignature(
    (values: IDismantle, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(systemContract.address, DismantleABI, web3Context.provider?.getSigner());

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
        values.item?.components.sort(sorter("id")).map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId:
            component.contract!.contractType === TokenType.ERC1155 ||
            component.contract!.contractType === TokenType.ERC20
              ? component.template!.tokens![0].tokenId
              : (component.templateId || 0).toString(), // suppression types check with 0
          amount: getDismantleMultiplier(
            component.amount,
            token.metadata,
            values.dismantleStrategy,
            values.rarityMultiplier,
          ).amount.toString(),
        })),
        // PRICE token to dismantle
        values.price?.components.sort(sorter("id")).map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId: token.tokenId,
          amount: component.amount,
        }))[0],
        sign.signature,
        // { dismantle cost not implemented
        //   value: getEthPrice(dismantle.item),
        // },
      ) as Promise<void>;
    },
    // { error: false },
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
          <AllowanceInfoPopover />
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
              <Card key={dismantle.id}>
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
              </Card>
            );
          })}
        </StyledListWrapper>
      </CardContent>
    </StyledCard>
  );
};
