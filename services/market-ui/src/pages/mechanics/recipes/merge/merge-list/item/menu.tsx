import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, ListItemText, Menu, MenuItem } from "@mui/material";
import { Construction } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

import type { IMerge } from "@framework/types";

interface IMergeIngredientsProps {
  merge: IMerge;
}

export const MergeIngredients: FC<IMergeIngredientsProps> = props => {
  const { merge } = props;

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
        aria-owns={anchor ? "merge-ingredients" : undefined}
        aria-haspopup="true"
        data-testid="MergeIngredients"
        onClick={handleMenuOpen}
        color="inherit"
      >
        <Construction />
      </IconButton>
      <Menu id="merge-ingredients" anchorEl={anchor} open={!!anchor} onClose={handleMenuClose}>
        {merge.price?.components.map(component => (
          <MenuItem
            key={component.id}
            component={RouterLink}
            to={`/${component.contract?.contractType?.toLowerCase()}/templates/${component.template?.id}`}
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
