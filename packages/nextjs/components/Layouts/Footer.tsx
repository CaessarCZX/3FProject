import React from "react";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useGlobalState } from "~~/services/store/store";

/**
 * Site footer
 */
const Footer = () => {
  const mexicanPesoPrice = useGlobalState(state => state.mexicanPeso.price);

  return (
    // py-5 deleted for root Div
    <div className="min-h-0 px-1 mb-11 lg:mb-0">
      <div>
        <div className="fixed flex justify-between items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-none">
          <div className="flex flex-col md:flex-row gap-2 pointer-events-auto">
            {mexicanPesoPrice > 0 && (
              <div>
                <div className="btn btn-primary btn-sm font-normal gap-1 cursor-auto">
                  <CurrencyDollarIcon className="h-4 w-4" />
                  <span>{`USD - MXN ${mexicanPesoPrice.toFixed(2)}`}</span>
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
