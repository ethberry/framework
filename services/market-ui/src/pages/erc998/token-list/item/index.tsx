import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { RichTextDisplay } from "@gemunion/mui-rte";
import { IErc998Token } from "@framework/types";

import { useStyles } from "./styles";
import { Erc998TokenAuctionButton } from "../../../../components/buttons";
import { RarityBadge } from "./badge";

interface IErc998TokenProps {
  token: IErc998Token;
}

export const Erc998Token: FC<IErc998TokenProps> = props => {
  const { token } = props;

  const classes = useStyles(token);

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc998-tokens/${token.id}`}>
        <RarityBadge token={token} />
        <CardMedia className={classes.media} image={token.erc998Template!.imageUrl} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {token.erc998Template!.title} #{token.tokenId}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={token.erc998Template!.description} />
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <Grid item xs={12}>
            <Erc998TokenAuctionButton token={token} />
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};
