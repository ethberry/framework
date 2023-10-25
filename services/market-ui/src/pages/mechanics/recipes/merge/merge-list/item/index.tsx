import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardHeader, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { RichTextDisplay } from "@gemunion/mui-rte";
import { StyledCardContentDescription, StyledCardMedia } from "@framework/styled";
import type { IMerge } from "@framework/types";

import { MergeButton } from "../../../../../../components/buttons";
import { MergeIngredients } from "./menu";

interface IMergeItemProps {
  merge: IMerge;
}

export const MergeItem: FC<IMergeItemProps> = props => {
  const { merge } = props;
  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/recipes/merge/${merge.id}`}>
        <CardHeader
          action={<MergeIngredients merge={merge} />}
          title={merge.item?.components[0].template!.title}
          subheader={merge.item?.components.map(comp => comp.template?.title).join(" + ")}
        />
        <StyledCardMedia image={merge.item?.components[0].template!.imageUrl} />
        <CardContent>
          <StyledCardContentDescription>
            <RichTextDisplay data={merge.item?.components[0].template!.description} />
          </StyledCardContentDescription>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <MergeButton merge={merge} />
        </Grid>
      </CardActions>
    </Card>
  );
};
