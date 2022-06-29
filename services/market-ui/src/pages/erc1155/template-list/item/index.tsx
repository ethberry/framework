import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { IUniTemplate } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { useStyles } from "./styles";
import { formatPrice } from "../../../../utils/money";
import { Erc1155TokenSingleBuyButton } from "../../../../components/buttons";

interface IErc1155TemplateItemProps {
  token: IUniTemplate;
}

export const Erc1155Template: FC<IErc1155TemplateItemProps> = props => {
  const { token } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc1155-tokens/${token.id}`}>
        <CardMedia className={classes.media} image={token.imageUrl} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {token.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={token.description} />
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {formatPrice(token.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <Erc1155TokenSingleBuyButton template={token} />
        </Grid>
      </CardActions>
    </Card>
  );
};
