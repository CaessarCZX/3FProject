import React from "react";

interface CardBoxProps {
  children: React.ReactNode;
  className?: string;
}

const CardBox: React.FC<CardBoxProps> = ({ children, className }) => (
  <div
    className={`rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark ${
      className ?? ""
    }`}
  >
    {children}
  </div>
);

export default CardBox;
