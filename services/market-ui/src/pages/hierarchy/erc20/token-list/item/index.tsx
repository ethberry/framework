import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardHeader, Grid } from "@mui/material";

import { RichTextDisplay } from "@gemunion/mui-rte";
import { ListActionVariant, StyledCardContentDescription, StyledCardMedia } from "@framework/styled";
import type { IToken } from "@framework/types";

import { Erc20AddToMetamaskButton, Erc20TransferButton } from "../../../../../components/buttons";

interface IErc20TokenListItemProps {
  token: IToken;
}

export const Erc20TokenListItem: FC<IErc20TokenListItemProps> = props => {
  const { token } = props;

  return (
    <Card>
      <CardActionArea>
        <CardHeader title={token.template!.title} />
        <StyledCardMedia image={token.template!.imageUrl} />
        <CardContent>
          <StyledCardContentDescription>
            <RichTextDisplay data={token.template!.description} />
          </StyledCardContentDescription>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <Grid item xs={12}>
            <Erc20TransferButton token={token} variant={ListActionVariant.iconButton} />
            <Erc20AddToMetamaskButton token={token} />
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};
