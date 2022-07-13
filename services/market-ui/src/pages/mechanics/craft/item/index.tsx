import { FC } from "react";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { IRecipe } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { useStyles } from "./styles";
import { CraftButton } from "../../../../components/buttons";

interface IRecipeItemProps {
  recipe: IRecipe;
}

export const Recipe: FC<IRecipeItemProps> = props => {
  const { recipe } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc721-tokens/${recipe.item.components[0].token!.id}`}>
        <CardMedia className={classes.media} image={recipe.item.components[0].token!.template!.imageUrl} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {recipe.item.components[0].token!.template!.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={recipe.item.components[0].token!.template!.description} />
          </Typography>
          <List>
            {recipe.ingredients.components.map(component => (
              <ListItem key={component.id} button component={RouterLink} to={`/erc1155-tokens/${component.token!.id}`}>
                <ListItemText>
                  {component.token!.template!.title} ({component.amount})
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <CraftButton rule={recipe} />
        </Grid>
      </CardActions>
    </Card>
  );
};
