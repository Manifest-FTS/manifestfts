import Link from "next/link";
import { useEffect, useState } from "react";
import WPLanding from "../../components/layout/WPLanding";

const ADMIN_TOKEN_STORAGE_KEY = "manifest_free_website_admin_token";

export default function ManifestAdminHubPage() {
  const [tokenInput, setTokenInput] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || "";
      setTokenInput(stored);
    }
  }, []);

  const handleSaveToken = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, tokenInput.trim());
    }
  };

  return (
    <WPLanding>
      <section className="py-16 px-4 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-900">Manifest FTS Admin</h1>
          <p className="text-gray-600 mt-2">
            Internal operations hub for Manifest FTS. Start with intake and free website fulfillment workflows.
          </p>

          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Admin token</label>
            <div className="flex gap-2 flex-wrap">
              <input
                type="password"
                className="flex-1 min-w-[260px] px-3 py-2 border border-gray-300 rounded-md"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter FREE_WEBSITE_ADMIN_TOKEN"
              />
              <button onClick={handleSaveToken} className="px-4 py-2 bg-black text-white rounded-md">
                Save
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-lg font-semibold text-gray-900">Intake Operations</h2>
              <p className="text-sm text-gray-600 mt-1">
                Review all incoming free website intakes, triage status, and manage fulfillment readiness.
              </p>
              <Link href="/admin/intakes/free-websites">
                <a className="inline-block mt-4 underline">Open Free Website Intake Queue</a>
              </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-lg font-semibold text-gray-900">Future Modules</h2>
              <ul className="text-sm text-gray-600 mt-2 list-disc pl-5 space-y-1">
                <li>Managed hosting operations</li>
                <li>Project delivery tracking</li>
                <li>Cross-service CRM views</li>
                <li>Automation and AI draft tooling</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </WPLanding>
  );
}
