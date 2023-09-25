import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardHeader, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { RichTextDisplay } from "@gemunion/mui-rte";
import { IToken } from "@framework/types";

import { TokenSellButton } from "../../../../components/buttons";
import { RarityBadge } from "../../../../components/common/badge";
import { StyledCardMedia, StyledDescription } from "./styled";

interface IMyTokenListItemProps {
  token: IToken;
}

export const MyTokenListItem: FC<IMyTokenListItemProps> = props => {
  const { token } = props;

  return (
    <Card>
      <CardActionArea
        component={RouterLink}
        to={`/${token.template?.contract?.contractType?.toLowerCase()}/tokens/${token.id}`}
      >
        <RarityBadge token={token} />
        <CardHeader title={token.template!.title} />
        <StyledCardMedia image={token.template!.imageUrl} />
        <CardContent>
          <StyledDescription>
            <RichTextDisplay data={token.template!.description} />
          </StyledDescription>
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
