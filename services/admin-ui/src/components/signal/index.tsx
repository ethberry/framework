import { FC, useEffect } from "react";
import { useIntl } from "react-intl";
import { useSnackbar } from "notistack";
import { io } from "socket.io-client";

import { useApi } from "@gemunion/provider-api-firebase";

export const Signal: FC = () => {
  const api = useApi();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const socket = io("http://localhost:3013", {
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

    socket.emit("ping", { ping: true }, (pong: any) => {
      console.log(pong);
    });

    socket.on("txHash", (dto: any) => {
      console.log(dto);
      enqueueSnackbar(formatMessage({ id: "socket.txHash" }), { variant: "info" });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
};
