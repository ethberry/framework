import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "@mui/material";
import { TimerOutlined } from "@mui/icons-material";
import { Contract, utils } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useApiCall } from "@gemunion/react-hooks";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { emptyItem } from "@gemunion/mui-inputs-asset";
import { TokenType } from "@framework/types";

import WaitListSetRewardABI from "../../../../../abis/mechanics/waitlist/list/setReward.abi.json";
import { IWaitListGenerateDto, WaitListGenerateDialog } from "./dialog";

export interface IRoot {
  root: string;
}

export interface IWaitListGenerateButtonProps {
  className?: string;
}

export const WaitListGenerateButton: FC<IWaitListGenerateButtonProps> = props => {
  const { className } = props;

  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  const { fn } = useApiCall(
    async (api, values) => {
      return api.fetchJson({
        url: `/waitlist/list/generate`,
        method: "POST",
        data: {
          listId: values,
        },
      });
    },
    { success: false },
  );

  const metaFn = useMetamask((values: IWaitListGenerateDto, root: IRoot, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.WAITLIST_ADDR, WaitListSetRewardABI, web3Context.provider?.getSigner());

    const asset = values.item.components.map(component => ({
      tokenType: Object.values(TokenType).indexOf(component.tokenType),
      token: component.contract!.address,
      tokenId: component.templateId || 0,
      amount: component.amount,
    }));
    return contract.setReward(utils.arrayify(root.root), asset, values.listId) as Promise<void>;
  });

  const handleUpload = () => {
    setIsGenerateDialogOpen(true);
  };

  const handleGenerateCancel = () => {
    setIsGenerateDialogOpen(false);
  };

  const handleGenerateConfirm = async (values: Record<string, any>) => {
    const proof = await fn(null as unknown as any, values.listId);
    return metaFn(values, proof)
      .then(() => {
        setIsGenerateDialogOpen(false);
      })
      .catch(e => {
        console.error(e);
      });
  };

  return (
    <Fragment>
      <Button
        variant="outlined"
        startIcon={<TimerOutlined />}
        onClick={handleUpload}
        data-testid="WaitListUploadButton"
        className={className}
      >
        <FormattedMessage id={`form.buttons.upload`} />
      </Button>

      <WaitListGenerateDialog
        onCancel={handleGenerateCancel}
        onConfirm={handleGenerateConfirm}
        open={isGenerateDialogOpen}
        initialValues={{
          item: emptyItem,
          listId: 1,
        }}
      />
    </Fragment>
  );
};
