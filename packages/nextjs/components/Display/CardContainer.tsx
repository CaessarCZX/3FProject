import React from "react";

type CardContainerProps = {
  title?: string;
  children: React.ReactNode;
  stylesTitle?: string;
  stylesContainer?: string;
};

export const CardContainer: React.FC<CardContainerProps> = ({ title, children, stylesTitle, stylesContainer }) => {
  return (
    <>
      <div className="card h-full bg-base-100 shadow-xl">
        <div className="card-body">
          {title && <h2 className={`card-title ${stylesTitle ?? ""}`}>{title}</h2>}
          <div className={`card-actions ${stylesContainer ?? ""}`}>{children}</div>
        </div>
      </div>
    </>
  );
};
