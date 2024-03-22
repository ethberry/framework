import { FC, useEffect, useState } from "react";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";
import { ListItemText } from "@mui/material";
import { Delete } from "@mui/icons-material";

import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { useApiCall } from "@gemunion/react-hooks";
import { ListAction, ListActions, StyledListItem, StyledListWrapper } from "@framework/styled";
import type { IAccessList } from "@framework/types";
import unWhitelistERC20WhitelistABI from "@framework/abis/unWhitelist/ERC20Whitelist.json";

export interface IAccessListUnWhitelistDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  data: { address: string };
}

export const AccessListUnWhitelistDialog: FC<IAccessListUnWhitelistDialogProps> = props => {
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

  const metaUnWhitelist = useMetamask((values: IAccessList, web3Context: Web3ContextType) => {
    const contract = new Contract(data.address, unWhitelistERC20WhitelistABI, web3Context.provider?.getSigner());
    return contract.unWhitelist(values.account) as Promise<void>;
  });

  const handleUnWhitelist = (values: IAccessList): (() => Promise<void>) => {
    return async () => {
      return metaUnWhitelist(values);
    };
  };

  useEffect(() => {
    void fn().then((rows: Array<IAccessList>) => {
      setRows(rows);
    });
  }, []);

  return (
    <ConfirmationDialog message="dialogs.unWhitelist" data-testid="AccessListUnWhitelistDialog" {...rest}>
      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(access => (
            <StyledListItem key={access.id}>
              <ListItemText>{access.account}</ListItemText>
              <ListActions>
                <ListAction onClick={handleUnWhitelist(access)} message="dialogs.unWhitelist" icon={Delete} />
              </ListActions>
            </StyledListItem>
          ))}
        </StyledListWrapper>
      </ProgressOverlay>
    </ConfirmationDialog>
  );
};
