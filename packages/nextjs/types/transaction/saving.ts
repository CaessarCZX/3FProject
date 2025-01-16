export interface PYT {
  paymentDay: string;
  amount: number;
}

export interface Commissions {
  paymentDay: string;
}

export interface MemberSaving {
  _id: string;
  userId: string;
  hash: string;
  amount: string;
  pyt: PYT[];
  commissions: Commissions;
  date: string;
  status: string;
}
