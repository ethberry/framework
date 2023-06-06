import { styled } from "@mui/material/styles";
import { Box, IconButton, IconButtonProps, Paper, Typography } from "@mui/material";
import { blueGrey, common, grey, indigo } from "@mui/material/colors";

export const StyledWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
`;

export const StyledPaper = styled(Paper)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  max-width: 52em;
  margin: 1em auto;
  padding: 1em;
  background-color: ${grey[100]};
  box-shadow: none;
`;

export const StyledIconButton = styled(({ isSelected: _, ...props }: IconButtonProps & { isSelected: boolean }) => (
  <IconButton {...props}>{props.children}</IconButton>
))`
  border-radius: 0.35em;
  margin: 0.35em;
  padding: 1em 1.5em;
  width: 1em;
  height: 3em;

  ${({ isSelected }) =>
    isSelected
      ? `
        background-color: ${indigo[500]};
        color: ${common.white};
        &:hover {
          background-color: ${blueGrey[200]};
        }
      `
      : `
        background-color: ${common.white};
        color: ${indigo[500]};
        &:hover {
          background-color: ${blueGrey[200]};
        }
        &:disabled {
          background-color: ${common.white};
          color: ${indigo[200]};
        }
  `}
`;

export const StyledTypography = styled(Typography)`
  text-align: center;
`;
