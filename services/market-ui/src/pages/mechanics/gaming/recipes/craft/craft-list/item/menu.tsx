import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, ListItemText, Menu, MenuItem } from "@mui/material";
import { Construction } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

import type { ICraft } from "@framework/types";

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

  const handleMenuClose = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    setAnchor(null);
  };

  return (
    <Fragment>
      <IconButton
        aria-owns={anchor ? "craft-ingredients" : undefined}
        aria-haspopup="true"
        data-testid="CraftIngredients"
        onClick={handleMenuOpen}
        color="inherit"
      >
        <Construction />
      </IconButton>
      <Menu id="craft-ingredients" anchorEl={anchor} open={!!anchor} onClose={handleMenuClose}>
        {craft.price?.components.map(component => (
          <MenuItem
            key={component.id}
            component={RouterLink}
            to={`/${component.template?.contract?.contractType?.toLowerCase()}/templates/${component.template?.id}/view`}
          >
            <ListItemText>
              {component.template!.title} {`${BigInt(component.amount) > 1 ? `(${component.amount})` : ""}`}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  );
};
