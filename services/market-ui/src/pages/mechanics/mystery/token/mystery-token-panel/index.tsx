import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Box, Card, CardActions, CardContent, Toolbar, Typography } from "@mui/material";

import type { IToken } from "@framework/types";
import { ModuleType } from "@framework/types";

import { MysteryWrapperUnpackButton } from "../../../../../components/buttons";
import { formatItem } from "../../../../../utils/money";

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
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Toolbar disableGutters sx={{ minHeight: "1em !important" }}>
          <Typography gutterBottom variant="h5" component="p" sx={{ flexGrow: 1 }}>
            <FormattedMessage id="pages.token.mystery" />
          </Typography>
        </Toolbar>
        <Box component="ul" sx={{ pl: 0, m: 0, listStylePosition: "inside" }}>
          {/* @ts-ignore */}
          {formatItem(token.template?.box?.item)
            .split(", ")
            .map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
        </Box>
      </CardContent>
      <CardActions>
        <MysteryWrapperUnpackButton token={token} onRefreshPage={onRefreshPage} />
      </CardActions>
    </Card>
  );
};
