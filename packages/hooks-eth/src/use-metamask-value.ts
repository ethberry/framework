import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";

export const useMetamaskValue = <T = any>(fn: (...args: Array<any>) => Promise<T>) => {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  return async (...args: Array<any>) => {
    return fn(...args).catch((error: any) => {
      if (error.code === 4001) {
        enqueueSnackbar(formatMessage({ id: "snackbar.denied" }), { variant: "warning" });
      } else {
        throw error;
      }
    });
  };
};
