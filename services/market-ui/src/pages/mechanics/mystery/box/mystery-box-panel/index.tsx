import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Box, Card, CardActions, CardContent, Toolbar, Typography } from "@mui/material";

import type { IMysteryBox } from "@framework/types";

import { MysteryboxPurchaseButton } from "../../../../../components/buttons";
import { formatPrice } from "../../../../../utils/money";

export interface IMysteryBoxPanelProps {
  box: IMysteryBox;
}

export const MysteryBoxPanel: FC<IMysteryBoxPanelProps> = props => {
  const { box } = props;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Toolbar disableGutters={true} sx={{ minHeight: "1em !important" }}>
          <Typography gutterBottom variant="h5" component="p" sx={{ flexGrow: 1 }}>
            <FormattedMessage id="pages.mystery.box.price" />
          </Typography>
        </Toolbar>
        <Box>{formatPrice(box.template?.price)}</Box>
      </CardContent>
      <CardActions>
        <MysteryboxPurchaseButton mysteryBox={box} />
      </CardActions>
    </Card>
  );
};
