import { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";

export const defaultThen = (
  result: any,
  enqueueSnackbar: (message: SnackbarMessage, options?: (OptionsObject | undefined)) => SnackbarKey,
  formatMessage: any,
) => {
  enqueueSnackbar(formatMessage({ id: "snackbar.success" }), { variant: "success" });

  return result;
};

export const defaultCatch = (
  e: any,
  enqueueSnackbar: (message: SnackbarMessage, options?: (OptionsObject | undefined)) => SnackbarKey,
  formatMessage: any,
) => {
  if (e.status === 400) {
    const errors = e.getLocalizedValidationErrors ? e.getLocalizedValidationErrors() : [];

    console.log("errors", errors);
  } else if (e.status) {
    enqueueSnackbar(formatMessage({ id: `snackbar.${e.message as string}` }), { variant: "error" });
  } else {
    console.error(e);
    enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
  }
};
