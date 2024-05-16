import { FC } from "react";
import { useIntl } from "react-intl";
import { CardActions, CardContent } from "@mui/material";

import { formatItemHtmlList } from "@framework/exchange";
import type { IToken } from "@framework/types";
import { ModuleType } from "@framework/types";

import { MysteryWrapperUnpackButton } from "../../../../../../components/buttons";
import { StyledCard, StyledList } from "./styled";
import { StyledCardHeader } from "../../../../../hierarchy/shared/styledCardHeader";

export interface IMysteryTokenPanelProps {
  token: IToken;
  onRefreshPage: () => Promise<void>;
}

export const MysteryTokenPanel: FC<IMysteryTokenPanelProps> = props => {
  const { token, onRefreshPage } = props;
  const { formatMessage } = useIntl();

  if (token.template?.contract?.contractModule !== ModuleType.MYSTERY) {
    return null;
  }

  return (
    <StyledCard>
      <StyledCardHeader title={formatMessage({ id: "pages.token.mystery" })} />

      <CardContent>
        {/* @ts-ignore */}
        <StyledList component="ul">{formatItemHtmlList(token.template?.box?.item)}</StyledList>
      </CardContent>

      <CardActions>
        <MysteryWrapperUnpackButton token={token} onRefreshPage={onRefreshPage} />
      </CardActions>
    </StyledCard>
  );
};
