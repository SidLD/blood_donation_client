export interface Donor {
    _id?: string;
    username: string;
    donorId: string;
    address?: string;
    bloodType: string;
    phoneNumber?: string;
    email?: string;
    sex?: string;
    age?: number;
    doMedicalCondition: boolean;
    donorNumbers: donorNumber
    status: 'ACTIVE' | 'INACTIVE';
  }

export interface donorNumber{
  status: string;
  _id: string;
  donorId: string;
  isUsed: boolean;
  isVerified: boolean;
  hospital: {
    name: string;
  };
};
export interface IHospital {
  _id?: string;
  profile?: Iimg;
  username: string;
  license: string;
  address: string;
  password?: string;
}

export interface IAdmin {
  _id?: string;
  profile?: Iimg;
  username: string;
  license: string;
  status: 'PENDING' | 'APPROVED' |  'REJECT';
  hospital: IHospital;
  address: string;
  password?: string;
}

export interface Iimg {
  _id: string | undefined;
  path: string;
  name: string;
  imageType: string;
  fullPath: string;
}