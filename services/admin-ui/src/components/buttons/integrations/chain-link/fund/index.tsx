import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { Savings } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { FormattedMessage } from "react-intl";

import { useMetamask } from "@gemunion/react-hooks-eth";
import LinkSol from "@framework/core-contracts/artifacts/contracts/ThirdParty/LinkToken.sol/LinkToken.json";

import { ChainLinkFundDialog, IChainLinkFundDto } from "./dialog";

export const ChainLinkFundButton: FC = () => {
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false);
  // const [output, setOutput] = useState<string>("");

  const metaFn = useMetamask(async (values: IChainLinkFundDto, web3Context: Web3ContextType) => {
    // https://docs.chain.link/docs/link-token-contracts/
    const contract = new Contract(process.env.LINK_ADDR, LinkSol.abi, web3Context.provider?.getSigner());
    return contract.transfer(values.contract.address, values.amount) as Promise<void>;
  });

  // const ref = useRef({} as Record<string, string>);

  // const loadTokenBalance = useMetamaskValue(
  //   async (token: string, web3Context: Web3ContextType) => {
  //     if (token && web3Context.account) {
  //       let balance: BigNumber;
  //
  //       // if (ref.current[token.address]) {
  //       //   return ref.current[token.address];
  //       // }
  //       console.log("token", token);
  //       console.log("web3Context.account", web3Context.account);
  //
  //       if (token === constants.AddressZero) {
  //         balance = await web3Context.provider!.getBalance(web3Context.account!);
  //       } else {
  //         const erc20Contract = new Contract(token, ERC20SimpleSol.abi, web3Context.provider!.getSigner());
  //         balance = await erc20Contract.balanceOf(web3Context.account);
  //         console.log("balance", balance);
  //       }
  //
  //       const rtnBalance = formatUnits(balance, BigNumber.from(18));
  //       ref.current[token] = rtnBalance;
  //
  //       return rtnBalance;
  //     }
  //   },
  //   { success: false },
  // );

  // useEffect(() => {
  //   loadTokenBalance(process.env.LINK_ADDR).catch(console.error);
  // });
  // console.log("ref", ref);

  const handleFund = (): void => {
    setIsFundDialogOpen(true);
  };

  const handleFundConfirm = async (values: IChainLinkFundDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsFundDialogOpen(false);
    });
  };

  const handleFundCancel = () => {
    setIsFundDialogOpen(false);
  };

  return (
    <Fragment>
      <Button variant="outlined" startIcon={<Savings />} onClick={handleFund} data-testid="ChainLinkFundButton">
        <FormattedMessage id="form.buttons.fund" />
      </Button>
      <ChainLinkFundDialog
        onCancel={handleFundCancel}
        onConfirm={handleFundConfirm}
        open={isFundDialogOpen}
        initialValues={{
          contractId: 0,
          contract: {
            address: "",
          },
          amount: "0",
        }}
      />
    </Fragment>
  );
};
