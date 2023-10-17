import { FC, useEffect } from "react";
import { useIntl } from "react-intl";
import { useIndexedDB } from "react-indexed-db-hook";
import { useSnackbar } from "notistack";
import { io } from "socket.io-client";

import { useApi } from "@gemunion/provider-api-firebase";
import { useUser } from "@gemunion/provider-user";
import type { IUser } from "@framework/types";
import { ContractEventType, SignalEventType } from "@framework/types";

export const Signal: FC = () => {
  const api = useApi();
  const user = useUser<IUser>();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const { add } = useIndexedDB("txs");

  const isUserAuthenticated = user.isAuthenticated();

  useEffect(() => {
    if (!isUserAuthenticated) {
      return;
    }

    const socket = io(`${process.env.SIGNAL_BE_URL}`, {
      extraHeaders: {
        Authorization: `Bearer ${api.getToken()?.accessToken || ""}`,
      },
    });

    socket.emit(SignalEventType.PING, { [SignalEventType.PING]: true }, (pong: any) => {
      console.info("PONG", pong);
    });

    socket.on("exception", (exception: any) => {
      console.error(exception);
      enqueueSnackbar(formatMessage({ id: "socket.error" }), { variant: "error" });
    });

    socket.on("connect_failed", () => {
      enqueueSnackbar(formatMessage({ id: "socket.connect_failed" }), { variant: "error" });
    });

    socket.on(
      SignalEventType.TRANSACTION_HASH,
      async (dto: { transactionHash: string; transactionType?: ContractEventType }) => {
        if (dto.transactionType) {
          const date = new Date();
          enqueueSnackbar(
            formatMessage(
              { id: "snackbar.transactionTypeExecuted" },
              { txHash: dto.transactionHash, txType: dto.transactionType },
            ),
            {
              variant: "success",
            },
          );
          await add({ txHash: dto.transactionHash, txType: dto.transactionType, time: date.toISOString() }).then(
            event => {
              console.info("DB ID Generated: ", event);
            },
            error => {
              console.error(error);
            },
          );
        } else {
          enqueueSnackbar(formatMessage({ id: "snackbar.transactionExecuted" }, { txHash: dto.transactionHash }), {
            variant: "success",
          });
        }
      },
    );

    return () => {
      socket.off("exception");
      socket.off("connect_failed");
      socket.off(SignalEventType.TRANSACTION_HASH);
      socket.disconnect();
    };
  }, [isUserAuthenticated]);

  return null;
};
