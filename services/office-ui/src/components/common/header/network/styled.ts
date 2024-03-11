import { Badge, ListItemIcon, SvgIcon } from "@mui/material";
import { SxProps, styled } from "@mui/material/styles";
import { Circle } from "@mui/icons-material";

export const spinnerMixin: SxProps = {
  svg: {
    color: "#FFFFFF",
  },
};

export const StyledBadge = styled(Badge)(({ theme }) => ({
  ".MuiBadge-badge": {
    minWidth: 12,
    height: 12,
    padding: 0,
    marginRight: theme.spacing(0.7),
    marginTop: theme.spacing(0.7),
  },
}));

export const StyledCircle = styled(Circle)({
  color: "#F44336",
  width: 12,
  height: 12,
});

export const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  color: theme.palette.common.black,
})) as typeof ListItemIcon;

export const StyledSvgIcon = styled(SvgIcon)({
  width: 24,
  height: 24,
}) as any;
