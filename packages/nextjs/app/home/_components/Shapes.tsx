import React from "react";

const Shapes: React.FC = () => (
  <>
    <svg
      className="absolute bottom-72 right-[2%] -z-10 md:right-24 text-[#FFFBEF] dark:text-slate-800 dark:text-opacity-30"
      width="104"
      height="104"
      viewBox="0 0 104 104"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="52" cy="52" r="52" fill="currentColor" />
    </svg>

    <svg
      className="absolute bottom-0 right-1/2 translate-x-1/2 md:right-12 md:translate-x-0 text-[#CDD4D3] dark:text-slate-800 dark:text-opacity-30 -z-10"
      width="710"
      height="458"
      viewBox="0 0 710 458"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="355" cy="355" r="355" fill="currentColor" />
      <defs>
        <linearGradient id="paint0_linear_1_4250" x1="355" y1="0" x2="355" y2="710" gradientUnits="userSpaceOnUse">
          <stop stopColor="#303741" />
          <stop offset="1" stopColor="#0E1115" />
        </linearGradient>
      </defs>
    </svg>
  </>
);

export default Shapes;
