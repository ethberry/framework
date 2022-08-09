import { FC, useEffect, useState } from "react";
import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Tooltip } from "@mui/material";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { AccountBalanceWallet, Redeem } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";
import { useSnackbar } from "notistack";
import { constants, Contract, utils } from "ethers";

import { ApiError } from "@gemunion/provider-api-firebase";
import { useApiCall } from "@gemunion/react-hooks";
import { useWallet } from "@gemunion/provider-wallet";
import { IPaginationResult } from "@gemunion/types-collection";
import { Spinner } from "@gemunion/mui-page-layout";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { ClaimStatus, IClaim, TokenType } from "@framework/types";
import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/Exchange.sol/Exchange.json";

export const Claim: FC = () => {
  const [claims, setClaims] = useState<Array<IClaim>>([]);

  const { isActive, account } = useWeb3React();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const { openConnectWalletDialog } = useWallet();

  const { fn, isLoading } = useApiCall(
    async (api, web3Context: Web3ContextType) => {
      return api.fetchJson({
        url: `/claim`,
        data: {
          account: web3Context.account!,
          claimStatus: [],
        },
      });
    },
    { success: false, error: false },
  );

  const fetchClaim = useMetamask(
    async (web3Context: Web3ContextType): Promise<void> => {
      return fn(undefined, web3Context)
        .then((json: IPaginationResult<IClaim>) => {
          setClaims(json.rows);
        })
        .catch((e: ApiError) => {
          if (e.status === 404) {
            setClaims([]);
          } else if (e.status) {
            enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
          } else {
            console.error(e);
            enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
          }
        });
    },
    { success: false },
  );

  const metaClick = useMetamask((claim: IClaim, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, web3Context.provider?.getSigner());
    return contract.claim(
      {
        nonce: utils.arrayify(claim.nonce),
        externalId: claim.id,
        expiresAt: Math.ceil(new Date(claim.endTimestamp).getTime() / 1000),
        referral: constants.AddressZero,
      },
      claim.item?.components.map(component => ({
        tokenType: Object.keys(TokenType).indexOf(component.tokenType),
        token: component.contract!.address,
        tokenId: component.templateId,
        amount: component.amount,
      })),
      process.env.ACCOUNT,
      claim.signature,
    ) as Promise<void>;
  });

  const handleClick = (claim: IClaim) => {
    return () => {
      return metaClick(claim);
    };
  };

  useEffect(() => {
    void fetchClaim();
  }, [isActive, account]);

  if (!isActive) {
    return (
      <>
        <Tooltip title={formatMessage({ id: "components.header.wallet.connect" })} enterDelay={300}>
          <IconButton color="inherit" onClick={openConnectWalletDialog}>
            <AccountBalanceWallet />
          </IconButton>
        </Tooltip>

        <FormattedMessage id="pages.claim.connect" />
      </>
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (claims.length) {
    return (
      <List>
        {claims.map((claim, i) => (
          <ListItem key={i}>
            <ListItemText sx={{ width: 0.6 }}>{claim.item.components[0]?.template?.title}</ListItemText>
            <ListItemText>{claim.claimStatus}</ListItemText>
            <ListItemSecondaryAction>
              <Tooltip title={formatMessage({ id: "form.tips.redeem" })} enterDelay={300} key={claim.id}>
                <IconButton onClick={handleClick(claim)} disabled={claim.claimStatus !== ClaimStatus.NEW}>
                  <Redeem />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  }

  return <FormattedMessage id="pages.claim.sorry" />;
};
