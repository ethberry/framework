import { ChangeEvent, FC, HTMLAttributes, ReactElement, useCallback, useState } from "react";
import { useIntl } from "react-intl";
import { enqueueSnackbar } from "notistack";
import { Controller, get, useFormContext, useWatch } from "react-hook-form";
import { Autocomplete, AutocompleteChangeReason, AutocompleteRenderInputParams, TextField } from "@mui/material";

import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useTestId } from "@gemunion/provider-test-id";
import { useApiCall, useDeepCompareEffect } from "@gemunion/react-hooks";

export interface IAutocompleteOption {
  id: string | number;
  title: string;

  [key: string]: string | number;
}

export interface IContractAddressInputProps {
  name: string;
  label?: string | number | ReactElement;
  placeholder?: string;
  controller: string;
  disabled?: boolean;
  readOnly?: boolean;
  disableClear?: boolean;
  autoselect?: boolean;
  freeSolo?: boolean;
  getTitle?: (item: any) => string;
  targetId?: string;
  data?: Record<string, any>;
  variant?: "standard" | "filled" | "outlined";
  onChange?: (
    event: ChangeEvent<unknown>,
    options: Array<IAutocompleteOption | string> | string | IAutocompleteOption | null,
    reason: string,
  ) => void;
}

export const ContractAddressInput: FC<IContractAddressInputProps> = props => {
  const {
    name,
    controller,
    getTitle,
    targetId = "id",
    autoselect = false,
    data = {},
    variant = "standard",
    onChange,
    label,
    placeholder,
    disabled,
    readOnly,
    freeSolo = false,
    disableClear,
  } = props;
  const suffix = name.split(".").pop() as string;

  const { testId } = useTestId();
  const testIdProps = testId ? { "data-testid": `${testId}-${name}` } : {};

  const [open, setOpen] = useState(false);

  const form = useFormContext<any>();
  const error = get(form.formState.errors, name);
  const value = useWatch({ name });

  const { formatMessage } = useIntl();
  const localizedLabel = label ?? formatMessage({ id: `form.labels.${suffix}` });
  const localizedPlaceholder = placeholder ?? formatMessage({ id: `form.placeholders.${suffix}` });
  const localizedHelperText = error ? formatMessage({ id: error.message }, { label: localizedLabel }) : "";

  const [options, setOptions] = useState<Array<IAutocompleteOption>>([]);

  const abortController = new AbortController();

  const { fn: fetchByController, isLoading } = useApiCall(
    (api, data: Record<string, any>) => {
      return api.fetchJson({
        url: `/${controller}/autocomplete`,
        data,
        signal: abortController.signal,
      });
    },
    { success: false },
  );

  const fetchOptions = useCallback(async (): Promise<void> => {
    return fetchByController(form, data)
      .then((json: Array<any>) => {
        setOptions(json);
        if (autoselect) {
          const newValue = json[0];

          if (!newValue) {
            form.setValue(name, null, { shouldDirty: true });
            return;
          }

          const isValueNotExistInOptions = value && json.every((o: IAutocompleteOption) => o[targetId] !== value);

          if (!value || isValueNotExistInOptions) {
            onChange
              ? onChange({} as ChangeEvent<unknown>, newValue, "autoselect")
              : form.setValue(name, newValue[targetId], {
                  shouldTouch: true,
                  shouldDirty: true,
                });
          }
        }
      })
      .catch(e => {
        if (!e.message.includes("The user aborted a request")) {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
  }, [data, value, name, form]);

  useDeepCompareEffect(() => {
    void fetchOptions();

    return () => abortController.abort();
  }, [data]);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => {
        return (
          <ProgressOverlay isLoading={isLoading}>
            <Autocomplete
              open={open}
              onOpen={() => !readOnly && setOpen(true)}
              onClose={() => setOpen(false)}
              disableClearable={disableClear || readOnly}
              sx={{ my: 1 }}
              multiple={false}
              disabled={disabled}
              options={options}
              freeSolo={freeSolo}
              autoSelect
              value={options.find((option: IAutocompleteOption) => value === option[targetId]) || null}
              onChange={
                onChange ||
                ((
                  _event: ChangeEvent<unknown>,
                  option: string | IAutocompleteOption | null,
                  reason: AutocompleteChangeReason,
                ): void => {
                  let value = option ? (typeof option !== "string" ? option[targetId] : option) : null;
                  if (reason === "blur" && typeof option === "string") {
                    const foundOption = options.find(({ title, address }) => option === title || option === address);
                    value = foundOption?.address || option;
                  }
                  form.setValue(name, value, { shouldDirty: true });
                })
              }
              getOptionLabel={(option: IAutocompleteOption | string) =>
                getTitle ? getTitle(option) : typeof option !== "string" ? option.title : option
              }
              renderOption={(props: HTMLAttributes<HTMLLIElement>, option: IAutocompleteOption | string) => {
                const title = getTitle ? getTitle(option) : typeof option !== "string" ? option.title : option;
                return (
                  <li {...props} key={typeof option !== "string" ? option.id : option}>
                    {title}
                  </li>
                );
              }}
              renderInput={(params: AutocompleteRenderInputParams): ReactElement => (
                <TextField
                  {...params}
                  {...field}
                  inputProps={{ ...params.inputProps, readOnly, ...testIdProps }}
                  InputProps={{ ...params.InputProps }}
                  label={localizedLabel}
                  placeholder={localizedPlaceholder}
                  error={!!error}
                  helperText={localizedHelperText}
                  variant={variant}
                  onChange={() => {}}
                  fullWidth
                />
              )}
            />
          </ProgressOverlay>
        );
      }}
    />
  );
};
