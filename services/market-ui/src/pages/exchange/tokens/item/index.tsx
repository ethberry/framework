import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardHeader, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { RichTextDisplay } from "@gemunion/mui-rte";
import { StyledCardContentDescription, StyledCardMedia } from "@framework/styled";
import { IToken, ModuleType } from "@framework/types";

import { TokenSellButton } from "../../../../components/buttons";
import { RarityBadge } from "../../../../components/common/badge";

interface IMyTokenListItemProps {
  token: IToken;
}

export const MyTokenListItem: FC<IMyTokenListItemProps> = props => {
  const { token } = props;

  const navigateTo =
    token.template?.contract?.contractModule === ModuleType.LOTTERY ||
    token.template?.contract?.contractModule === ModuleType.RAFFLE
      ? `/${token.template?.contract?.contractModule?.toLowerCase()}/tokens/${token.id}`
      : `/${token.template?.contract?.contractType?.toLowerCase()}/tokens/${token.id}`;

  return (
    <Card>
      <CardActionArea component={RouterLink} to={navigateTo}>
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
            <TokenSellButton token={token} />
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};
