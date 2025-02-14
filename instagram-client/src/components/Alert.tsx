import { Alert as MuiAlert } from "@mui/material";
type AlertProps = {
  message: string;
  type: "error" | "success" | "info";
};

function CustomAlert({ message, type }: AlertProps) {
  return <MuiAlert severity={type}>{message}</MuiAlert>;
}

export default CustomAlert;
