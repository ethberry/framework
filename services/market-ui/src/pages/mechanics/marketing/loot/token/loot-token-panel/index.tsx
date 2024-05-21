import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { CardActions, CardContent } from "@mui/material";

import { formatItemHtmlList } from "@framework/exchange";
import type { IToken } from "@framework/types";
import { ModuleType } from "@framework/types";

import { LootWrapperUnpackButton } from "../../../../../../components/buttons";
import { StyledCard, StyledList, StyledToolbar, StyledTypography } from "./styled";

export interface ILootTokenPanelProps {
  token: IToken;
  onRefreshPage: () => Promise<void>;
}

export const LootTokenPanel: FC<ILootTokenPanelProps> = props => {
  const { token, onRefreshPage } = props;

  if (token.template?.contract?.contractModule !== ModuleType.LOOT) {
    return null;
  }

  return (
    <StyledCard>
      <CardContent>
        <StyledToolbar disableGutters>
          <StyledTypography gutterBottom variant="h5" component="p">
            <FormattedMessage id="pages.token.loot" />
          </StyledTypography>
        </StyledToolbar>
        {/* @ts-ignore */}
        <StyledList component="ul">{formatItemHtmlList(token.template?.box?.item)}</StyledList>
      </CardContent>

      <CardActions>
        <LootWrapperUnpackButton token={token} onRefreshPage={onRefreshPage} />
      </CardActions>
    </StyledCard>
  );
};
