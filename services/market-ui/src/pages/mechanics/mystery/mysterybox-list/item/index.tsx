import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { IMysterybox } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { MysteryBoxPurchaseButton } from "../../../../../components/buttons";
import { formatPrice } from "../../../../../utils/money";
import { useStyles } from "./styles";

interface IMysteryboxListItemProps {
  mysterybox: IMysterybox;
}

export const MysteryboxListItem: FC<IMysteryboxListItemProps> = props => {
  const { mysterybox } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/mystery-boxes/${mysterybox.id}`}>
        <CardHeader title={mysterybox.title} />
        <CardMedia className={classes.media} image={mysterybox.imageUrl} />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={mysterybox.description} />
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {formatPrice(mysterybox.template?.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <MysteryBoxPurchaseButton mysterybox={mysterybox} />
        </Grid>
      </CardActions>
    </Card>
  );
};
