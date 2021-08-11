import React, { FC } from "react";
import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

import { IMerchant } from "@gemunionstudio/framework-types";

import useStyles from "./styles";

interface IProductItemProps {
  merchant: IMerchant;
}

export const MerchantItem: FC<IProductItemProps> = props => {
  const { merchant } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/merchants/${merchant.id}`}>
        <CardMedia className={classes.media} image={merchant.imageUrl} title={`${merchant.title}`} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {merchant.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
