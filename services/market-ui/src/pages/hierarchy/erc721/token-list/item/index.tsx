import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardHeader, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { RichTextDisplay } from "@gemunion/mui-rte";
import { StyledCardContentDescription, StyledCardMedia } from "@framework/styled";
import type { IToken } from "@framework/types";

import { OpenSeaSellButton } from "../../../../../components/buttons";
import { RarityBadge } from "../../../../../components/common/badge";

interface IErc721TokenListItemProps {
  token: IToken;
}

export const Erc721TokenListItem: FC<IErc721TokenListItemProps> = props => {
  const { token } = props;

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc721/tokens/${token.id}/view`}>
        <RarityBadge token={token} />
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
            <OpenSeaSellButton token={token} />
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};
