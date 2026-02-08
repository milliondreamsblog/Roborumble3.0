"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  IndianRupee,
  Users,
  Trophy,
  FileCheck,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  LogOut,
} from "lucide-react";

interface RegistrationData {
  _id: string;
  eventId?: {
    title: string;
    fees: number;
  };
  teamId?: {
    name: string;
    leaderId?: {
      username: string;
      email: string;
      phone?: string;
    };
  };
  paymentStatus: string;
  amountExpected?: number;
  amountPaid?: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  screenshotUrl?: string;
  userTransactionId?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    registrationId: string;
    action: "verify" | "reject";
  } | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchRegistrations();
    }
  }, [user, statusFilter]);

  async function checkAdminAuth() {
    try {
      const res = await fetch("/api/admin/me");
      if (!res.ok) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setUser(data.user);
    } catch (e) {
      router.push("/admin/login");
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (e) {
      console.error("Logout failed", e);
    }
  }

  async function fetchRegistrations() {
    if (!user) return;
    setIsRefreshing(true);
    try {
      const params = new URLSearchParams({
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const res = await fetch(`/api/admin/registrations?${params}`);
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Access denied");
        return;
      }

      setRegistrations(data.registrations || []);
    } catch (e) {
      console.error(e);
      setMessage("Failed to fetch registrations");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  // Action 1: Open Dialog
  function verifyPayment(registrationId: string, action: "verify" | "reject") {
    setConfirmDialog({ isOpen: true, registrationId, action });
  }

  // Action 2: Execute after confirmation
  async function executeVerify() {
    if (!confirmDialog) return;

    try {
      const notes =
        confirmDialog.action === "reject"
          ? window.prompt("Reason for rejection:")
          : undefined;

      const res = await fetch("/api/admin/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: confirmDialog.registrationId,
          action: confirmDialog.action,
          notes,
        }),
      });

      const data = await res.json();
      setMessage(data.message);
      fetchRegistrations();
    } catch (e) {
      console.error(e);
    } finally {
      setConfirmDialog(null);
    }
  }

  // Calculate stats
  const stats = {
    totalRegistrations: registrations.length,
    paidCount: registrations.filter((r) =>
      ["paid", "manual_verified"].includes(r.paymentStatus),
    ).length,
    pendingCount: registrations.filter((r) =>
      ["initiated", "pending", "manual_verification_pending"].includes(
        r.paymentStatus,
      ),
    ).length,
    totalRevenue: registrations
      .filter((r) => ["paid", "manual_verified"].includes(r.paymentStatus))
      .reduce((sum, r) => sum + (r.amountPaid || r.amountExpected || 0), 0),
  };

  if (loading)
    return <div className="text-white p-8">Loading admin panel...</div>;

  return (
    <div className="min-h-screen bg-[#020617] p-8 relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <LayoutDashboard className="text-cyan-400" /> Admin Dashboard
        </h1>
        <div className="flex gap-4">
          <button
            onClick={fetchRegistrations}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-mono text-sm uppercase transition-all"
          >
            <div className={isRefreshing ? "animate-spin" : ""}>⟳</div> Refresh
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 font-mono text-sm uppercase"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-cyan-500/10 border border-cyan-500 text-cyan-400 px-4 py-3 rounded-lg mb-6">
          {message}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FileCheck}
          label="Total Registrations"
          value={stats.totalRegistrations}
          color="cyan"
        />
        <StatCard
          icon={CheckCircle}
          label="Paid"
          value={stats.paidCount}
          color="green"
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={stats.pendingCount}
          color="yellow"
        />
        <StatCard
          icon={IndianRupee}
          label="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          color="emerald"
        />
      </div>

      {/* Filter */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 mb-6">
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="manual_verification_pending">
              Verification Pending
            </option>
            <option value="manual_verified">Manually Verified</option>
            <option value="initiated">Initiated</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="text-left text-gray-400 px-4 py-3">Team</th>
                <th className="text-left text-gray-400 px-4 py-3">Event</th>
                <th className="text-left text-gray-400 px-4 py-3">Contact</th>
                <th className="text-left text-gray-400 px-4 py-3">Amount</th>
                <th className="text-left text-gray-400 px-4 py-3">Proof</th>
                <th className="text-left text-gray-400 px-4 py-3">Status</th>
                <th className="text-left text-gray-400 px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {registrations.map((reg) => (
                <tr key={reg._id} className="hover:bg-gray-800/50">
                  <td className="px-4 py-4">
                    <p className="text-white font-medium">
                      {reg.teamId?.name || "Unknown"}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {reg.teamId?.leaderId?.username}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-white">
                    {reg.eventId?.title || "Unknown"}
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-gray-400 text-sm">
                      {reg.teamId?.leaderId?.email}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {reg.teamId?.leaderId?.phone}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-white">₹{reg.amountExpected || 0}</p>
                    {reg.amountPaid !== undefined && (
                      <p className="text-green-400 text-sm">
                        Paid: ₹{reg.amountPaid}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {reg.screenshotUrl ? (
                      <a
                        href={reg.screenshotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline text-sm flex items-center gap-1"
                      >
                        View Proof
                      </a>
                    ) : (
                      <span className="text-gray-600 text-sm">N/A</span>
                    )}
                    {reg.userTransactionId && (
                      <p className="text-gray-500 text-xs font-mono mt-1">
                        ID: {reg.userTransactionId}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={reg.paymentStatus} />
                  </td>
                  <td className="px-4 py-4">
                    {[
                      "initiated",
                      "pending",
                      "failed",
                      "manual_verification_pending",
                    ].includes(reg.paymentStatus) && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => verifyPayment(reg._id, "verify")}
                          className="p-2 bg-green-500/10 text-green-400 rounded hover:bg-green-500/20"
                          title="Verify Payment"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => verifyPayment(reg._id, "reject")}
                          className="p-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20"
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {registrations.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No registrations found with the selected filter.
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">
              Confirm{" "}
              {confirmDialog.action === "verify" ? "Approval" : "Rejection"}
            </h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to <strong>{confirmDialog.action}</strong>{" "}
              this registration?
              {confirmDialog.action === "verify"
                ? " This will mark the payment as paid and generate a QR code for the user."
                : " This will reject the payment proof."}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeVerify}
                className={`px-4 py-2 text-white rounded font-bold transition-colors ${
                  confirmDialog.action === "verify"
                    ? "bg-green-600 hover:bg-green-500"
                    : "bg-red-600 hover:bg-red-500"
                }`}
              >
                Confirm{" "}
                {confirmDialog.action === "verify" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof IndianRupee;
  label: string;
  value: number | string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    cyan: "text-cyan-400 bg-cyan-500/10",
    green: "text-green-400 bg-green-500/10",
    yellow: "text-yellow-400 bg-yellow-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
  };

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; bg: string }> = {
    paid: { color: "text-green-400", bg: "bg-green-500/10" },
    manual_verified: { color: "text-green-400", bg: "bg-green-500/10" },
    manual_verification_pending: {
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    }, // New status
    initiated: { color: "text-yellow-400", bg: "bg-yellow-500/10" },
    pending: { color: "text-yellow-400", bg: "bg-yellow-500/10" },
    failed: { color: "text-red-400", bg: "bg-red-500/10" },
    refunded: { color: "text-gray-400", bg: "bg-gray-500/10" },
  };

  const { color, bg } = config[status] || config.pending;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${bg} ${color}`}
    >
      {status.replace(/_/g, " ").toUpperCase()}
    </span>
  );
}
