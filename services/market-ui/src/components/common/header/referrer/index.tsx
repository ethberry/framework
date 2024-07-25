import { FC, useLayoutEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Link } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import { constants } from "ethers";

import { useAppDispatch, useAppSelector } from "@gemunion/redux";
import { walletSelectors, walletActions } from "@gemunion/provider-wallet";

export const Referrer: FC = () => {
  const [searchParams] = useSearchParams();

  const referrer = useAppSelector<string>(walletSelectors.referrerSelector);
  const { setReferrer } = walletActions;
  const dispatch = useAppDispatch();

  const handleRemoveReferrer = () => {
    void dispatch(setReferrer(constants.AddressZero));
  };

  useLayoutEffect(() => {
    const referrer = searchParams.get("referrer");
    if (referrer) {
      void dispatch(setReferrer(referrer));
    }
  }, [searchParams]);

  if (referrer === constants.AddressZero) {
    return null;
  }

  return (
    <Tooltip title={referrer} enterDelay={300}>
      <IconButton color="inherit" onClick={handleRemoveReferrer} data-testid="RemoveReferrerButton">
        <Link />
      </IconButton>
    </Tooltip>
  );
};
