import axios from "axios";
import { dataHeader } from "./helper";
import {  ApplicationType, EventType, BloodSupplyType, DonorType, AdminType, DonorLoginType } from "../types/interface";
import {  TransactionForm } from "@/types/transaction";

// Get the API URL from environment variable
console.log(import.meta.env.VITE_API_URL);

// **Super Admin Authentication API**
export const loginSuperAdmin = (data: AdminType) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/login-super-admin`, data)
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};


// **Admin Authentication API**
export const loginAdmin = (data: AdminType) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/login-admin`, data)
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const registerAdmin = (data: AdminType) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/register-admin`, data, dataHeader())
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

// Get Hospital
export const getHospitals = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/hospitals`, dataHeader())  
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

// Create Hospital
export const createHospital = (data: any) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/hospitals`,  data, dataHeader())
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const updateHospital = (id: string, data: any) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/hospitals/${id}`,  data, dataHeader())
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};
export const deleteHospital = (id:string) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}/hospitals/${id}`, dataHeader())  
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

// **Donor Authentication API**
export const loginDonor = (data: DonorLoginType) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/login-donor`, data)
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const getDonorSetting = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/donor/setting`, dataHeader())
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const registerDonor = (data: DonorType) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/register-donor`, data, dataHeader())
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const updateDonorSetting = (data: any) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/donor/setting`, data, dataHeader())
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const updateDonorPassword = (data: any) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/donor/password`, data, dataHeader())
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const getHospitalDonors = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/admin/donors`, dataHeader())  
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const getHospitalDonorsByCategory = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/admin/donors/category`, dataHeader())  
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

// **Application API**
export const createDonorApplication = (data: ApplicationType) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/donor/applications`, data, dataHeader())
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const getDonorApplications = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/donor/applications`, dataHeader())
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};
export const createHospitalApplication = (data: TransactionForm) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/hospital/application`, data, dataHeader())
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const getHospitalApplications = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/hospital/applications`, dataHeader())
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const getHospitalCalendar = (month: string, year: string) => {
  const payload = {
    month, year
  }
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/hospital/calendar`, {
        params: payload,
        ...dataHeader()
      })
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

// **Event API**
export const createEvent = (data: EventType) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/event`, data, dataHeader())
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const getEvents = (post_type:string = 'all') => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/events/${post_type}`, dataHeader())
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};
// Update an Event by ID
export const updateEvent = (id: string, data: EventType) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/event/${id}`, data, dataHeader())
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

// Delete an Event by ID
export const deleteEvent = (id: string) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}/event/${id}`, dataHeader())
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};
// **Blood Supply API**
export const createBloodSupply = (data: BloodSupplyType) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/blood-supplies`, data, dataHeader())
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const getBloodSupplies = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/blood-supplies`, dataHeader())
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const getNotifications = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/notifications`, dataHeader())
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

// **Guest Donor
// Create a new guest donor
export const createGuestDonor = (data: any) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/guest-donor`, data, dataHeader())  // Endpoint for creating a donor
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

// Get all guest donors
export const getGuestDonors = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/guest-donors`, dataHeader())  // Endpoint to fetch all donors
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

// Get a single guest donor by ID
export const getGuestDonorById = (id: string) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/guest-donors/${id}`, dataHeader())  // Endpoint for fetching a single donor by ID
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

// Update a guest donor by ID
export const updateGuestDonor = (id: string, data: any) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/guest-donors/${id}`, data, dataHeader())  // Endpoint for updating a donor
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

// Delete a guest donor by ID
export const deleteGuestDonor = (id: string) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}/guest-donors/${id}`, dataHeader())  // Endpoint for deleting a donor
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

// **Transaction API**
// Create Transaction
export const createDonorTransaction = (data: TransactionForm) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/donor/application`, data, dataHeader())  // Added dataHeader()
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

// Get All Transactions
export const getTransactions = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/hospital/applications`, dataHeader())  // Added dataHeader()
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

// Update Transaction
export const updateTransaction = (applicationId: string, data:TransactionForm) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/application/${applicationId}`, data, dataHeader())  // Added dataHeader()
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

// Update Transaction Status
export const updateTransactionStatus = (applicationId: string, status: string) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/application-status/${applicationId}`, { status }, dataHeader())  // Added dataHeader()
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

// Delete Transaction
export const deleteTransaction = (applicationId: string) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}/application-status/${applicationId}`, dataHeader())  // Added dataHeader()
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

// Generate Donor Number
export const generateDonorNumber = (data: { donorId: string }) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/generate-donor-number`, data, dataHeader())  // Added dataHeader()
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

// Get Donor Number
export const getDonorNumber = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/generate-donor-number`, dataHeader())  // Added dataHeader()
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

// Delete Donor Number
export const deleteDonorNumber = (data: { donorId: string }) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}/generate-donor-number`, { data, ...dataHeader() })  // Added dataHeader()
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};


