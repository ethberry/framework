import { FC, useEffect, useState } from "react";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";
import { FormattedMessage } from "react-intl";
import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";

import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { useApiCall } from "@gemunion/react-hooks";
import type { IAccessList } from "@framework/types";

import UnBlacklistAbi from "./unBlacklist.abi.json";

export interface IBlacklistRemoveDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  data: { address: string };
}

export const AccessListUnBlacklistDialog: FC<IBlacklistRemoveDialogProps> = props => {
  const { data, ...rest } = props;

  const [rows, setRows] = useState<Array<IAccessList>>([]);

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: `/access-list/${data.address}`,
      });
    },
    { success: false },
  );

  const metaUnBlacklist = useMetamask((values: IAccessList, web3Context: Web3ContextType) => {
    const contract = new Contract(data.address, UnBlacklistAbi, web3Context.provider?.getSigner());
    return contract.unBlacklist(values.account) as Promise<void>;
  });

  const handleUnBlacklist = (values: IAccessList): (() => Promise<void>) => {
    return async () => {
      return metaUnBlacklist(values);
    };
  };

  useEffect(() => {
    void fn().then((rows: Array<IAccessList>) => {
      setRows(rows);
    });
  }, []);

  return (
    <ConfirmationDialog message="dialogs.unBlacklist" data-testid="AccessListUnBlacklistDialog" {...rest}>
      <ProgressOverlay isLoading={isLoading}>
        {rows.length ? (
          <List>
            {rows.map((access, i) => (
              <ListItem key={i}>
                <ListItemText>{access.account}</ListItemText>
                <ListItemSecondaryAction>
                  <IconButton onClick={handleUnBlacklist(access)}>
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>
            <FormattedMessage id="messages.empty-list" />
          </Typography>
        )}
      </ProgressOverlay>
    </ConfirmationDialog>
  );
};
