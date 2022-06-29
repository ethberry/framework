import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { IUniToken } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { useStyles } from "./styles";
import { Erc1155TokenSellButton } from "../../../../../components/buttons";

interface IErc1155TokenProps {
  token: IUniToken;
  balance?: string;
}

export const Erc1155Token: FC<IErc1155TokenProps> = props => {
  const { token, balance } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc721-assets/${token.id}`}>
        <CardMedia className={classes.media} image={token.uniTemplate!.imageUrl} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {token.uniTemplate!.title}
          </Typography>
          <Typography gutterBottom variant="h5" component="h2">
            Balance: {balance}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={token.uniTemplate!.description} />
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <Erc1155TokenSellButton token={token} />
        </Grid>
      </CardActions>
    </Card>
  );
};
