import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import { TokenRarity } from "@framework/types";

export interface IRootProps {
  isItem?: boolean;
  rarity: TokenRarity;
}

const getBackgroundColor = (rarity: TokenRarity) => {
  switch (rarity) {
    case TokenRarity.COMMON:
      return "grey";
    case TokenRarity.UNCOMMON:
      return "green";
    case TokenRarity.RARE:
      return "blue";
    case TokenRarity.EPIC:
      return "purple";
    case TokenRarity.LEGENDARY:
      return "orange";
    default:
      return "transparent";
  }
};

export const Root = styled(Box, { shouldForwardProp: prop => prop !== "rarity" && prop !== "isItem" })<IRootProps>(({
  isItem,
  rarity,
  theme,
}) => {
  return {
    ...(isItem
      ? {
          position: "relative",
          top: -10,
          left: 0,
          marginLeft: 5,
          marginRight: 5,
        }
      : {
          position: "absolute",
          top: 30,
          right: -32,
          transform: "rotate(45deg)",
        }),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    borderRadius: 4,
    paddingLeft: 5,
    paddingRight: 5,
    color: theme.palette.common.white,
    backgroundColor: getBackgroundColor(rarity),
  };
});
