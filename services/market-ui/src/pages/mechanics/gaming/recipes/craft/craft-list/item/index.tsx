import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardHeader, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { RichTextDisplay } from "@ethberry/mui-rte";
import { StyledCardContentDescription, StyledCardMedia } from "@framework/styled";
import type { ICraft } from "@framework/types";

import { CraftButton } from "../../../../../../../components/buttons";
import { CraftIngredients } from "./menu";

interface ICraftItemProps {
  craft: ICraft;
}

export const CraftItem: FC<ICraftItemProps> = props => {
  const { craft } = props;
  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/recipes/craft/${craft.id}`}>
        <CardHeader
          action={<CraftIngredients craft={craft} />}
          title={craft.item?.components[0].template!.title}
          subheader={craft.item?.components.map(comp => comp.template?.title).join(" + ")}
        />
        <StyledCardMedia image={craft.item?.components[0].template!.imageUrl} />
        <CardContent>
          <StyledCardContentDescription>
            <RichTextDisplay data={craft.item?.components[0].template!.description} />
          </StyledCardContentDescription>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <CraftButton craft={craft} />
        </Grid>
      </CardActions>
    </Card>
  );
};
