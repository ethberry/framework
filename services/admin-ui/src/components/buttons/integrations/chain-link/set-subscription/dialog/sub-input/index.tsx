import { ChangeEvent, FC } from "react";
import { useFormContext } from "react-hook-form";

import { EntityInput, IAutocompleteOption } from "@gemunion/mui-inputs-entity";
import { useUser } from "@gemunion/provider-user";
import { IUser } from "@framework/types";

export const VrfSubInput: FC = () => {
  const form = useFormContext<any>();
  const { profile } = useUser<IUser>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any): void => {
    form.setValue("subId", option?.id ?? 0);
    form.setValue("vrfSubId", option?.vrfSubId ?? 0);
  };

  return (
    <EntityInput
      name="subId"
      getTitle={(option: IAutocompleteOption) => `SubId #${option.vrfSubId}`}
      controller="chain-link/subscriptions"
      data={{
        chainId: profile.chainId,
        merchantId: profile.merchantId,
      }}
      onChange={handleChange}
      autoselect
    />
  );
};
