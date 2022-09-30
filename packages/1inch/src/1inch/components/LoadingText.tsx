import { ReactNode, FC } from "react";
import { CircularProgress } from "@mui/material";

export interface ILoadingTextProps {
  text: ReactNode;
  loading?: boolean;
}

export const LoadingText: FC<ILoadingTextProps> = props => {
  const { text, loading } = props;
  return text && !loading ? (
    <>{text}</>
  ) : (
    <span
      style={{
        width: "20px",
        height: "8px",
        display: "inline-block",
        position: "relative",
      }}
    >
      <CircularProgress />
    </span>
  );
};
