import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";
import { Card, CardActions, CardContent, List, ListItem, ListItemText } from "@mui/material";

import type { ICraft } from "@framework/types";

import { AllowanceInfoPopover } from "../../../../../components/dialogs/allowance";
import { formatEther } from "../../../../../utils/money";
import { CraftButton } from "../../../../../components/buttons";
import { StyledTitle, StyledToolbar } from "./styled";

export interface ICraftItemPanelProps {
  craft: ICraft;
}

export const CraftItemPanel: FC<ICraftItemPanelProps> = props => {
  const { craft } = props;

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
          {craft.price?.components.map((component, i) => (
            <ListItem
              key={component.id || i}
              button
              component={RouterLink}
              to={`/${component.tokenType.toLowerCase()}/templates/${component.templateId!}`}
            >
              <ListItemText>
                {component.template!.title}{" "}
                {`(${formatEther(component.amount, component.contract!.decimals, component.contract!.symbol)}`})
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </CardContent>
      <CardActions>
        <CraftButton craft={craft} />
      </CardActions>
    </Card>
  );
};
