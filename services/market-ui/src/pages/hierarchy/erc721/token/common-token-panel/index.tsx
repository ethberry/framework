import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { CardActions, CardContent } from "@mui/material";

import type { IToken } from "@framework/types";
import { ModuleType } from "@framework/types";

import { Erc721TransferButton, TokenSellButton } from "../../../../../components/buttons";
import { formatPrice } from "../../../../../utils/money";
import { StyledCard, StyledList, StyledToolbar, StyledTypography } from "./styled";

export interface ICommonTokenPanelProps {
  token: IToken;
}

export const CommonTokenPanel: FC<ICommonTokenPanelProps> = props => {
  const { token } = props;

  const { price } =
    token.template?.contract?.contractModule === ModuleType.LOTTERY ||
    token.template?.contract?.contractModule === ModuleType.RAFFLE
      ? // @ts-ignore
        token.round
      : token.template;

  return (
    <StyledCard>
      <CardContent>
        <StyledToolbar disableGutters>
          <StyledTypography gutterBottom variant="h5" component="p">
            <FormattedMessage id="pages.token.priceTitle" />
          </StyledTypography>
        </StyledToolbar>
        <StyledList component="ul">
          {formatPrice(price)
            .split(", ")
            .map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
        </StyledList>
      </CardContent>
      <CardActions>
        <TokenSellButton token={token} />
        <Erc721TransferButton token={token} />
      </CardActions>
    </StyledCard>
  );
};
