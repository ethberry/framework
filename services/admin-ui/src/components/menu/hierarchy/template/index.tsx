import { FC, Fragment, MouseEvent, useState } from "react";
import { FormattedMessage } from "react-intl";

import { IconButton, Menu, Typography } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import { ContractFeatures, ITemplate, ModuleType, TokenType } from "@framework/types";

import { MintMenuItem } from "./mint";

export enum TemplateActions {}

export interface ITemplateActionsMenu {
  template: ITemplate;
  disabled?: boolean;
  actions?: Array<TemplateActions | null>;
}

export const TemplateActionsMenu: FC<ITemplateActionsMenu> = props => {
  const { template, disabled } = props;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <IconButton
        aria-label="more"
        id="template-menu-button"
        aria-controls={open ? "template-actions-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disabled={disabled}
        data-testid="TemplateActionsMenuButton"
      >
        <MoreVert />
      </IconButton>
      <Menu id="template-actions-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        {template.contract!.contractType !== TokenType.NATIVE &&
        template.contract!.contractModule === ModuleType.HIERARCHY &&
        !template.contract!.contractFeatures.includes(ContractFeatures.RANDOM) &&
        !template.contract!.contractFeatures.includes(ContractFeatures.GENES) ? (
          <MintMenuItem template={template} />
        ) : (
          <Typography variant="inherit" sx={{ mr: 1, ml: 1 }}>
            <FormattedMessage id="dialogs.unsupported" />
          </Typography>
        )}
      </Menu>
    </Fragment>
  );
};
