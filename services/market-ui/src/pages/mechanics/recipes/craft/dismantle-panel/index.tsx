import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { constants, Contract, utils } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { Alert, Grid, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Construction } from "@mui/icons-material";

import { useCollection } from "@gemunion/react-hooks";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import type { IServerSignature } from "@gemunion/types-blockchain";
import { useSettings } from "@gemunion/provider-settings";

import type { IDismantle, IDismantleSearchDto, IToken } from "@framework/types";
import { TokenType, GradeStrategy } from "@framework/types";

import { StyledPaper } from "../../../../hierarchy/erc721/token/styled";
import { formatItem } from "../../../../../utils/money";
import DismantleABI from "../../../../../abis/mechanics/dismantle/dismantle.abi.json";
import { sorter } from "../../../../../utils/sorter";
import { getDismantleMultiplier } from "./utils";

export interface IDismantlePanelProps {
  token: IToken;
}

export const DismantlePanel: FC<IDismantlePanelProps> = props => {
  const { token } = props;
  const rarity = Number(token.metadata.RARITY) || 1;

  const settings = useSettings();

  const { rows, isLoading } = useCollection<IDismantle, IDismantleSearchDto>({
    baseUrl: "/dismantle",
    embedded: true,
    search: {
      templateId: token.templateId,
    },
  });

  const metaFnWithSign = useServerSignature(
    (dismantle: IDismantle, web3Context: Web3ContextType, sign: IServerSignature) => {
      const contract = new Contract(process.env.EXCHANGE_ADDR, DismantleABI, web3Context.provider?.getSigner());

      return contract.dismantle(
        {
          externalId: dismantle.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: utils.formatBytes32String("0x"),
          receiver: dismantle.merchant!.wallet,
          referrer: constants.AddressZero,
        },
        // ITEM to get after dismantle
        dismantle.item?.components.sort(sorter("id")).map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId:
            component.contract!.contractType === TokenType.ERC1155
              ? component.template!.tokens![0].tokenId
              : (component.templateId || 0).toString(), // suppression types check with 0
          // TODO set Multiplier strategy in dismantle recipe
          amount: getDismantleMultiplier(
            rarity,
            component.amount,
            GradeStrategy.EXPONENTIAL,
            dismantle.rarityMultiplier,
          ).amount.toString(),
        })),
        // PRICE token to dismantle
        dismantle.price?.components.sort(sorter("id")).map(component => ({
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

  const metaFn = useMetamask((dismantle: IDismantle, web3Context: Web3ContextType) => {
    const { chainId, account } = web3Context;

    return metaFnWithSign(
      {
        url: "/dismantle/sign",
        method: "POST",
        data: {
          chainId,
          account,
          referrer: settings.getReferrer(),
          dismantleId: dismantle.id,
          tokenId: token.tokenId,
          address: token.template!.contract!.address,
        },
      },
      dismantle,
      web3Context,
    );
  });

  const handleDismantle = (dismantle: IDismantle) => {
    return async () => await metaFn(dismantle);
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
        <FormattedMessage id="pages.erc721.token.dismantle" />
      </Typography>
      <Alert severity="warning">
        <FormattedMessage id="alert.approveDismantle" />
      </Alert>
      <List>
        {rows.map(dismantle => {
          return (
            <ListItemButton key={dismantle.id} onClick={handleDismantle(dismantle)}>
              <ListItemIcon>
                <Construction />
              </ListItemIcon>
              {/* <ListItemText>{formatItem(dismantle.item)}</ListItemText> */}
              <ListItemText>
                <Grid container spacing={1} alignItems="flex-center">
                  <Grid item xs={12}>
                    {formatItem(dismantle.item)}
                  </Grid>
                  {dismantle.rarityMultiplier > 0 ? (
                    <Grid item xs={12}>
                      <FormattedMessage
                        id="pages.erc721.token.rarityMultiplier"
                        values={{
                          multiplier: ((1 + dismantle.rarityMultiplier / 100) ** rarity).toString(),
                        }}
                      />
                    </Grid>
                  ) : null}
                </Grid>
              </ListItemText>
            </ListItemButton>
          );
        })}
      </List>
    </StyledPaper>
  );
};
