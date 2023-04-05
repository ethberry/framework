import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { constants, Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import type { IContract } from "@framework/types";
import { IUser, TokenType } from "@framework/types";
import { ITokenAssetComponent } from "@gemunion/mui-inputs-asset";
import { useUser } from "@gemunion/provider-user";
import { useMetamask } from "@gemunion/react-hooks-eth";

import ERC721MintBoxABI from "../../../../../abis/components/common/mint/erc721mystery.mintBox.abi.json";

import { IMintBoxDto, MintBoxDialog } from "./dialog";

export interface IMintBoxMenuItemProps {
  contract: IContract;
}

export const MintBoxMenuItem: FC<IMintBoxMenuItemProps> = props => {
  const {
    contract: { address, id: contractId, contractType, decimals },
  } = props;

  const user = useUser<IUser>();

  const [isMintBoxDialogOpen, setIsMintBoxDialogOpen] = useState(false);

  const handleMintBox = (): void => {
    setIsMintBoxDialogOpen(true);
  };

  const handleMintBoxCancel = (): void => {
    setIsMintBoxDialogOpen(false);
  };

  const metaFn = useMetamask((values: IMintBoxDto, web3Context: Web3ContextType) => {
    const templateComponent = values.template.components[0];

    const contractErc721Mystery = new Contract(
      templateComponent.contract.address,
      ERC721MintBoxABI,
      web3Context.provider?.getSigner(),
    );
    return contractErc721Mystery.mintBox(values.account, templateComponent.templateId) as Promise<any>;
  });

  const handleMintBoxConfirmed = async (values: IMintBoxDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsMintBoxDialogOpen(false);
    });
  };

  return (
    <Fragment>
      <MenuItem onClick={handleMintBox}>
        <ListItemIcon>
          <AddCircleOutlineIcon />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.mintBox" />
        </Typography>
      </MenuItem>
      <MintBoxDialog
        onCancel={handleMintBoxCancel}
        onConfirm={handleMintBoxConfirmed}
        open={isMintBoxDialogOpen}
        initialValues={{
          template: {
            components: [
              {
                tokenType: contractType,
                contractId,
                contract: {
                  decimals,
                  address,
                },
                templateId: 0,
                amount: contractType === TokenType.ERC20 ? constants.WeiPerEther.mul(1).toString() : "1", // default amount for ERC721-998-1155
              } as ITokenAssetComponent,
            ],
          } as any,
          account: user.profile.wallet,
        }}
      />
    </Fragment>
  );
};
