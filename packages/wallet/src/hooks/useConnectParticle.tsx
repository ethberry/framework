import { useCallback } from "react";
import { useIntl } from "react-intl";
import { enqueueSnackbar } from "notistack";
import { AuthType } from "@particle-network/auth";

import { TConnectors, useAppDispatch, useAppSelector, walletActions } from "@gemunion/redux";

import { useWallet } from "../provider";
import { particleAuth } from "../connectors/particle";

export interface IUseConnectParticle {
  onClick?: () => void;
}

export const useConnectParticle = (props: IUseConnectParticle) => {
  const { onClick = () => {} } = props;

  const { formatMessage } = useIntl();
  const { network } = useAppSelector(state => state.wallet);
  const { setActiveConnector } = walletActions;
  const dispatch = useAppDispatch();
  const { connectCallback } = useWallet();

  return useCallback(
    (type: AuthType) => {
      return connectCallback(async () => {
        return particleAuth
          .activate({ preferredAuthType: type })
          .then(() => {
            dispatch(setActiveConnector(TConnectors.PARTICLE));
            onClick();
          })
          .catch(e => {
            console.error("error", e);
            dispatch(setActiveConnector(null));
            if (e && e.code === 4001) {
              enqueueSnackbar(formatMessage({ id: "snackbar.rejectedByUser" }), { variant: "warning" });
            } else {
              enqueueSnackbar(formatMessage({ id: "snackbar.blockchainError" }), { variant: "error" });
            }
          });
      });
    },
    [network],
  );
};
