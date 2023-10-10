import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { CardActions, CardContent } from "@mui/material";

import type { ITemplate } from "@framework/types";

import { TemplatePurchaseButton } from "../../../../../components/buttons";
import { formatItem } from "../../../../../utils/money";
import { AllowanceInfoPopover } from "../../../../../components/dialogs/allowance";
import { StyledCard, StyledList, StyledToolbar, StyledTypography } from "./styled";

export interface ICommonTemplatePanelProps {
  template: ITemplate;
}

export const Erc721TemplatePanel: FC<ICommonTemplatePanelProps> = props => {
  const { template } = props;

  return (
    <StyledCard>
      <CardContent>
        <StyledToolbar disableGutters>
          <StyledTypography gutterBottom variant="h5" component="p">
            <FormattedMessage id="pages.erc721.template.price" />
          </StyledTypography>
          <AllowanceInfoPopover />
        </StyledToolbar>
        <StyledList component="ul">
          {formatItem(template.price)
            .split(", ")
            .map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
        </StyledList>
      </CardContent>
      <CardActions>
        <TemplatePurchaseButton template={template} />
      </CardActions>
    </StyledCard>
  );
};
