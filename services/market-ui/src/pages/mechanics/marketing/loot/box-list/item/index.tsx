import { FC } from "react";
import { CardActionArea, CardActions, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { formatItem } from "@framework/exchange";
import { StyledCardContentDescription, StyledCardMedia, StyledTemplateItemCard } from "@framework/styled";
import type { ILootBox } from "@framework/types";
import { RichTextDisplay } from "@ethberry/mui-rte";

import { LootBoxPurchaseButton } from "../../../../../../components/buttons";

interface ILootBoxListItemProps {
  lootBox: ILootBox;
}

export const LootBoxListItem: FC<ILootBoxListItemProps> = props => {
  const { lootBox } = props;

  return (
    <StyledTemplateItemCard>
      <CardActionArea component={RouterLink} to={`/loot/boxes/${lootBox.id}`}>
        <CardHeader title={lootBox.title} />
        <StyledCardMedia image={lootBox.imageUrl} />
        <CardContent>
          <StyledCardContentDescription>
            <RichTextDisplay data={lootBox.description} />
          </StyledCardContentDescription>
          <Typography variant="body2" color="textSecondary" component="p">
            {formatItem(lootBox.template?.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container spacing={3} justifyContent="space-between" alignItems="flex-end">
          <Grid item xs={12} alignItems="center">
            <LootBoxPurchaseButton lootBox={lootBox} />
          </Grid>
        </Grid>
      </CardActions>
    </StyledTemplateItemCard>
  );
};
