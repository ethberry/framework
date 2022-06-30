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
import { IExchangeRule } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { useStyles } from "./styles";
import { ExchangeButton } from "../../../../components/buttons";

interface IRecipeItemProps {
  rule: IExchangeRule;
}

export const ExchangeItem: FC<IRecipeItemProps> = props => {
  const { rule } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc721-tokens/${rule.item.components[0].uniToken!.id}`}>
        <CardMedia className={classes.media} image={rule.item.components[0].uniToken!.uniTemplate!.imageUrl} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {rule.item.components[0].uniToken!.uniTemplate!.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={rule.item.components[0].uniToken!.uniTemplate!.description} />
          </Typography>
          <List>
            {rule.ingredients.components.map(component => (
              <ListItem
                key={component.id}
                button
                component={RouterLink}
                to={`/erc1155-tokens/${component.uniToken!.id}`}
              >
                <ListItemText>
                  {component.uniToken!.uniTemplate!.title} ({component.amount})
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <ExchangeButton rule={rule} />
        </Grid>
      </CardActions>
    </Card>
  );
};
