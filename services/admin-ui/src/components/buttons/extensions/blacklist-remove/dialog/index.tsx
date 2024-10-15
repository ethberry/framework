import { FC, useEffect, useState } from "react";
import { Contract } from "ethers";
import { Web3ContextType, useWeb3React } from "@web3-react/core";
import { ListItemText } from "@mui/material";
import { Delete } from "@mui/icons-material";

import { ProgressOverlay } from "@ethberry/mui-page-layout";
import { ConfirmationDialog } from "@ethberry/mui-dialog-confirmation";
import { useMetamask } from "@ethberry/react-hooks-eth";
import { useApiCall } from "@ethberry/react-hooks";
import { ListAction, ListActions, StyledListItem, StyledListWrapper } from "@framework/styled";
import type { IAccessList } from "@framework/types";

import ERC20BlacklistUnBlacklistABI from "@framework/abis/json/ERC20Blacklist/unBlacklist.json";

export interface IAccessListUnBlacklistDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  data: { address: string };
}

export const AccessListUnBlacklistDialog: FC<IAccessListUnBlacklistDialogProps> = props => {
  const { data, open, onConfirm, onCancel } = props;

  const [rows, setRows] = useState<Array<IAccessList>>([]);

  const { account } = useWeb3React();

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: `/access-list/${data.address}`,
      });
    },
    { success: false },
  );

  const metaUnBlacklist = useMetamask((values: IAccessList, web3Context: Web3ContextType) => {
    const contract = new Contract(data.address, ERC20BlacklistUnBlacklistABI, web3Context.provider?.getSigner());
    return contract.unBlacklist(values.account) as Promise<void>;
  });

  const handleUnBlacklist = (values: IAccessList): (() => Promise<void>) => {
    return async () => {
      return metaUnBlacklist(values).then(() => {
        return onConfirm();
      });
    };
  };

  useEffect(() => {
    void fn().then((rows: Array<IAccessList>) => {
      setRows(rows);
    });
  }, [account, open]);

  return (
    <ConfirmationDialog
      message="dialogs.unBlacklist"
      data-testid="AccessListUnBlacklistDialog"
      open={open}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(access => (
            <StyledListItem key={access.id}>
              <ListItemText>{access.account}</ListItemText>
              <ListActions>
                <ListAction onClick={handleUnBlacklist(access)} message="form.buttons.delete" icon={Delete} />
              </ListActions>
            </StyledListItem>
          ))}
        </StyledListWrapper>
      </ProgressOverlay>
    </ConfirmationDialog>
  );
};
