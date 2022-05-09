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
import { IErc1155Recipe } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { useStyles } from "./styles";
import { Erc1155RecipeCraftButton } from "../../../../components/buttons";

interface IRecipeItemProps {
  recipe: IErc1155Recipe;
}

export const Erc1155RecipeItem: FC<IRecipeItemProps> = props => {
  const { recipe } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc1155-tokens/${recipe.erc1155Token!.id}`}>
        <CardMedia className={classes.media} image={recipe.erc1155Token?.imageUrl} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {recipe.erc1155Token!.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={recipe.erc1155Token!.description} />
          </Typography>
          <List>
            {(recipe.ingredients || []).map(ingredient => (
              <ListItem
                key={ingredient.erc1155Token.id}
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
          <Erc1155RecipeCraftButton recipe={recipe} />
        </Grid>
      </CardActions>
    </Card>
  );
};
