import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, ListItemText, Menu, MenuItem } from "@mui/material";
import { Help } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

import { ICraft } from "@framework/types";

interface ICraftIngredientsProps {
  craft: ICraft;
}

export const CraftIngredients: FC<ICraftIngredientsProps> = props => {
  const { craft } = props;

  const [anchor, setAnchor] = useState<Element | null>(null);

  const handleMenuOpen = (event: MouseEvent): boolean => {
    event.preventDefault();
    event.stopPropagation();
    setAnchor(event.currentTarget);
    return false;
  };

  const handleMenuClose = (): void => {
    setAnchor(null);
  };

  return (
    <Fragment>
      <IconButton
        aria-owns={anchor ? "material-appbar" : undefined}
        aria-haspopup="true"
        data-testid="CraftIngredients"
        onClick={handleMenuOpen}
        color="inherit"
      >
        <Help />
      </IconButton>
      <Menu id="material-appbar" anchorEl={anchor} open={!!anchor} onClose={handleMenuClose}>
        {craft.ingredients.components.map(component => (
          <MenuItem key={component.id} component={RouterLink} to={`/erc1155-tokens/${component.template!.id}`}>
            <ListItemText>
              {component.template!.title} ({component.amount})
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  );
};
