import React from "react";
interface props {
  button: string;
  onClick: () => void;
}
export const Button = ({ button, onClick }: props) => {
  return (
    <button className="btn btn-primary" onClick={onClick}>
      {" "}
      {button}
    </button>
  );
};
