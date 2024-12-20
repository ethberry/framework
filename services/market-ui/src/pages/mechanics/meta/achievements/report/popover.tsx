import { FC, MouseEvent, useState } from "react";
import { FormattedMessage } from "react-intl";
import { IconButton, Popover, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { Help } from "@mui/icons-material";

import { formatItem } from "@framework/exchange";
import { IAchievementItemReport, IAchievementRule } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { StyledPopoverWrapper, StyledTable } from "./styled";

export interface IAchievementInfoProps {
  rule: IAchievementRule;
  count: IAchievementItemReport;
}

export const AchievementInfoPopover: FC<IAchievementInfoProps> = props => {
  const { rule, count } = props;

  // const levelsRedeemed = achievementRule.levels.filter(lvl => lvl.redemptions!.length > 0);
  // const levelReached = achievementRule.levels.filter(lvl => lvl.amount <= count.count);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "achievement-info" : undefined;

  return (
    <StyledPopoverWrapper>
      <IconButton aria-describedby={id} onClick={handleClick}>
        <Help />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <StyledTable aria-label="rule parameters">
          <TableBody>
            <TableRow key={1}>
              <TableCell>
                <FormattedMessage id={`pages.achievements.info.description`} />
              </TableCell>
              <TableCell>
                <RichTextDisplay data={rule.description} />
              </TableCell>
            </TableRow>
            <TableRow key={2}>
              <TableCell>
                <FormattedMessage id={`pages.achievements.info.contract`} />
              </TableCell>
              <TableCell>
                <Typography>{rule.contract ? rule.contract.title : "any"}</Typography>
              </TableCell>
            </TableRow>
            <TableRow key={3}>
              <TableCell>
                <FormattedMessage id={`pages.achievements.info.event`} />
              </TableCell>
              <TableCell>
                <Typography>{rule.eventType ? rule.eventType : "any"}</Typography>
              </TableCell>
            </TableRow>
            <TableRow key={4}>
              <TableCell>
                <FormattedMessage id={`pages.achievements.info.items`} />
              </TableCell>
              <TableCell>
                <Typography>{formatItem(rule.item)}</Typography>
              </TableCell>
            </TableRow>
            {rule.levels.reverse().map(level => (
              <TableRow key={level.achievementLevel}>
                <TableCell>
                  <FormattedMessage
                    id={`pages.achievements.info.level`}
                    values={{
                      level: level.achievementLevel.toString(),
                      achieved: count && level.amount <= count.count ? "achieved" : "",
                      redeemed: level.redemptions!.length ? "redeemed" : "",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography>{`${level.title}, get: ${formatItem(level.reward)}`}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </Popover>
    </StyledPopoverWrapper>
  );
};
// {Object.keys(props).map(key => (
//   <TableRow key={key}>
//     <TableCell>
//       <FormattedMessage id={`form.labels.${key}`} />
//     </TableCell>
//     <TableCell>{Array.isArray(props[key]) ? props[key].join(", ") || "—" : props[key]}</TableCell>
//   </TableRow>
// ))}
