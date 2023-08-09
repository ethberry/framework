import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { BigNumber, constants, Contract } from "ethers";

import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { useMetamaskValue } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";

import StakingCountersABI from "../../../../../../abis/mechanics/staking/stakingCounters.abi.json";
import { StakesInfoDialog } from "../dialog";

export interface IStakingView {
  contract: IContract;
}

export interface IStakingCounter {
  allUsers: string;
  allStakes: string;
  userStakes: string;
  ruleCounter: string;
}

export interface IStakingViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IStakingView;
}

export interface IStakeCounterDto {
  ruleId?: string;
  wallet?: string;
}

export const StakingViewDialog: FC<IStakingViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;

  const { contract } = initialValues;
  const { address, id } = contract;

  const emptyInfo = { allUsers: "0", allStakes: "0", userStakes: "0", ruleCounter: "0" };
  const [stakingInfo, setStakingInfo] = useState<IStakingCounter>(emptyInfo);

  const getStakingCounters = useMetamaskValue(
    async (values: IStakeCounterDto, web3Context: Web3ContextType) => {
      const contract = new Contract(address, StakingCountersABI, web3Context.provider?.getSigner());

      const counters: IStakingCounter = await contract.getCounters(
        values && values.wallet ? values.wallet : constants.AddressZero,
        values && values.ruleId ? values.ruleId : 0,
      );
      return {
        allUsers: BigNumber.from(counters.allUsers).toString(),
        allStakes: BigNumber.from(counters.allStakes).toString(),
        userStakes: BigNumber.from(counters.userStakes).toString(),
        ruleCounter: BigNumber.from(counters.ruleCounter).toString(),
      };
    },
    { success: false },
  );

  useEffect(() => {
    void getStakingCounters(null).then((info: IStakingCounter) => {
      setStakingInfo(info);
    });
  }, [address]);

  const handleConfirm = (): void => {
    onConfirm();
  };

  const [isStakesDialogOpen, setIsStakesDialogOpen] = useState(false);

  const handleStakeInfoCancel = (): void => {
    setIsStakesDialogOpen(false);
  };

  const handleStakeInfoConfirmed = async (values: IStakeCounterDto, _form: any): Promise<void> => {
    await getStakingCounters(values)
      .then((info: IStakingCounter) => {
        setStakingInfo(info);
      })
      .finally(() => {
        setIsStakesDialogOpen(false);
      });
  };

  const handleView = (): (() => void) => {
    return (): void => {
      setIsStakesDialogOpen(true);
    };
  };

  return (
    <ConfirmationDialog message="dialogs.view" onConfirm={handleConfirm} {...rest}>
      <IconButton onClick={handleView()}>
        <Visibility />
      </IconButton>
      <TableContainer component={Paper}>
        <Table aria-label="table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.allUsers" />
              </TableCell>
              <TableCell align="right">{stakingInfo.userStakes}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.allStakes" />
              </TableCell>
              <TableCell align="right">{stakingInfo.allStakes}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.userStakes" />
              </TableCell>
              <TableCell align="right">{stakingInfo.userStakes}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.ruleCounter" />
              </TableCell>
              <TableCell align="right">{stakingInfo.ruleCounter}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <StakesInfoDialog
        onCancel={handleStakeInfoCancel}
        onConfirm={handleStakeInfoConfirmed}
        open={isStakesDialogOpen}
        initialValues={{ contractId: id }}
      />
    </ConfirmationDialog>
  );
};
