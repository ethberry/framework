import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardHeader, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { RichTextDisplay } from "@ethberry/mui-rte";
import { StyledCardContentDescription, StyledCardMedia } from "@framework/styled";
import type { IToken } from "@framework/types";

import { OpenSeaSellButton, WrapperBoxUnpackButton } from "../../../../../../components/buttons";
import { RarityBadge } from "../../../../../../components/common/badge";
import { formatTokenTitle } from "../../../../../../utils/token";

interface IWrapperTokenListItemProps {
  token: IToken;
}

export const WrapperTokenListItem: FC<IWrapperTokenListItemProps> = props => {
  const { token } = props;

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/wrapper/tokens/${token.id}`}>
        <RarityBadge token={token} />
        <CardHeader title={formatTokenTitle(token)} />
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
          <Grid item xs={12}>
            <WrapperBoxUnpackButton token={token} />
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};
