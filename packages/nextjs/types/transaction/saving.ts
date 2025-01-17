export interface PYT {
  paymentDay: string;
  amount: number;
}

export interface Commissions {
  paymentDay: string;
}

export interface Amount {
  $numberDecimal: string;
}

export interface MemberSaving {
  _id: string;
  userId: string;
  hash: string;
  amount: Amount;
  pyt: PYT[];
  commissions: Commissions;
  date: string;
  status: string;
}
