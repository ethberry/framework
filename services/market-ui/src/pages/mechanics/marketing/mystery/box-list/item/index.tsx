import { FC } from "react";
import { CardActionArea, CardActions, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { formatItem } from "@framework/exchange";
import { StyledCardContentDescription, StyledCardMedia, StyledTemplateItemCard } from "@framework/styled";
import type { IMysteryBox } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { MysteryBoxPurchaseButton } from "../../../../../../components/buttons";

interface IMysteryBoxListItemProps {
  mysteryBox: IMysteryBox;
}

export const MysteryBoxListItem: FC<IMysteryBoxListItemProps> = props => {
  const { mysteryBox } = props;

  return (
    <StyledTemplateItemCard>
      <CardActionArea component={RouterLink} to={`/mystery/boxes/${mysteryBox.id}`}>
        <CardHeader title={mysteryBox.title} />
        <StyledCardMedia image={mysteryBox.imageUrl} />
        <CardContent>
          <StyledCardContentDescription>
            <RichTextDisplay data={mysteryBox.description} />
          </StyledCardContentDescription>
          <Typography variant="body2" color="textSecondary" component="p">
            {formatItem(mysteryBox.template?.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container spacing={3} justifyContent="space-between" alignItems="flex-end">
          <Grid item xs={12} alignItems="center">
            <MysteryBoxPurchaseButton mysteryBox={mysteryBox} />
          </Grid>
        </Grid>
      </CardActions>
    </StyledTemplateItemCard>
  );
};
