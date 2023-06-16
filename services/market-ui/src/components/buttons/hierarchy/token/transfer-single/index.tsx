import { FC, Fragment, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Tooltip } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IToken } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import ERC1155SafeTransferFromABI from "../../../../../abis/hierarchy/erc1155/transfer/transfer.abi.json";

import type { IErc1155TransferDto } from "./account";
import { Erc1155TransferDialog } from "./account";

interface ITokenTransferButtonProps {
  token: IToken;
}

export const Erc1155TransferButton: FC<ITokenTransferButtonProps> = props => {
  const { token } = props;

  const [isTransferTokenDialogOpen, setIsTransferTokenDialogOpen] = useState(false);

  const { formatMessage } = useIntl();

  const metaFn = useMetamask((dto: IErc1155TransferDto, web3Context: Web3ContextType) => {
    const contract = new Contract(
      token.template!.contract!.address,
      ERC1155SafeTransferFromABI,
      web3Context.provider?.getSigner(),
    );
    return contract.safeTransferFrom(web3Context.account, dto.account, token.tokenId, dto.amount, "0x") as Promise<any>;
  });

  const handleTransfer = (): void => {
    setIsTransferTokenDialogOpen(true);
  };

  const handleTransferConfirm = async (dto: IErc1155TransferDto) => {
    await metaFn(dto).finally(() => {
      setIsTransferTokenDialogOpen(false);
    });
  };

  const handleTransferCancel = () => {
    setIsTransferTokenDialogOpen(false);
  };

  return (
    <Fragment>
      <Tooltip title={formatMessage({ id: "form.tips.transfer" })}>
        <Button
          onClick={handleTransfer}
          disabled={token.template?.contract?.contractFeatures.includes(ContractFeatures.SOULBOUND)}
          data-testid="TransferErc1155Button"
        >
          <FormattedMessage id="form.buttons.transfer" />
        </Button>
      </Tooltip>
      <Erc1155TransferDialog
        onConfirm={handleTransferConfirm}
        onCancel={handleTransferCancel}
        open={isTransferTokenDialogOpen}
        message="dialogs.transfer"
        testId="TransferErc1155DialogForm"
        initialValues={{
          account: "",
          amount: "1",
        }}
      />
    </Fragment>
  );
};
