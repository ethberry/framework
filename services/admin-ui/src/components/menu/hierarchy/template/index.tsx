import { FC, Fragment, MouseEvent, useEffect, useState } from "react";

import { IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import { ITemplate, IUser } from "@framework/types";
import { useUser } from "@gemunion/provider-user";

import { useCheckAccessMint } from "../../../../utils/use-check-access-mint";
import { MintMenuItem } from "./mint";

export interface ITemplateActionsMenu {
  template: ITemplate;
  disabled?: boolean;
}

export const TemplateActionsMenu: FC<ITemplateActionsMenu> = props => {
  const { template, disabled } = props;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { checkAccessMint } = useCheckAccessMint();
  const user = useUser<IUser>();
  const [hasAccess, setHasAccess] = useState(false);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (!disabled && user?.profile?.wallet) {
      void checkAccessMint(void 0, {
        account: user.profile.wallet,
        address: template.contract!.address,
      })
        .then((json: { hasRole: boolean }) => {
          setHasAccess(json?.hasRole);
        })
        .catch(console.error);
    }
  }, [user?.profile?.wallet, disabled]);

  return (
    <Fragment>
      <IconButton
        aria-label="more"
        id="template-menu-button"
        aria-controls={open ? "template-actions-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disabled={disabled || !hasAccess}
        data-testid="TemplateActionsMenuButton"
      >
        <MoreVert />
      </IconButton>
      <Menu id="template-actions-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MintMenuItem template={template} />
      </Menu>
    </Fragment>
  );
};
