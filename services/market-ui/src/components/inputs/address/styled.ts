import { Paper, PaperProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export interface IStyledPaperProps extends PaperProps {
  outlined?: boolean;
}

export const StyledPaper = styled(Paper, { shouldForwardProp: prop => prop !== "outlined" })<IStyledPaperProps>(
  ({ outlined, theme }) => ({
    padding: outlined ? theme.spacing(0, 2) : 0,
  }),
);
