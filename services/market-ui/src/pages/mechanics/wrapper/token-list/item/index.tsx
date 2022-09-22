import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { RichTextDisplay } from "@gemunion/mui-rte";
import { IToken } from "@framework/types";

import { useStyles } from "./styles";
import { TokenSellButton, WrapperUnpackButton } from "../../../../../components/buttons";
import { RarityBadge } from "../../../../../components/common/badge";

interface IWrapperTokenListItemProps {
  token: IToken;
}

export const WrapperTokenListItem: FC<IWrapperTokenListItemProps> = props => {
  const { token } = props;

  const classes = useStyles(token);

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/wrapper-tokens/${token.id}`}>
        <RarityBadge token={token} />
        <CardHeader title={`${token.template!.title} #${token.tokenId}`} />
        <CardMedia className={classes.media} image={token.template!.imageUrl} />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={token.template!.description} />
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <Grid item xs={12}>
            <TokenSellButton token={token} />
            <WrapperUnpackButton token={token} />
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};
