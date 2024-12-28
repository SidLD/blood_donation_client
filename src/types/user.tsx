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
    status: 'ACTIVE' | 'INACTIVE';
  }
  
  export interface DonorData {
    certified: Donor[];
    new: Donor[];
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
  

export interface IAdmin {
  _id?: string;
  profile?: Iimg;
  username: string;
  license: string;
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