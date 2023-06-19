import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { IToken } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { TokenSellButton } from "../../../../../components/buttons";
import { formatEther } from "../../../../../utils/money";

interface IErc1155TokenListItemProps {
  token: IToken;
}

export const Erc1155TokenListItem: FC<IErc1155TokenListItemProps> = props => {
  const { token } = props;

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc1155/tokens/${token.id}`}>
        <CardHeader title={token.template!.title} />
        <CardMedia sx={{ height: 200 }} image={token.template!.imageUrl} />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="div" sx={{ height: 80, overflow: "hidden" }}>
            <RichTextDisplay data={token.template!.description} />
          </Typography>
          <Typography gutterBottom variant="h5" component="h2">
            Balance: {formatEther(token.balance![0].amount, token.template!.contract!.decimals, "")}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <TokenSellButton token={token} />
        </Grid>
      </CardActions>
    </Card>
  );
};
