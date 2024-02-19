import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Box, CardActions, CardContent } from "@mui/material";

import { formatItem } from "@framework/exchange";
import type { IMysteryBox } from "@framework/types";

import { MysteryBoxPurchaseButton } from "../../../../../../components/buttons";
import { AllowanceInfoPopover } from "../../../../../../components/dialogs/allowance";
import { StyledCard, StyledToolbar, StyledTypography } from "./styled";

export interface IMysteryBoxPanelProps {
  box: IMysteryBox;
}

export const MysteryBoxPanel: FC<IMysteryBoxPanelProps> = props => {
  const { box } = props;

  return (
    <StyledCard>
      <CardContent>
        <StyledToolbar disableGutters>
          <StyledTypography gutterBottom variant="h5" component="p">
            <FormattedMessage id="pages.mystery.box.price" />
          </StyledTypography>
          <AllowanceInfoPopover />
        </StyledToolbar>
        <Box>{formatItem(box.template?.price)}</Box>
      </CardContent>
      <CardActions>
        <MysteryBoxPurchaseButton mysteryBox={box} />
      </CardActions>
    </StyledCard>
  );
};
