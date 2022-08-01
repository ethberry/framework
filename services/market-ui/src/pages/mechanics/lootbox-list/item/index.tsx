import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { ILootbox } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { LootboxPurchaseButton } from "../../../../components/buttons";
import { formatPrice } from "../../../../utils/money";
import { useStyles } from "./styles";

interface ILootboxItemProps {
  lootbox: ILootbox;
}

export const LootboxItem: FC<ILootboxItemProps> = props => {
  const { lootbox } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/lootboxes/${lootbox.id}`}>
        <CardHeader title={lootbox.title} />
        <CardMedia className={classes.media} image={lootbox.imageUrl} />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={lootbox.description} />
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {formatPrice(lootbox.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <LootboxPurchaseButton lootbox={lootbox} />
        </Grid>
      </CardActions>
    </Card>
  );
};
