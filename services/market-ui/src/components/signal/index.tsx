import { FC, useEffect } from "react";
import { useIntl } from "react-intl";

import { useSnackbar } from "notistack";
import { io } from "socket.io-client";

import { useApi } from "@gemunion/provider-api-firebase";
import { ContractEventType, SignalEventType } from "@framework/types";

export const Signal: FC = () => {
  const api = useApi();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  // 0xfe3b557e8fb62b89f4916b721be55ceb828dbd73
  // {
  //   "account": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
  //   "transactionHash": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
  //   "transactionType": "Transfer"
  // }

  useEffect(() => {
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
      (dto: { transactionHash: string; transactionType?: ContractEventType }) => {
        if (dto.transactionType) {
          enqueueSnackbar(
            formatMessage(
              { id: "snackbar.transactionTypeExecuted" },
              { txHash: dto.transactionHash, txType: dto.transactionType },
            ),
            {
              variant: "success",
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
  }, []);

  return null;
};
