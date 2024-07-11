import { FC, useEffect, useState } from "react";
import { Contract } from "ethers";
import { Web3ContextType, useWeb3React } from "@web3-react/core";
import { ListItemText } from "@mui/material";
import { Delete } from "@mui/icons-material";

import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { useApiCall } from "@gemunion/react-hooks";
import { ListAction, ListActions, StyledListItem, StyledListWrapper } from "@framework/styled";
import type { IAccessList } from "@framework/types";

import UnWhitelistABI from "@framework/abis/json/ERC20Whitelist/unWhitelist.json";
import { useCheckPermissions } from "../../../../../utils/use-check-permissions";

export interface IAccessListUnWhitelistDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  data: { address: string };
}

export const AccessListUnWhitelistDialog: FC<IAccessListUnWhitelistDialogProps> = props => {
  const { data, ...rest } = props;

  const [rows, setRows] = useState<Array<IAccessList>>([]);

  const [hasAccess, setHasAccess] = useState(false);

  const { account = "" } = useWeb3React();

  const { checkPermissions } = useCheckPermissions();

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: `/access-list/${data.address}`,
      });
    },
    { success: false },
  );

  const metaUnWhitelist = useMetamask((values: IAccessList, web3Context: Web3ContextType) => {
    const contract = new Contract(data.address, UnWhitelistABI, web3Context.provider?.getSigner());
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

  useEffect(() => {
    if (account) {
      void checkPermissions({
        account,
        address: data.address,
      }).then((json: { hasRole: boolean }) => {
        setHasAccess(json?.hasRole);
      });
    }
  }, [account]);

  return (
    <ConfirmationDialog message="dialogs.unWhitelist" data-testid="AccessListUnWhitelistDialog" {...rest}>
      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(access => (
            <StyledListItem key={access.id}>
              <ListItemText>{access.account}</ListItemText>
              <ListActions>
                <ListAction
                  onClick={handleUnWhitelist(access)}
                  message="dialogs.unWhitelist"
                  icon={Delete}
                  disabled={!hasAccess}
                />
              </ListActions>
            </StyledListItem>
          ))}
        </StyledListWrapper>
      </ProgressOverlay>
    </ConfirmationDialog>
  );
};
