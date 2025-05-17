import { ReactNode } from "react";
interface alertProps {
  children: ReactNode;
  onClick: () => void;
  //
}

export const Alert = ({ children, onClick }: alertProps) => {
  return (
    <div className="alert alert-primary alert-dismissible" role="alert">
      {children}
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={onClick}
      ></button>
    </div>
  );
};
