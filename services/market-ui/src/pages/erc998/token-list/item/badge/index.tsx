import { FC } from "react";
import { FormattedMessage } from "react-intl";

import { IToken, TokenAttributes } from "@framework/types";

import { useStyles } from "./styles";

interface IRarityBadgeProps {
  token: IToken;
}

export const RarityBadge: FC<IRarityBadgeProps> = props => {
  const { token } = props;

  const classes = useStyles(token);

  const rarity = token.attributes[TokenAttributes.RARITY];

  if (!rarity) {
    return null;
  }

  return (
    <div className={classes.root}>
      <FormattedMessage id={`enums.rarity.${rarity as string}`} />
    </div>
  );
};
