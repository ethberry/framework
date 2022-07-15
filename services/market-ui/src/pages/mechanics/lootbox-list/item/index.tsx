import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { ILootbox } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { LootboxBuyButton } from "../../../../components/buttons";
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
        <CardMedia className={classes.media} image={lootbox.imageUrl} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {lootbox.title}
          </Typography>
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
          <LootboxBuyButton lootbox={lootbox} />
        </Grid>
      </CardActions>
    </Card>
  );
};
