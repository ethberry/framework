import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { RichTextDisplay } from "@gemunion/mui-rte";
import type { ICraft } from "@framework/types";

import { CraftButton } from "../../../../../../components/buttons";
import { CraftIngredients } from "./menu";

interface ICraftItemProps {
  craft: ICraft;
}

export const CraftItem: FC<ICraftItemProps> = props => {
  const { craft } = props;
  // TODO use MUI native multi-image list
  // https://mui.com/material-ui/react-image-list/ or
  // https://mui.com/material-ui/react-masonry/
  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/recipes/craft/${craft.id}`}>
        <CardHeader
          action={<CraftIngredients craft={craft} />}
          title={craft.item?.components[0].template!.title}
          subheader={craft.item?.components.map(comp => comp.template?.title).join(" + ")}
        />
        <CardMedia sx={{ height: 200 }} image={craft.item?.components[0].template!.imageUrl} />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="div" sx={{ height: 80, overflow: "hidden" }}>
            <RichTextDisplay data={craft.item?.components[0].template!.description} />
          </Typography>
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
