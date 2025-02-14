import { createContext, useContext, ReactNode, useState } from "react";
import CustomAlert from "../components/Alert";

type AlertType = "error" | "success" | "info";

interface AlertContextType {
  showAlert: (message: string, type: AlertType) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<{
    message: string;
    type: AlertType;
  } | null>(null);

  const showAlert = (message: string, type: AlertType) => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const hideAlert = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alert && (
        <div className="fixed top-4 right-4 z-50">
          <CustomAlert message={alert.message} type={alert.type} />
        </div>
      )}
    </AlertContext.Provider>
  );
}

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
