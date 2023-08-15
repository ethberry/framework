import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { IMysterybox } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { MysteryboxPurchaseButton } from "../../../../../components/buttons";
import { formatPrice } from "../../../../../utils/money";

interface IMysteryboxListItemProps {
  mysterybox: IMysterybox;
}

export const MysteryboxListItem: FC<IMysteryboxListItemProps> = props => {
  const { mysterybox } = props;

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/mystery/boxes/${mysterybox.id}`}>
        <CardHeader title={mysterybox.title} />
        <CardMedia sx={{ height: 200 }} image={mysterybox.imageUrl} />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="div" sx={{ height: 80, overflow: "hidden" }}>
            <RichTextDisplay data={mysterybox.description} />
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {formatPrice(mysterybox.template?.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <MysteryboxPurchaseButton mysteryBox={mysterybox} />
        </Grid>
      </CardActions>
    </Card>
  );
};
