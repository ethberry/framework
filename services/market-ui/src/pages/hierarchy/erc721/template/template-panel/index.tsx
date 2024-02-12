import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { CardActions, CardContent } from "@mui/material";

import { formatItemHtmlList } from "@framework/exchange";
import type { ITemplate } from "@framework/types";

import { TemplatePurchaseButton } from "../../../../../components/buttons";
import { AllowanceInfoPopover } from "../../../../../components/dialogs/allowance";
import { StyledCard, StyledList, StyledToolbar, StyledTypography } from "./styled";
import { AllowanceButton } from "../../../../exchange/wallet/allowance";

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
        <StyledList component="ul">{formatItemHtmlList(template.price)}</StyledList>
      </CardContent>
      <CardActions>
        <TemplatePurchaseButton template={template} />
        <AllowanceButton token={template.price} isSmall isExchange />
      </CardActions>
    </StyledCard>
  );
};
