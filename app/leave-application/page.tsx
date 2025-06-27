"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import RequireAuth from "../../components/RequireAuth";
import { approveLeave, getLeaves } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";

const LeaveApplication = () => {
  const { token } = useAuth();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approveLoading, setApproveLoading] = useState<string | null>(null);
  const [approveError, setApproveError] = useState("");

  const fetchLeaves = () => {
    if (!token) return;
    setLoading(true);
    getLeaves(token)
      .then(setLeaves)
      .catch(() => setError("Failed to load leave requests"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeaves();
    // eslint-disable-next-line
  }, [token]);

  const handleApprove = async (id: string) => {
    if (!token) return;
    setApproveLoading(id);
    setApproveError("");
    try {
      await approveLeave(id, token);
      fetchLeaves();
    } catch (err: any) {
      setApproveError(err.message || "Failed to approve leave");
    } finally {
      setApproveLoading(null);
    }
  };

  return (
    <RequireAuth>
      <div className="mx-auto mt-10 max-w-4xl rounded-lg bg-white dark:bg-gray-800 p-8 shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-center">All Leave Requests</h2>
        {loading && <div>Loading leave requests...</div>}
        {error && <div className="text-red-600 text-center font-medium mb-4">{error}</div>}
        {!loading && !error && leaves.length === 0 && (
          <div className="text-center">No leave requests found.</div>
        )}
        {!loading && !error && leaves.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  {Object.keys(leaves[0]).map((key) => (
                    <th key={key} className="px-4 py-2 border-b capitalize text-left">{key.replace(/_/g, " ")}</th>
                  ))}
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id || leave._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    {Object.values(leave).map((value, idx) => (
                      <td key={idx} className="px-4 py-2 border-b">{String(value)}</td>
                    ))}
                    <td className="px-4 py-2 border-b">
                      {leave.status === "PENDING" ? (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(leave.id || leave._id)}
                          disabled={approveLoading === (leave.id || leave._id)}
                        >
                          {approveLoading === (leave.id || leave._id) ? "Approving..." : "Approve"}
                        </Button>
                      ) : (
                        <span className="text-green-600 font-semibold">{leave.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {approveError && <div className="text-red-600 text-center font-medium mt-4">{approveError}</div>}
          </div>
        )}
      </div>
    </RequireAuth>
  );
};

export default LeaveApplication;
