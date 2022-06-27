// import { FC } from "react";
// import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
// import { FormattedMessage } from "react-intl";
// import { format, formatDistance, parseISO } from "date-fns";
//
// import { humanReadableDateTimeFormat } from "@gemunion/constants";
// import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
// import { IStake } from "@framework/types";
//
// export interface IStakingViewDialogProps {
//   open: boolean;
//   onCancel: () => void;
//   onConfirm: () => void;
//   initialValues: IStake;
// }
//
// export const StakingViewDialog: FC<IStakingViewDialogProps> = props => {
//   const { initialValues, onConfirm, ...rest } = props;
//
//   const { id, deposit, reward, duration, penalty, recurrent, stakingStatus, ruleId } = initialValues;
//
//   const dateStart = new Date(startTimestamp);
//   const dateFinish = new Date(new Date(dateStart.getTime() + +duration));
//
//   const handleConfirm = (): void => {
//     onConfirm();
//   };
//
//   return (
//     <ConfirmationDialog message="dialogs.view" onConfirm={handleConfirm} {...rest}>
//       {/* TODO i18n */}
//       <Typography variant="h5">Staking #{id}</Typography>
//       <TableContainer component={Paper}>
//         <Table aria-label="vesting table">
//           <TableBody>
//             <TableRow>
//               <TableCell component="th" scope="row">
//                 <FormattedMessage id="pages.erc20-vesting.view.address" />
//               </TableCell>
//               {/* link to scanner */}
//               <TableCell align="right">{address}</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell component="th" scope="row">
//                 <FormattedMessage id="pages.erc20-vesting.view.beneficiary" />
//               </TableCell>
//               {/* link to scanner */}
//               <TableCell align="right">{beneficiary}</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell component="th" scope="row">
//                 <FormattedMessage id="pages.erc20-vesting.view.startTimestamp" />
//               </TableCell>
//               <TableCell align="right">{format(parseISO(startTimestamp), humanReadableDateTimeFormat)}</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell component="th" scope="row">
//                 <FormattedMessage id="pages.erc20-vesting.view.duration" />
//               </TableCell>
//               <TableCell align="right">{formatDistance(new Date(+duration), 0, { addSuffix: true })}</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell component="th" scope="row">
//                 <FormattedMessage id="pages.erc20-vesting.view.finish" />
//               </TableCell>
//               <TableCell align="right">{formatDistance(dateFinish, Date.now(), { addSuffix: true })}</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell component="th" scope="row">
//                 <FormattedMessage id="pages.erc20-vesting.view.contractTemplate" />
//               </TableCell>
//               <TableCell align="right">{contractTemplate}</TableCell>
//             </TableRow>
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </ConfirmationDialog>
//   );
// };
