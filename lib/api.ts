import axios from "axios";

const API_URL = "http://localhost:250/api";

export async function signup(data: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await axios.post(`${API_URL}/users/signup`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

export async function signin(data: { email: string; password: string }) {
  const res = await axios.post(`${API_URL}/users/signin`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

export async function getProfile(token: string) {
  const res = await axios.get(`${API_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getAllUsers(token: string) {
  const res = await axios.get(`${API_URL}/users/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getUserById(id: string, token: string) {
  const res = await axios.get(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateUser(id: string, data: any, token: string) {
  const res = await axios.patch(`${API_URL}/users/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function deleteUser(id: string, token: string) {
  const res = await axios.delete(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function changePassword(
  data: { currentPassword: string; newPassword: string },
  token: string,
) {
  const res = await axios.post(`${API_URL}/users/change-password`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function getProfileAxios(token: string) {
  const res = await axios.get(`${API_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// Leave APIs
export async function createLeave(data: any, token: string) {
  const res = await axios.post(`${API_URL}/leave`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getLeaves(token: string) {
  const res = await axios.get(`${API_URL}/leave`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getLeaveById(id: string, token: string) {
  const res = await axios.get(`${API_URL}/leave/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function approveLeave(id: string, token: string) {
  const res = await axios.patch(
    `${API_URL}/leave/${id}/approve`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
}

export async function deleteLeave(id: string, token: string) {
  const res = await axios.delete(`${API_URL}/leave/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// Timesheets APIs
export async function createTimesheet(data: any, token: string) {
  const res = await axios.post(`${API_URL}/timesheets/create`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getAllTimesheets(token: string) {
  const res = await axios.get(`${API_URL}/timesheets/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getTimesheetById(id: string, token: string) {
  const res = await axios.get(`${API_URL}/timesheets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateTimesheet(id: string, data: any, token: string) {
  const res = await axios.patch(`${API_URL}/timesheets/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteTimesheet(id: string, token: string) {
  const res = await axios.delete(`${API_URL}/timesheets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function exportTimesheetsExcel(
  startDate: string,
  endDate: string,
  token: string,
) {
  const res = await axios.get(`${API_URL}/timesheets/export/excel`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { startDate, endDate },
    responseType: "blob",
  });
  return res.data;
}

export async function getMyTimesheets(token: string) {
  const res = await axios.get(`${API_URL}/timesheets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
