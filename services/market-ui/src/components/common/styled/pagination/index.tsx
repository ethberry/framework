import { Pagination } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledPagination = styled(Pagination)(({ theme }) => ({
  marginTop: theme.spacing(2),
})) as typeof Pagination;
