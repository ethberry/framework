import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Box, CardActions, CardContent } from "@mui/material";

import { formatItem } from "@framework/exchange";
import type { ILootBox } from "@framework/types";

import { LootBoxPurchaseButton } from "../../../../../../components/buttons";
import { StyledCard, StyledToolbar, StyledTypography } from "./styled";

export interface ILootBoxPanelProps {
  box: ILootBox;
}

export const LootBoxPanel: FC<ILootBoxPanelProps> = props => {
  const { box } = props;

  return (
    <StyledCard>
      <CardContent>
        <StyledToolbar disableGutters>
          <StyledTypography gutterBottom variant="h5" component="p">
            <FormattedMessage id="pages.loot.box.price" />
          </StyledTypography>
        </StyledToolbar>
        <Box>{formatItem(box.template?.price)}</Box>
      </CardContent>
      <CardActions>
        <LootBoxPurchaseButton lootBox={box} />
      </CardActions>
    </StyledCard>
  );
};
