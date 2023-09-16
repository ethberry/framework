import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Box, Card, CardActions, CardContent, Toolbar, Typography } from "@mui/material";

import type { ITemplate } from "@framework/types";

import { TemplatePurchaseButton } from "../../../../../components/buttons";
import { formatPrice } from "../../../../../utils/money";
import { AllowanceInfoPopover } from "../../../../../components/dialogs/allowance";

export interface ICommonTemplatePanelProps {
  template: ITemplate;
}

export const CommonTemplatePanel: FC<ICommonTemplatePanelProps> = props => {
  const { template } = props;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Toolbar disableGutters={true} sx={{ minHeight: "1em !important" }}>
          <Typography gutterBottom variant="h5" component="p" sx={{ flexGrow: 1 }}>
            <FormattedMessage id="pages.erc721.template.price" />
          </Typography>
          <AllowanceInfoPopover />
        </Toolbar>
        <Box component="ul" sx={{ pl: 0, m: 0, listStylePosition: "inside" }}>
          {formatPrice(template.price)
            .split(", ")
            .map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
        </Box>
      </CardContent>
      <CardActions>
        <TemplatePurchaseButton template={template} />
      </CardActions>
    </Card>
  );
};
