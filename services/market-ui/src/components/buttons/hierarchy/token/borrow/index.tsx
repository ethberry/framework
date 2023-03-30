import { FC, Fragment, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Button, Tooltip } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";
import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IToken } from "@framework/types";

import ERC4907ABI from "./abi/erc4907.json";
import { BorrowDialog, IBorrowDto } from "./dialog";

interface ITokenBorrowButtonProps {
  token: IToken;
}

export const TokenBorrowButton: FC<ITokenBorrowButtonProps> = props => {
  const { token } = props;

  const [isBorrowTokenDialogOpen, setIsBorrowTokenDialogOpen] = useState(false);

  const { formatMessage } = useIntl();

  // function setUser(uint256 tokenId, address user, uint64 expires) public virtual {
  const metaFn = useMetamask((dto: IBorrowDto, web3Context: Web3ContextType) => {
    const contract = new Contract(token.template!.contract!.address, ERC4907ABI.abi, web3Context.provider?.getSigner());
    const expires = Math.ceil(new Date(dto.expires).getTime() / 1000); // in seconds,

    return contract.setUser(token.tokenId, dto.account, expires) as Promise<any>;
  });

  const handleBorrow = (): void => {
    setIsBorrowTokenDialogOpen(true);
  };

  const handleBorrowConfirm = async (dto: IBorrowDto) => {
    await metaFn(dto).finally(() => {
      setIsBorrowTokenDialogOpen(false);
    });
  };

  const handleBorrowCancel = () => {
    setIsBorrowTokenDialogOpen(false);
  };

  return (
    <Fragment>
      <Tooltip title={formatMessage({ id: "form.tips.borrow" })}>
        <Button onClick={handleBorrow} data-testid="TokenBorrowButton">
          <FormattedMessage id="form.buttons.borrow" />
        </Button>
      </Tooltip>
      <BorrowDialog
        onConfirm={handleBorrowConfirm}
        onCancel={handleBorrowCancel}
        open={isBorrowTokenDialogOpen}
        message="dialogs.borrow"
        testId="BorrowTokenDialogForm"
        initialValues={{
          account: "",
          expires: new Date().toISOString(),
        }}
      />
    </Fragment>
  );
};
