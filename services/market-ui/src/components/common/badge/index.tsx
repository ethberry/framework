import { FC } from "react";
import { FormattedMessage } from "react-intl";

import { IToken, TokenAttributes, TokenRarity } from "@framework/types";

import { useStyles } from "./styles";

interface IRarityBadgeProps {
  token: IToken;
  itemClass?: boolean;
}

export const RarityBadge: FC<IRarityBadgeProps> = props => {
  const { token, itemClass } = props;

  const rarity = Object.values(TokenRarity)[token.attributes[TokenAttributes.RARITY]];

  const classes = useStyles({ rarity });

  if (!rarity) {
    return null;
  }

  return (

    <div className={itemClass ? classes.item : classes.root} data-testid="RarityBadge">
      <FormattedMessage id={`enums.RARITY.${rarity as string}`} />
    </div>
  );
};
