import React, { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";
import { Card, CardActions, CardContent, List, ListItemButton, ListItemText } from "@mui/material";

import { formatItem } from "@framework/exchange";
import type { IMerge } from "@framework/types";

import { AllowanceInfoPopover } from "../../../../../../components/dialogs/allowance";
import { MergeButton } from "../../../../../../components/buttons";
import { StyledTitle, StyledToolbar } from "./styled";

export interface IMergeItemPanelProps {
  merge: IMerge;
}

export const MergeItemPanel: FC<IMergeItemPanelProps> = props => {
  const { merge } = props;

  return (
    <Card>
      <CardContent>
        <StyledToolbar disableGutters>
          <StyledTitle gutterBottom variant="h5" component="p">
            <FormattedMessage id="pages.recipes.ingredients" />
          </StyledTitle>
          <AllowanceInfoPopover />
        </StyledToolbar>
        <List>
          {merge.price?.components.map((component, i) => (
            <ListItemButton
              key={component.id || i}
              component={RouterLink}
              to={`/${component.tokenType.toLowerCase()}/templates/${component.templateId}`}
            >
              <ListItemText>{formatItem({ id: i, components: [component] })}</ListItemText>
            </ListItemButton>
          ))}
        </List>
      </CardContent>
      <CardActions>
        <MergeButton merge={merge} />
      </CardActions>
    </Card>
  );
};
