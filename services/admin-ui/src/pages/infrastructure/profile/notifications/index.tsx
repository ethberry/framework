import { FC, useEffect, useState } from "react";
import { List, ListItem, ListItemText } from "@mui/material";

// Hooks
import { useIndexedDB } from "react-indexed-db-hook";

import { ITabPanelProps } from "../tabs";

// https://github.com/assuncaocharles/react-indexed-db
export const ProfileNotifications: FC<ITabPanelProps> = props => {
  const { open } = props;

  // const db = useIndexedDB("txs");
  const { getAll } = useIndexedDB("txs");
  const [txs, setTxs] = useState([{ id: 0, txType: "", txHash: "" }]);

  // TODO auto-refresh?
  // TODO save db items after MM transactions, then update them after io success notification
  useEffect(() => {
    void getAll().then((rec: any[]) => {
      setTxs(rec);
    });
  }, []);

  if (!open) {
    return null;
  }

  return (
    <List disablePadding={true}>
      {txs.map(tx => (
        <ListItem key={tx.id} disableGutters>
          <ListItemText>Type # {tx.txType}</ListItemText>
          <ListItemText>Hash # {tx.txHash}</ListItemText>
          {/* <ListActions> */}
          {/*  <ListAction onClick={handleEdit(order)} message="form.buttons.edit" icon={Create} /> */}
          {/* </ListActions> */}
        </ListItem>
      ))}
    </List>
  );
};
