import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSnackbar } from "notistack";
import { io, Socket } from "socket.io-client";

import { useApi } from "@gemunion/provider-api-firebase";
import { useUser } from "@gemunion/provider-user";
import { useAppDispatch, collectionActions } from "@gemunion/redux";
import type { IUser } from "@framework/types";
import { ContractEventSignature, SignalEventType } from "@framework/types";

import { EventRouteMatch } from "./constants";

export const Signal: FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const dispatch = useAppDispatch();
  const { setNeedRefresh } = collectionActions;

  const api = useApi();
  const user = useUser<IUser>();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const isUserAuthenticated = user.isAuthenticated();

  const handleEvent = (dto: { transactionHash: string; transactionType?: ContractEventSignature }) => {
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

      const isRouteMatchToEvent =
        Object.keys(EventRouteMatch).includes(dto.transactionType) &&
        location.pathname.startsWith(
          EventRouteMatch[dto.transactionType as unknown as keyof typeof EventRouteMatch] as string,
        );

      if (isRouteMatchToEvent) {
        dispatch(setNeedRefresh(true));
      }
    } else {
      enqueueSnackbar(formatMessage({ id: "snackbar.transactionExecuted" }, { txHash: dto.transactionHash }), {
        variant: "success",
      });
    }
  };

  const activateSocket = async () => {
    await api.refreshToken();

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

    socket.on(SignalEventType.TRANSACTION_HASH, handleEvent);

    setSocket(socket);
  };

  const deactivateSocket = (socket: Socket) => {
    socket.off("exception");
    socket.off("connect_failed");
    socket.off(SignalEventType.TRANSACTION_HASH);
    socket.disconnect();
    setSocket(null);
  };

  useEffect(() => {
    if (!socket && isUserAuthenticated) {
      void activateSocket();
    }

    if (socket && !isUserAuthenticated) {
      deactivateSocket(socket);
    }

    return () => {
      if (socket) {
        deactivateSocket(socket);
      }
    };
  }, [socket, isUserAuthenticated]);

  return null;
};
