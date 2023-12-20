import { FC, useEffect, useState } from "react";
import { List, ListItemText } from "@mui/material";
import { TxHashLink } from "@gemunion/mui-scanner";
// Hooks
import { useIndexedDB } from "react-indexed-db-hook";

import { StyledListItem } from "@framework/styled";

import { ITabPanelProps } from "../tabs";

// https://github.com/assuncaocharles/react-indexed-db
export const ProfileNotifications: FC<ITabPanelProps> = props => {
  const { open } = props;

  // const db = useIndexedDB("txs");
  const { getAll } = useIndexedDB("txs");
  const [txs, setTxs] = useState([{ id: 0, txType: "", txHash: "", time: "" }]);

  // TODO auto-refresh?
  // TODO save db items after MM transactions, then update them after io success notification
  useEffect(() => {
    void getAll().then((rec: any[]) => {
      setTxs(rec.reverse());
    });
  }, []);

  if (!open) {
    return null;
  }
  // TODO links
  return (
    <List disablePadding={true}>
      {txs.map(tx => (
        <StyledListItem key={tx.id}>
          <ListItemText sx={{ width: 0.3 }}>Type # {tx.txType}</ListItemText>
          <ListItemText sx={{ width: 0.7 }}>
            <TxHashLink hash={tx.txHash} length={42} />
          </ListItemText>
          <ListItemText sx={{ width: 0.3 }}># {tx.time}</ListItemText>
          {/* <ListActions> */}
          {/*  <ListAction onClick={handleEdit(order)} message="form.buttons.edit" icon={Create} /> */}
          {/* </ListActions> */}
        </StyledListItem>
      ))}
    </List>
  );
};
