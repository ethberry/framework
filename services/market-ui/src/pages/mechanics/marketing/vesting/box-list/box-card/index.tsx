import React, { FC } from "react";
import { CardActionArea, CardActions, CardHeader, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { formatItem } from "@framework/exchange";
import { ITemplate, IVestingBox } from "@framework/types";

import { VestingBoxPurchaseButton } from "../../../../../../components/buttons";
import { StyledCardContent, StyledCardMedia } from "./styled";
import { Root } from "./styled";

interface IBoxCard {
  vestingBox?: IVestingBox;
  template?: ITemplate;
}

export const BoxCard: FC<IBoxCard> = props => {
  const { vestingBox, template } = props;

  return (
    <Root>
      <CardActionArea component={Link} to={`/vesting/boxes/${template!.id}/view`}>
        <StyledCardMedia image={template!.imageUrl} />
        <CardHeader title={template!.title} />
      </CardActionArea>
      <CardActions>
        <StyledCardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {formatItem(template?.price)}
          </Typography>
        </StyledCardContent>
        {vestingBox && (
          <Grid container justifyContent="flex-end" alignItems="flex-end">
            <Grid item xs={12}>
              <VestingBoxPurchaseButton vestingBox={vestingBox} />
            </Grid>
          </Grid>
        )}
      </CardActions>
    </Root>
  );
};
