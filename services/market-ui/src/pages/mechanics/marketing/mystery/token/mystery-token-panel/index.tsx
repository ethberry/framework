import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { CardActions, CardContent } from "@mui/material";

import { formatItemHtmlList } from "@framework/exchange";
import type { IToken } from "@framework/types";
import { ModuleType } from "@framework/types";

import { MysteryWrapperUnpackButton } from "../../../../../../components/buttons";
import { StyledCard, StyledList, StyledToolbar, StyledTypography } from "./styled";

export interface IMysteryTokenPanelProps {
  token: IToken;
  onRefreshPage: () => Promise<void>;
}

export const MysteryTokenPanel: FC<IMysteryTokenPanelProps> = props => {
  const { token, onRefreshPage } = props;

  if (token.template?.contract?.contractModule !== ModuleType.MYSTERY) {
    return null;
  }

  return (
    <StyledCard>
      <CardContent>
        <StyledToolbar disableGutters>
          <StyledTypography gutterBottom variant="h5" component="p">
            <FormattedMessage id="pages.token.mystery" />
          </StyledTypography>
        </StyledToolbar>
        {/* @ts-ignore */}
        <StyledList component="ul">{formatItemHtmlList(token.template?.box?.item)}</StyledList>
      </CardContent>

      <CardActions>
        <MysteryWrapperUnpackButton token={token} onRefreshPage={onRefreshPage} />
      </CardActions>
    </StyledCard>
  );
};
