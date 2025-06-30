import axios from "axios";

const API_URL = "http://localhost:250/api";

export async function signup(data: {
  name: string;
  email: string;
  password: string;
  role?: string | string[];
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

export async function approveLeave(
  id: string,
  token: string,
  status: string = "APPROVED",
) {
  const res = await axios.patch(
    `${API_URL}/leave/${id}/approve`,
    { status },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
}

export async function rejectLeave(id: string, token: string) {
  const res = await axios.patch(
    `${API_URL}/leave/${id}/approve`,
    { status: "REJECTED" },
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

export async function getAllLeaves(token: string) {
  const res = await axios.get(`${API_URL}/leave/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// Timesheets APIs
export async function createTimesheet(data: any, token: string) {
  // console.log("createTimesheet called with:", { data, token: token ? "exists" : "missing" });
  // console.log("API URL:", `${API_URL}/timesheets/create`);
  // console.log("Token (first 20 chars):", token ? token.substring(0, 20) + "..." : "no token");
  // console.log("Headers:", {
  //   "Content-Type": "application/json",
  //   Authorization: `Bearer ${token}`,
  // });

  try {
    const res = await axios.post(`${API_URL}/timesheets/create`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("createTimesheet success:", res.data);
    return res.data;
  } catch (error: any) {
    // console.error("createTimesheet error details:", {
    //   status: error.response?.status,
    //   statusText: error.response?.statusText,
    //   data: error.response?.data,
    //   headers: error.response?.headers,
    // });
    throw error;
  }
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

export async function updateTimesheetStatus(
  timesheetId: string,
  status: "pending" | "completed",
  token: string,
) {
  const res = await axios.patch(
    `${API_URL}/timesheets/${timesheetId}/status`,
    { status },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
}

export async function updateUserRole(
  id: string,
  roles: string[],
  token: string,
) {
  const res = await axios.patch(
    `${API_URL}/users/${id}/role`,
    { role: roles },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
}

// Notice APIs
export async function getAllNotices(token: string) {
  const res = await axios.get(`${API_URL}/notice`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getNoticeById(id: string, token: string) {
  const res = await axios.get(`${API_URL}/notice/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function createNotice(data: any, token: string) {
  const res = await axios.post(`${API_URL}/notice`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function updateNotice(id: string, data: any, token: string) {
  const res = await axios.patch(`${API_URL}/notice/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function deleteNotice(id: string, token: string) {
  const res = await axios.delete(`${API_URL}/notice/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// Project APIs
export async function createProject(data: any, token: string) {
  const res = await axios.post(`${API_URL}/projects`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function getAllProjects(token: string) {
  const res = await axios.get(`${API_URL}/projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getProjectById(id: string, token: string) {
  const res = await axios.get(`${API_URL}/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateProject(id: string, data: any, token: string) {
  const res = await axios.patch(`${API_URL}/projects/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function deleteProject(id: string, token: string) {
  const res = await axios.delete(`${API_URL}/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function respondToProject(
  projectId: string,
  action: "accept" | "reject",
  token: string,
) {
  const res = await axios.post(
    `${API_URL}/projects/${projectId}/respond`,
    { action },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
}
