import React from "react";
import { MdPlayArrow } from "react-icons/md";
import { useGlobalState } from "~~/services/store/store";

/**
 * Site footer
 */
const Footer = () => {
  const mexicanPesoPrice = useGlobalState(state => state.mexicanPeso.price);

  return (
    // py-5 deleted for root Div
    <div className="min-h-0 px-1 mb-11 lg:mb-0 z-99">
      <div>
        <div className="fixed flex justify-between items-center w-full z-10 p-4 lg:px-14 bottom-0 left-0 pointer-events-none">
          <div className="flex flex-col md:flex-row gap-2 pointer-events-auto">
            {mexicanPesoPrice > 0 && (
              <div>
                <div className="flex p-2 rounded-md items-center justify-center bg-gray-300 dark:bg-boxdark-2 btn-sm font-medium gap-1 select-none">
                  <span>USD</span>
                  <MdPlayArrow />
                  <span>MXN</span>
                  <span>{mexicanPesoPrice.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full"></div>
    </div>
  );
};

export default Footer;
