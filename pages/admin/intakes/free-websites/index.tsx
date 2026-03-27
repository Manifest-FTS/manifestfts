import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import WPLanding from "../../../../components/layout/WPLanding";
import {
  FREE_WEBSITE_STATUS_OPTIONS,
  freeWebsiteStatusLabel,
} from "../../../../lib/freeWebsiteOptions";
import { SubmissionSummary } from "../../../../lib/freeWebsiteTypes";

const ADMIN_TOKEN_STORAGE_KEY = "manifest_free_website_admin_token";

export default function FreeWebsiteIntakeQueuePage() {
  const [adminToken, setAdminToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [submissions, setSubmissions] = useState<SubmissionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || "";
      setAdminToken(stored);
      setTokenInput(stored);
    }
  }, []);

  const loadSubmissions = async (tokenOverride?: string) => {
    const token = tokenOverride ?? adminToken;
    if (!token) {
      setError("Admin token is required.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const query = new URLSearchParams();
      if (search.trim()) query.set("q", search.trim());
      if (statusFilter) query.set("status", statusFilter);

      const response = await fetch(`/api/free-website/submissions?${query.toString()}`, {
        headers: {
          "x-admin-token": token,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to load submissions.");
        return;
      }

      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error(err);
      setError("Error loading submissions.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveTokenAndLoad = async () => {
    if (!tokenInput.trim()) {
      setError("Please enter an admin token.");
      return;
    }

    const token = tokenInput.trim();
    setAdminToken(token);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
    }

    await loadSubmissions(token);
  };

  useEffect(() => {
    if (adminToken) {
      loadSubmissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, adminToken]);

  const stats = useMemo(() => {
    const total = submissions.length;
    const ready = submissions.filter((item) => item.readinessForFulfillment).length;
    const converted = submissions.filter((item) => item.paidConversion).length;
    return { total, ready, converted };
  }, [submissions]);

  return (
    <WPLanding>
      <section className="py-16 px-4 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Free Website Intake Queue</h1>
              <p className="text-gray-600 mt-1">Manifest FTS operations: intake review, status triage, and fulfillment readiness.</p>
            </div>
            <Link href="/admin">
              <a className="text-sm underline text-gray-700">Back to Admin Hub</a>
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin token</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Enter FREE_WEBSITE_ADMIN_TOKEN"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All statuses</option>
                  {FREE_WEBSITE_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <button onClick={saveTokenAndLoad} className="w-full px-4 py-2 bg-black text-white rounded-md">
                  Load
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <input
                className="md:col-span-2 w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Search business, contact, email, goal"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button onClick={() => loadSubmissions()} className="px-4 py-2 border rounded-md">
                Search
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Tip: after entering a token, click <strong>Load</strong> (or it will auto-load once saved).
            </p>
            {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard label="Total" value={stats.total} />
            <StatCard label="Ready for fulfillment" value={stats.ready} />
            <StatCard label="Converted to paid" value={stats.converted} />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-3">Business</th>
                  <th className="text-left px-4 py-3">Contact</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Goal</th>
                  <th className="text-left px-4 py-3">Updated</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td className="px-4 py-3" colSpan={6}>
                      Loading...
                    </td>
                  </tr>
                )}
                {!isLoading && submissions.length === 0 && (
                  <tr>
                    <td className="px-4 py-3" colSpan={6}>
                      No submissions found.
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  submissions.map((item) => (
                    <tr key={item.id} className="border-t border-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-900">{item.businessName}</td>
                      <td className="px-4 py-3 text-gray-700">
                        <div>{item.contactName}</div>
                        <div className="text-xs text-gray-500">{item.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block text-xs rounded-full bg-gray-100 px-2 py-1">
                          {freeWebsiteStatusLabel(item.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{item.primaryGoal}</td>
                      <td className="px-4 py-3 text-gray-500">{new Date(item.updatedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/intakes/free-websites/${item.id}`}>
                          <a className="underline">Open</a>
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </WPLanding>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
