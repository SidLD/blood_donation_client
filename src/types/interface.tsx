export interface DonorType {
    _id: string;
    profile?: IimgType;
    username: string;
    donorId: string;
    address: string;
    password: string;
    phoneNumber?: string;
    email?: string;
    sex?: string;
    age?: number;
    doMedicalCondition?: boolean;
  }

  export interface DonorLoginType {
    username: string;
    donorId: string;
    password: string;
  }
  
  export interface IimgType {
    _id: string;
    user: DonorType;
    path: string;
    name: string;
    imageType: string;
    fullPath: string;
  }
  
  export interface ApplicationType {
    _id: string;
    user: DonorType | IGuestDonorType;
    date: Date;
    hospital: IHospitalType;
  }
  
  export interface IGuestDonorType {
    _id: string;
    profile?: IimgType;
    username: string;
    address: string;
    phoneNumber: string;
    email: string;
    sex: string;
    age: number;
    doMedicalCondition: boolean;
  }
  
  export interface IHospitalType {
    _id: string;
    user: DonorType | IGuestDonorType;
    date: Date;
  }
  
  export interface EventType {
    _id?: string;
    title: string;
    description: string;
    date: string;
    imgUrl: string;
    location: string;
    user?: AdminType
  }
  
  export interface AdminType {
    _id: string;
    username: string;
    license: string;
    address: string;
    password: string;
    profile?: IimgType;
  }
  
  export interface BloodSupplyType {
    _id: string;
    date: Date;
    quantity: number;
    bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
    hospital: string;
    donor: string;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  }
  
  export interface NotificationType {
    _id: string;
    user: DonorType;
    path: string;
    title: string;
    description: string;
  }
  