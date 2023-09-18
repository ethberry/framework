import { FC, useEffect, useState } from "react";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";
import { FormattedMessage } from "react-intl";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";

import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { useApiCall } from "@gemunion/react-hooks";
import { ListAction, ListActions } from "@framework/mui-lists";
import type { IAccessList } from "@framework/types";

import UnBlacklistABI from "../../../../../abis/extensions/blacklist-remove/unBlacklist.abi.json";

export interface IAccessListUnBlacklistDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  data: { address: string };
}

export const AccessListUnBlacklistDialog: FC<IAccessListUnBlacklistDialogProps> = props => {
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
    const contract = new Contract(data.address, UnBlacklistABI, web3Context.provider?.getSigner());
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
            {rows.map(access => (
              <ListItem key={access.id}>
                <ListItemText>{access.account}</ListItemText>
                <ListActions>
                  <ListAction onClick={handleUnBlacklist(access)} icon={Delete} message="form.buttons.delete" />
                </ListActions>
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
