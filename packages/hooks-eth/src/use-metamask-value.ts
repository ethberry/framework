import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";

import { defaultCatch, defaultThen } from "./utils";

export const useMetamaskValue = <T = any>(fn: (...args: Array<any>) => Promise<T>) => {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const defaultThenHandler = (result: any) => {
    return defaultThen(result, enqueueSnackbar, formatMessage);
  };

  const defaultCatchHandler = (e: any) => {
    defaultCatch(e, enqueueSnackbar, formatMessage);
  };

  return async (...args: Array<any>) => {
    const params = args.length > 0 ? args[0] : {};
    const {
      thenHandler = defaultThenHandler,
      catchHandler = defaultCatchHandler,
    } = params;

    return fn(...args)
      .then(thenHandler)
      .catch((error: any) => {
        if (error.code === 4001) {
          enqueueSnackbar(formatMessage({ id: "snackbar.denied" }), { variant: "warning" });
        } else {
          catchHandler(error);
        }
      });
  };
};
