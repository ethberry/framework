import { FC, useCallback } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { IPromo } from "@framework/types";

import { useStyles } from "./styles";

interface IPromoBannerProps {
  promo: IPromo;
}

export const PromoBanner: FC<IPromoBannerProps> = props => {
  const { promo } = props;

  const classes = useStyles(promo);
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/ecommerce/products/${promo.product!.id}`);
  }, [promo]);

  return (
    <Grid container sx={{ my: 6 }} className={classes.container} data-testid="DropBanner">
      <Grid item xs={12} sm={6}>
        <img className={classes.image} src={promo.imageUrl} alt="banner" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box sx={{ cursor: "pointer", pr: { xs: 0, sm: 6 } }} onClick={handleClick}>
          <Typography variant="h3">{promo.title}</Typography>
          <Box sx={{ my: 3 }}>
            <Typography variant="h5">{promo.product?.title}</Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
