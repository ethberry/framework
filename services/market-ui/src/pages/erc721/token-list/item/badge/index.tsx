import { FC } from "react";
import { FormattedMessage } from "react-intl";

import { IErc721Token, TokenRarity } from "@framework/types";

import { useStyles } from "./styles";

interface IRarityBadgeProps {
  token: IErc721Token;
}

export const RarityBadge: FC<IRarityBadgeProps> = props => {
  const { token } = props;

  const classes = useStyles(token);

  if (token.rarity === TokenRarity.UNKNOWN) {
    return null;
  }

  return (
    <div className={classes.root}>
      <FormattedMessage id={`enums.rarity.${token.rarity}`} />
    </div>
  );
};
