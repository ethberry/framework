import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { formatItem } from "@framework/exchange";
import { StyledCardContentDescription, StyledCardMedia } from "@framework/styled";
import type { IProduct } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { AmountInput } from "../../../../components/inputs/amount";

interface IProductItemProps {
  product: IProduct;
}

export const ProductItem: FC<IProductItemProps> = props => {
  const { product } = props;

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/ecommerce/products/${product.id}`}>
        <StyledCardMedia image={product.photos[0].imageUrl} title={product.photos[0].title} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {product.title}
          </Typography>
          <StyledCardContentDescription>
            <RichTextDisplay data={product.description} />
          </StyledCardContentDescription>
          <Typography variant="body2" color="textSecondary" component="p">
            {formatItem(product.productItems[0].price)}
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
