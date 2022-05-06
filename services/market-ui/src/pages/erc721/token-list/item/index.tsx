import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { RichTextDisplay } from "@gemunion/mui-rte";
import { IErc721Token } from "@framework/types";

import { useStyles } from "./styles";
import { Erc721TokenSellButton } from "../../../../components/buttons";

interface IErc721TokenProps {
  token: IErc721Token;
}

export const Erc721Token: FC<IErc721TokenProps> = props => {
  const { token } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc721-tokens/${token.id}`}>
        <CardMedia className={classes.media} image={token.erc721Template!.imageUrl} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {token.erc721Template!.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={token.erc721Template!.description} />
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <Grid item xs={12}>
            <Erc721TokenSellButton token={token} />
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};
