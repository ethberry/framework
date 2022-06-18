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
import { IErc998Recipe } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { useStyles } from "./styles";
import { Erc998RecipeCraftButton } from "../../../../components/buttons";

interface IRecipeItemProps {
  recipe: IErc998Recipe;
}

export const Erc998RecipeItem: FC<IRecipeItemProps> = props => {
  const { recipe } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc998-tokens/${recipe.erc998Template!.id}`}>
        <CardMedia className={classes.media} image={recipe.erc998Template?.imageUrl} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {recipe.erc998Template!.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={recipe.erc998Template!.description} />
          </Typography>
          <List>
            {(recipe.ingredients || []).map(ingredient => (
              <ListItem
                key={ingredient.id}
                button
                component={RouterLink}
                to={`/erc1155-tokens/${ingredient.erc1155Token.id}`}
              >
                <ListItemText>
                  {ingredient.erc1155Token.title} ({ingredient.amount})
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <Erc998RecipeCraftButton recipe={recipe} />
        </Grid>
      </CardActions>
    </Card>
  );
};
