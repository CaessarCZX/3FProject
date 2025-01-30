import React from "react";

interface BlockContainerWithTitleProps {
  title?: string;
  children: React.ReactNode;
}

const BlockContainerWithTitle: React.FC<BlockContainerWithTitleProps> = ({ title, children }) => (
  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    {title && (
      <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
        <h3 className="font-light text-xl text-black dark:text-white">{title}</h3>
      </div>
    )}
    <div className="p-7">{children}</div>
  </div>
);

export default BlockContainerWithTitle;
