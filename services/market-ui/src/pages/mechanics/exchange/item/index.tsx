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
import { IExchange } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { useStyles } from "./styles";
import { ExchangeButton } from "../../../../components/buttons";

interface IRecipeItemProps {
  exchange: IExchange;
}

export const ExchangeItem: FC<IRecipeItemProps> = props => {
  const { exchange } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc721-tokens/${exchange.item.components[0].uniToken!.id}`}>
        <CardMedia className={classes.media} image={exchange.item.components[0].uniToken!.uniTemplate!.imageUrl} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {exchange.item.components[0].uniToken!.uniTemplate!.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={exchange.item.components[0].uniToken!.uniTemplate!.description} />
          </Typography>
          <List>
            {exchange.ingredients.components.map(component => (
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
          <ExchangeButton rule={exchange} />
        </Grid>
      </CardActions>
    </Card>
  );
};
