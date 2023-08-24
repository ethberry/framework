import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { IMysteryBox } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { MysteryboxPurchaseButton } from "../../../../../components/buttons";
import { formatPrice } from "../../../../../utils/money";

interface IMysteryBoxListItemProps {
  mysteryBox: IMysteryBox;
}

export const MysteryBoxListItem: FC<IMysteryBoxListItemProps> = props => {
  const { mysteryBox } = props;

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/mystery/boxes/${mysteryBox.id}`}>
        <CardHeader title={mysteryBox.title} />
        <CardMedia sx={{ height: 200 }} image={mysteryBox.imageUrl} />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="div" sx={{ height: 80, overflow: "hidden" }}>
            <RichTextDisplay data={mysteryBox.description} />
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {formatPrice(mysteryBox.template?.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <MysteryboxPurchaseButton mysteryBox={mysteryBox} />
        </Grid>
      </CardActions>
    </Card>
  );
};
