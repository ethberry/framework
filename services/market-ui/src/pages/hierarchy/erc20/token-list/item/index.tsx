import { FC } from "react";
import { Box, Card, CardActionArea, CardActions, CardContent, CardHeader, Grid } from "@mui/material";
import { FormattedMessage } from "react-intl";

import type { IToken } from "@framework/types";
import { StyledCardContentDescription, StyledCardMedia } from "@framework/styled";
import { RichTextDisplay } from "@ethberry/mui-rte";

import { Erc20AddToMetamaskButton } from "../../../../../components/buttons";
import { InfoPopover } from "../../../../../components/popover";
import { StyledWrapper } from "./styled";

interface IErc20TokenListItemProps {
  token: IToken;
}

export const Erc20CoinsListItem: FC<IErc20TokenListItemProps> = props => {
  const { token } = props;

  return (
    <Card>
      <CardActionArea>
        <CardHeader
          action={
            <InfoPopover>
              <StyledWrapper>
                <Box>
                  <b>
                    <FormattedMessage id="pages.erc20.token.contract" />:{" "}
                  </b>
                  {token.template!.contract?.address}
                </Box>
                <Box>
                  <b>
                    <FormattedMessage id="pages.erc20.token.decimals" />:{" "}
                  </b>
                  {token.template!.contract?.decimals}
                </Box>
                <Box>
                  <b>
                    <FormattedMessage id="pages.erc20.token.symbol" />:{" "}
                  </b>
                  {token.template!.contract?.symbol}
                </Box>
              </StyledWrapper>
            </InfoPopover>
          }
          title={token.template!.title}
        />
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
            <Erc20AddToMetamaskButton token={token} />
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};
