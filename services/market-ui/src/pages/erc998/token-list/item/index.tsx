import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { RichTextDisplay } from "@gemunion/mui-rte";
import { IUniToken } from "@framework/types";

import { useStyles } from "./styles";
import { LevelUpButton, Erc998TokenSellButton } from "../../../../components/buttons";
import { RarityBadge } from "./badge";

interface IUniTokenProps {
  token: IUniToken;
}

export const Erc998Token: FC<IUniTokenProps> = props => {
  const { token } = props;

  const classes = useStyles(token);

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc998-tokens/${token.id}`}>
        <RarityBadge token={token} />
        <CardMedia className={classes.media} image={token.uniTemplate!.imageUrl} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {token.uniTemplate!.title} #{token.tokenId}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={token.uniTemplate!.description} />
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <Grid item xs={12}>
            <Erc998TokenSellButton token={token} />
            <LevelUpButton token={token} />
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};
