import React, { FC } from "react";
import { Card, Button, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { RichTextDisplay } from "@gemunionstudio/framework-material-ui-rte";

import { IProduct } from "@gemunionstudio/framework-types";

import useStyles from "./styles";
import { formatMoney } from "../../../utils/money";

interface IProductItemProps {
  product: IProduct;
}

export const ProductItem: FC<IProductItemProps> = props => {
  const { product } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/products/${product.id}`}>
        <CardMedia className={classes.media} image={product.photos[0].imageUrl} title={product.photos[0].title} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {product.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={product.description} />
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {formatMoney(product.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <Button>Buy now!</Button>
        </Grid>
      </CardActions>
    </Card>
  );
};
