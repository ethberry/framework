import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { StyledCardContentDescription, StyledCardMedia } from "@framework/styled";
import { IMysteryBox } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { MysteryBoxPurchaseButton } from "../../../../../components/buttons";
import { formatPrice } from "../../../../../utils/money";

interface IMysteryBoxListItemProps {
  mysteryBox: IMysteryBox;
}

export const MysteryBoxListItem: FC<IMysteryBoxListItemProps> = props => {
  const { mysteryBox } = props;

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/mystery/boxes/${mysteryBox.id}`}>
        <CardHeader title={mysteryBox.title} />
        <StyledCardMedia image={mysteryBox.imageUrl} />
        <CardContent>
          <StyledCardContentDescription>
            <RichTextDisplay data={mysteryBox.description} />
          </StyledCardContentDescription>
          <Typography variant="body2" color="textSecondary" component="p">
            {formatPrice(mysteryBox.template?.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <MysteryBoxPurchaseButton mysteryBox={mysteryBox} />
        </Grid>
      </CardActions>
    </Card>
  );
};
