import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

import { TokenRarity } from "@framework/types";

export const useStyles = makeStyles<Theme>(
  () => ({
    root: {
      position: "absolute",
      top: 70,
      left: 10,
      borderRadius: 4,
      paddingLeft: 5,
      paddingRight: 5,
      color: "white",
      backgroundColor: ({ rarity }: any) => {
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
      },
    },
    item: {
      position: "relative",
      top: -10,
      left: 0,
      borderRadius: 4,
      paddingLeft: 5,
      paddingRight: 5,
      marginLeft: 5,
      marginRight: 5,
      color: "white",
      backgroundColor: ({ rarity }: any) => {
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
      },
    },
  }),
  { name: "RarityBadge" },
);
