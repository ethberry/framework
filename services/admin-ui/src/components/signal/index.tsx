import { FC, useEffect } from "react";
import { useIntl } from "react-intl";
import { useSnackbar } from "notistack";
import { io } from "socket.io-client";

import { useApi } from "@gemunion/provider-api-firebase";
import { SignalEventType } from "@framework/types";

export const Signal: FC = () => {
  const api = useApi();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const socket = io(process.env.SIGNAL_URL, {
    extraHeaders: {
      Authorization: `Bearer ${api.getToken()?.accessToken || ""}`,
    },
  });

  useEffect(() => {
    socket.on("exception", (exception: any) => {
      console.error(exception);
      enqueueSnackbar(formatMessage({ id: "socket.error" }), { variant: "error" });
    });

    socket.on("connect_failed", () => {
      enqueueSnackbar(formatMessage({ id: "socket.connect_failed" }), { variant: "error" });
    });

    socket.emit(SignalEventType.PING, { [SignalEventType.PING]: true }, (pong: any) => {
      console.info("PONG", pong);
    });

    socket.on(SignalEventType.TRANSACTION_HASH, (dto: { transactionHash: string }) => {
      enqueueSnackbar(formatMessage({ id: "snackbar.transactionExecuted" }, { txHash: dto.transactionHash }), {
        variant: "info",
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
};
