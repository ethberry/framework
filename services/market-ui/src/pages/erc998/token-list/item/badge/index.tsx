import { FC } from "react";
import { FormattedMessage } from "react-intl";

import { IErc998Token } from "@framework/types";

import { useStyles } from "./styles";

interface IRarityBadgeProps {
  token: IErc998Token;
}

export const RarityBadge: FC<IRarityBadgeProps> = props => {
  const { token } = props;

  const classes = useStyles(token);

  if (!token.attributes.rarity) {
    return null;
  }

  return (
    <div className={classes.root}>
      <FormattedMessage id={`enums.rarity.${token.attributes.rarity as string}`} />
    </div>
  );
};
