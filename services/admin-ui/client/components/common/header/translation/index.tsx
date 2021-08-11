import React, {FC, Fragment, MouseEvent, useContext, useState} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {IconButton, Menu, MenuItem, Tooltip} from "@material-ui/core";
import {Translate} from "@material-ui/icons";

import {ISettingsContext, SettingsContext} from "@gemunionstudio/provider-settings";
import {EnabledLanguages} from "@gemunionstudio/solo-constants-misc";

export const Translation: FC = () => {
  const {formatMessage} = useIntl();
  const settings = useContext<ISettingsContext<EnabledLanguages>>(SettingsContext);
  const [anchor, setAnchor] = useState<Element | null>(null);

  const handleLanguageIconClick = (e: MouseEvent): void => {
    setAnchor(e.currentTarget);
  };

  const handleLanguageMenuClose = (): void => {
    setAnchor(null);
  };

  const handleLanguageMenuItemClick = (language: EnabledLanguages) => (): void => {
    settings.setLanguage(language);
    document.documentElement.setAttribute("lang", language);
    handleLanguageMenuClose();
  };

  return (
    <Fragment>
      <Tooltip title={formatMessage({id: "components.header.language.switch"})} enterDelay={300}>
        <IconButton
          color="inherit"
          aria-owns={anchor ? "language-menu" : undefined}
          aria-haspopup="true"
          onClick={handleLanguageIconClick}
        >
          <Translate />
        </IconButton>
      </Tooltip>
      <Menu id="language-menu" anchorEl={anchor} open={!!anchor} onClose={handleLanguageMenuClose}>
        {Object.values(EnabledLanguages).map(language => (
          <MenuItem
            key={language}
            selected={settings.getLanguage() === language}
            onClick={handleLanguageMenuItemClick(language)}
          >
            <FormattedMessage id={`enums.language.${language}`} />
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  );
};
