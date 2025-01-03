import { Donor, IAdmin } from "./user";

export interface Transaction {
  _id?: string;
  hospital: IAdmin;
  datetime: Date;
  status: 'PENDING' | 'SUCCESS' | 'REJECT';
  remarks: string;
  user?: Donor
  guestDonor?: Donor,
  type: 'MEMBER-APPOINTMENT' | 'GUEST-APPOINTMENT'
}

export interface TransactionForm {
  _id?: string;
  hospital: string;
  datetime: Date;
  status: 'PENDING' | 'SUCCESS' | 'REJECT' | 'APPROVED';
  remarks: string;
  user?: string
}
