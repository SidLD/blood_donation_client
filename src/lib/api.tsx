import axios from "axios";
import { dataHeader } from "./helper";
import {  ApplicationType, EventType, BloodSupplyType, DonorType, AdminType, DonorLoginType } from "../types/interface";

// Get the API URL from environment variable
console.log(import.meta.env.VITE_API_URL);

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

// **Application API**
export const createApplication = (data: ApplicationType) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/applications`, data, dataHeader())
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const getApplications = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/applications`, dataHeader())
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

export const getEvents = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/events`, dataHeader())
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
