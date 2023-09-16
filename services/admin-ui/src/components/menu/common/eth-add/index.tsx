import { FC, Fragment, useState } from "react";
import { DoNotDisturbOn } from "@mui/icons-material";
import { useApiCall } from "@gemunion/react-hooks";

import type { IContract } from "@framework/types";
import { NodeEnv } from "@framework/types";

import { getListenerType } from "../../../../utils/listener-type";
import { ListAction, ListActionVariant } from "../../../common/lists";
import { EthListenerAddDialog, IEthListenerAddDto } from "./dialog";

export interface IEthListenerAddMenuItemProps {
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const EthListenerAddMenuItem: FC<IEthListenerAddMenuItemProps> = props => {
  const { contract, disabled, variant } = props;

  const [isEthListenerDialogOpen, setIsEthListenerDialogOpen] = useState(false);

  const handleEthListenerAdd = (): void => {
    setIsEthListenerDialogOpen(true);
  };

  const handleEthListenerAddCancel = (): void => {
    setIsEthListenerDialogOpen(false);
  };

  const { fn } = useApiCall(async (api, values) => {
    return api.fetchJson({
      url: "/eth-logger/add",
      method: "POST",
      data: values,
    });
  });

  const handleEthListenerAddConfirm = async (values: IEthListenerAddDto): Promise<void> => {
    await fn(void 0, values).finally(() => {
      setIsEthListenerDialogOpen(false);
    });
  };

  if (process.env.NODE_ENV === NodeEnv.production) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleEthListenerAdd}
        icon={DoNotDisturbOn}
        message="form.buttons.addListener"
        disabled={disabled}
        variant={variant}
      />
      <EthListenerAddDialog
        onCancel={handleEthListenerAddCancel}
        onConfirm={handleEthListenerAddConfirm}
        open={isEthListenerDialogOpen}
        initialValues={{
          address: contract.address,
          listenerType: getListenerType(contract),
          fromBlock: contract.fromBlock,
        }}
      />
    </Fragment>
  );
};
