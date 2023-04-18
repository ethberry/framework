import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { IProduct } from "@framework/types";

import { useStyles } from "./styles";
import { formatPrice } from "../../../../utils/money";
import { AmountInput } from "../../../../components/inputs/amount-input";

interface IProductItemProps {
  product: IProduct;
}

export const ProductItem: FC<IProductItemProps> = props => {
  const { product } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/ecommerce/products/${product.id}`}>
        <CardMedia className={classes.media} image={product.photos[0].imageUrl} title={product.photos[0].title} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {product.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={product.description} />
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {formatPrice(product.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <AmountInput product={product} />
        </Grid>
      </CardActions>
    </Card>
  );
};
