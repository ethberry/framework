import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Construction } from "@mui/icons-material";

import { useCollection } from "@gemunion/react-hooks";
import type { IDismantle, IDismantleSearchDto, IToken } from "@framework/types";

import { StyledPaper } from "../../../hierarchy/erc721/token/styled";
import { formatItem } from "../../../../utils/money";

export interface IDismantlePanelProps {
  token: IToken;
}

export const DismantlePanel: FC<IDismantlePanelProps> = props => {
  const { token } = props;

  const { rows, isLoading } = useCollection<IDismantle, IDismantleSearchDto>({
    baseUrl: "/dismantle",
    embedded: true,
    search: {
      templateId: token.templateId,
    },
  });

  const handleDismantle = (_dismantle: IDismantle) => {
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
        <FormattedMessage id="pages.erc721.token.dismantle" />
      </Typography>

      <List>
        {rows.map(dismantle => {
          return (
            <ListItemButton key={dismantle.id} onClick={handleDismantle(dismantle)}>
              <ListItemIcon>
                <Construction />
              </ListItemIcon>
              <ListItemText>{formatItem(dismantle.price)}</ListItemText>
            </ListItemButton>
          );
        })}
      </List>
    </StyledPaper>
  );
};
