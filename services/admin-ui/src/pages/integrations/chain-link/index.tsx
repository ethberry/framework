import { FC, useState } from "react";
import { Button, Grid } from "@mui/material";
import { Paid } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import LinkSol from "@framework/core-contracts/artifacts/contracts/ThirdParty/LinkToken.sol/LinkToken.json";

import { FundLinkDialog, IFundLinkDto } from "./fund";

export const ChainLink: FC = () => {
  const [isFundLinkDialogOpen, setIsFundLinkDialogOpen] = useState(false);

  const handleFundLink = (): void => {
    setIsFundLinkDialogOpen(true);
  };

  const handleFundLinkCancel = (): void => {
    setIsFundLinkDialogOpen(false);
  };

  const meta = useMetamask(async (values: IFundLinkDto, web3Context: Web3ContextType) => {
    // https://docs.chain.link/docs/link-token-contracts/
    const contract = new Contract(process.env.LINK_ADDR, LinkSol.abi, web3Context.provider?.getSigner());
    return contract.transfer(values.address, values.amount) as Promise<void>;
  });

  const handleFundLinkConfirmed = async (values: IFundLinkDto): Promise<void> => {
    await meta(values).finally(() => {
      setIsFundLinkDialogOpen(false);
    });
  };

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "chain-link"]} />

      <PageHeader message="pages.chain-link.title" />

      <Button variant="outlined" startIcon={<Paid />} onClick={handleFundLink} data-testid="FundLinkButton">
        <FormattedMessage id="form.buttons.fund" />
      </Button>

      <FundLinkDialog
        onCancel={handleFundLinkCancel}
        onConfirm={handleFundLinkConfirmed}
        open={isFundLinkDialogOpen}
        initialValues={{
          contractId: 0,
          address: "",
          amount: "",
        }}
      />
    </Grid>
  );
};
