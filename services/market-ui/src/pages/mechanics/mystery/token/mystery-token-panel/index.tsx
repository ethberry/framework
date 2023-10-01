import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { CardActions, CardContent } from "@mui/material";

import type { IToken } from "@framework/types";
import { ModuleType } from "@framework/types";

import { MysteryWrapperUnpackButton } from "../../../../../components/buttons";
import { formatItem } from "../../../../../utils/money";
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
        <StyledList component="ul">
          {/* @ts-ignore */}
          {formatItem(token.template?.box?.item)
            .split(", ")
            .map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
        </StyledList>
      </CardContent>
      <CardActions>
        <MysteryWrapperUnpackButton token={token} onRefreshPage={onRefreshPage} />
      </CardActions>
    </StyledCard>
  );
};
