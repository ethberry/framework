import { FC } from "react";
import { FormattedMessage } from "react-intl";

import { IToken, TokenMetadata, TokenRarity } from "@framework/types";

import { Root } from "./styled";

interface IRarityBadgeProps {
  isItem?: boolean;
  token: IToken;
}

export const RarityBadge: FC<IRarityBadgeProps> = props => {
  const { isItem, token } = props;

  const rarity = Object.values(TokenRarity)[token.metadata[TokenMetadata.RARITY]];

  if (!rarity) {
    return null;
  }

  return (
    <Root rarity={rarity} isItem={isItem} data-testid="RarityBadge">
      <FormattedMessage id={`enums.RARITY.${rarity as string}`} />
    </Root>
  );
};
