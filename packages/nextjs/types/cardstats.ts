import React from "react";
import { HeroIcon } from "./heroicon";

export type ContentStatsType = {
  icon: HeroIcon;
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
};

export interface CardDataStatsProps {
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: React.ReactNode;
}
