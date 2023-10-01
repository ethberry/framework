import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { StyledCardContentDescription, StyledCardMedia } from "@framework/styled";
import { IAssetPromo } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { PromoPurchaseButton } from "../../../../../components/buttons";
import { formatPrice } from "../../../../../utils/money";

interface IAssetPromoItemProps {
  promo: IAssetPromo;
}

export const AssetPromoItem: FC<IAssetPromoItemProps> = props => {
  const { promo } = props;

  return (
    <Card>
      <CardActionArea
        component={RouterLink}
        // prettier-ignore
        to={`/${promo.item!.components[0].contract!.contractType!.toLowerCase()}-templates/${promo.item!.components[0].templateId || 0}`}
      >
        <CardHeader title={promo.item?.components[0]?.template?.title} />
        <StyledCardMedia image={promo.item?.components[0]?.template?.imageUrl} />
        <CardContent>
          <StyledCardContentDescription>
            <RichTextDisplay data={promo.item?.components[0]?.template?.description} />
          </StyledCardContentDescription>
          <Typography variant="body2" color="textSecondary" component="p">
            {formatPrice(promo.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <PromoPurchaseButton promo={promo} />
        </Grid>
      </CardActions>
    </Card>
  );
};
