import { ReactNode } from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

interface RequireAuthProps {
  children: ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const jwt = Cookies.get("jwt");

  if (!jwt) {
    return <Navigate to="/" />;
  }
  return children;
};
