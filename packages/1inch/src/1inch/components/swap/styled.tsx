import { Box, Button, ButtonProps, Paper, PaperProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledPaperContainer = styled(({ children, component, ...rest }: PaperProps<any>) => (
  <Paper component={component} {...rest}>
    {children}
  </Paper>
))`
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.spacing(3)};
  margin: ${({ theme }) => theme.spacing(10, "auto")};
  width: 400px;
`;

export const StyledPaper = styled(({ children, ...rest }: PaperProps) => <Paper {...rest}>{children}</Paper>)`
  padding: ${({ theme }) => theme.spacing(2)};
  width: 100%;
`;

export const StyledSwapContainer = styled(Box)`
  position: absolute;
  top: 5px;
  bottom: 5px;
  left: 5px;
  right: 5px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  transition: all 500ms ease;
  overflow: hidden;
  border-radius: 20px;
  background: white;
`;

export const StyledSwapHeader = styled(Box)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
`;

export const StyledSwapHeaderItem = styled(Box)`
  font-weight: bolder;
  opacity: 1;
`;

export const StyledSwapFormContainer = styled(Box)`
  position: relative;
  width: 100%;
  margin-top: 20px;
`;

export const StyledSwapFormDexInfoContainer = styled(Box)`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 20px;
  font-size: 0.7rem;
`;

export const StyledSwapFormDexInfoTitle = styled(Box)`
  font-weight: bold;
  width: 50%;
`;

export const StyledSwapFormDexInfoToggle = styled(Box)`
  cursor: pointer;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const StyledSwapFormDexInfoToggleActionText = styled(Box)`
  color: rgba(0, 0, 0, 0.3);
`;

export const StyledSwapFormMetaContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  font-size: 0.6rem;
  color: rgba(0, 0, 0, 0.5);
  margin-top: 20px;
`;

export const StyledButtonGroup = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 5px;
  margin-top: 15px;
`;

export const StyledButton = styled(Button)<ButtonProps & { light?: boolean }>`
  cursor: pointer;
  padding: 15px;
  margin: 5px 0;
  width: calc(100% - 30px);
  border-radius: 10px;
  background: ${({ light }) => (light ? "transparent" : "black")};
  border: 1px solid black;
  color: ${({ light }) => (light ? "black" : "white")};
`;
