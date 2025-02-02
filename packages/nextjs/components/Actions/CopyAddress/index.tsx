import React, { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

interface CopyAddressProps {
  address: string;
  size?: number;
  color?: string;
  colorHover?: string;
  colorSuccess?: string;
  type?: string;
}

const CopyAddress: React.FC<CopyAddressProps> = ({ address, size, color, colorSuccess, type }) => {
  const [addressCopied, setAddressCopied] = useState<boolean>();
  const IconSuccessColor = colorSuccess ? colorSuccess : "green-300";
  const IconColor = color ? color : "blue-500";
  const IconColorHover = color ? color : "blue-200";
  const IconSize = size ? size : 6;
  const IconType = type ? type : "normal";
  return (
    <>
      {addressCopied ? (
        <CheckCircleIcon
          className={`ml-1.5 font-${IconType} text-${IconSuccessColor} h-${IconSize} w-${IconSize} cursor-default`}
          aria-hidden="true"
        />
      ) : (
        <CopyToClipboard
          text={address}
          onCopy={() => {
            setAddressCopied(true);
            setTimeout(() => {
              setAddressCopied(false);
            }, 800);
          }}
        >
          <DocumentDuplicateIcon
            className={`ml-1.5 font-${IconType} text-${IconColor} h-${IconSize} w-${IconSize} cursor-pointer group-hover:text-${IconColorHover}`}
            aria-hidden="true"
          />
        </CopyToClipboard>
      )}
    </>
  );
};

export default CopyAddress;
