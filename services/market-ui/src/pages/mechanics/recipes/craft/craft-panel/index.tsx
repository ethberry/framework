import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Construction } from "@mui/icons-material";

import { useCollection } from "@gemunion/react-hooks";
import type { ICraft, ICraftSearchDto, ITemplate } from "@framework/types";

import { StyledPaper } from "../../../../hierarchy/erc721/token/styled";
import { formatItem } from "../../../../../utils/money";

export interface ICraftPanelProps {
  template: ITemplate;
}

export const CraftPanel: FC<ICraftPanelProps> = props => {
  const { template } = props;

  const { rows, isLoading } = useCollection<ICraft, ICraftSearchDto>({
    baseUrl: "/craft",
    embedded: true,
    search: {
      templateId: template.id,
    },
  });

  const handleCraft = (_craft: ICraft) => {
    return () => {
      alert("Not implemented");
    };
  };

  if (isLoading) {
    return null;
  }

  if (!rows.length) {
    return null;
  }

  return (
    <StyledPaper>
      <Typography>
        <FormattedMessage id="pages.erc721.token.craft" />
      </Typography>

      <List>
        {rows.map(craft => {
          return (
            <ListItemButton key={craft.id} onClick={handleCraft(craft)}>
              <ListItemIcon>
                <Construction />
              </ListItemIcon>
              <ListItemText>{formatItem(craft.price)}</ListItemText>
            </ListItemButton>
          );
        })}
      </List>
    </StyledPaper>
  );
};
