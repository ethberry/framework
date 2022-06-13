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
import { IErc721Recipe } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { useStyles } from "./styles";
import { Erc721RecipeCraftButton } from "../../../../components/buttons";

interface IRecipeItemProps {
  recipe: IErc721Recipe;
}

export const Erc721RecipeItem: FC<IRecipeItemProps> = props => {
  const { recipe } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc721-tokens/${recipe.erc721Template!.id}`}>
        <CardMedia className={classes.media} image={recipe.erc721Template?.imageUrl} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {recipe.erc721Template!.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={recipe.erc721Template!.description} />
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
          <Erc721RecipeCraftButton recipe={recipe} />
        </Grid>
      </CardActions>
    </Card>
  );
};
