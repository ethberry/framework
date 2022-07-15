import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { RichTextDisplay } from "@gemunion/mui-rte";
import { IToken } from "@framework/types";

import { useStyles } from "./styles";
import { LevelUpButton, TokenSellButton } from "../../../../components/buttons";
import { RarityBadge } from "./badge";

interface IErc721TokenProps {
  token: IToken;
}

export const Erc721Token: FC<IErc721TokenProps> = props => {
  const { token } = props;

  const classes = useStyles(token);

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc721-tokens/${token.id}`}>
        <RarityBadge token={token} />
        <CardMedia className={classes.media} image={token.template!.imageUrl} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {token.template!.title} #{token.tokenId}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={token.template!.description} />
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <Grid item xs={12}>
            <TokenSellButton token={token} />
            <LevelUpButton token={token} />
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};
