import { ChangeEvent, FC, Fragment, useEffect, useMemo } from "react";
import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { FormattedMessage } from "react-intl";
import { FixedSizeList } from "react-window";

import { IToken } from "../../provider";

import { useAllTokens } from "../../hooks/useAllTokens";
import { useDebounce } from "../../hooks/useDebounce";
import { useWalletTokens } from "../../hooks/useWalletTokens";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { SearchInput } from "../search";
import { CloseButton } from "../close-button";

export interface ITokenSearchProps {
  onSelect: (token: IToken) => any | void;
  onClose: () => void;
  filter?: (token: IToken) => boolean;
  open: boolean;
}

export const TokenSearchDialog: FC<ITokenSearchProps> = props => {
  const { onSelect, onClose, filter, open } = props;
  const allTokens = useAllTokens();
  const walletTokens = useWalletTokens();
  const walletTokenBalances = useTokenBalances(walletTokens);

  const [query, setQuery] = useDebounce("", 500);

  const sortedTokens = useMemo(() => {
    const walletTokenAddressMerge = walletTokens.map(t => t.address.toLowerCase());

    return [...allTokens].sort((a, b) => {
      if (
        !walletTokenAddressMerge.includes(a.address.toLowerCase()) &&
        walletTokenAddressMerge.includes(b.address.toLowerCase())
      ) {
        return 1;
      }
      return -1;
    });
  }, [allTokens.length, Object.values(walletTokenBalances).join(""), walletTokens.length]);

  const displayedTokens = useMemo(() => {
    return sortedTokens.filter(t => (t.symbol + " " + t.name).toLowerCase().includes(query.toLowerCase()));
  }, [sortedTokens, query]);

  useEffect(() => {
    if (query !== "") {
      setQuery("");
    }
  }, [filter]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <FormattedMessage id="pages.dex.1inch.token-search.title" values={{ amount: allTokens.length }} />
        <CloseButton onClick={handleClose} />
      </DialogTitle>
      <DialogContent>
        <SearchInput
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
          }}
        />
        <List>
          <FixedSizeList
            height={300}
            width={"100%"}
            itemSize={56}
            itemCount={displayedTokens.length}
            itemData={displayedTokens}
          >
            {({ data, index, style }) => (
              <ListItem style={style} key={index} disableGutters>
                <ListItemButton
                  onClick={() => {
                    onClose();
                    onSelect(data[index]);
                    setQuery("");
                  }}
                >
                  <ListItemAvatar style={{ minWidth: 40 }}>
                    <Avatar alt={data[index].symbol} src={data[index].logoURI} style={{ width: 32, height: 32 }} />
                  </ListItemAvatar>
                  <ListItemText>
                    <Box style={{ display: "flex", alignItems: "center" }}>
                      <Typography>{data[index].symbol}</Typography>
                      <Box style={{ flexGrow: 1 }} />
                      <Box
                        sx={{
                          fontSize: "body2.fontSize",
                          color: grey[500],
                        }}
                      >
                        {walletTokens.find(to => to.address === data[index].address) ? (
                          <Fragment>({walletTokenBalances[data[index].address]?.slice(0, 10)}…)</Fragment>
                        ) : null}
                      </Box>
                    </Box>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            )}
          </FixedSizeList>
        </List>
      </DialogContent>
    </Dialog>
  );
};
