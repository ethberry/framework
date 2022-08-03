import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { IDrop } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { DropPurchaseButton } from "../../../../components/buttons";
import { formatPrice } from "../../../../utils/money";
import { useStyles } from "./styles";

interface IDropItemProps {
  drop: IDrop;
}

export const DropItem: FC<IDropItemProps> = props => {
  const { drop } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea
        component={RouterLink}
        // prettier-ignore
        to={`/${drop.item!.components[0].contract!.contractType.toLowerCase()}-templates/${drop.item!.components[0].templateId}`}
      >
        <CardHeader title={drop.item?.components[0]?.template?.title} />
        <CardMedia className={classes.media} image={drop.item?.components[0]?.template?.imageUrl} />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={drop.item?.components[0]?.template?.description} />
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {formatPrice(drop.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <DropPurchaseButton drop={drop} />
        </Grid>
      </CardActions>
    </Card>
  );
};
