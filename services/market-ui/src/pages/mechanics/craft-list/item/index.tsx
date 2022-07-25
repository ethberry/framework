import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { RichTextDisplay } from "@gemunion/mui-rte";
import { ICraft } from "@framework/types";

import { useStyles } from "./styles";
import { CraftIngredients } from "./menu";
import { CraftButton } from "../../../../components/buttons";

interface ICraftItemProps {
  craft: ICraft;
}

export const CraftItem: FC<ICraftItemProps> = props => {
  const { craft } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/craft/${craft.id}`}>
        <CardHeader action={<CraftIngredients craft={craft} />} title={craft.item.components[0].template!.title} />
        <CardMedia className={classes.media} image={craft.item.components[0].template!.imageUrl} />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={craft.item.components[0].template!.description} />
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
