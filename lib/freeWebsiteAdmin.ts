import type { NextApiRequest, NextApiResponse } from "next";

const ADMIN_TOKEN_ENV_KEY = "FREE_WEBSITE_ADMIN_TOKEN";

export function getConfiguredAdminToken(): string {
  return (process.env[ADMIN_TOKEN_ENV_KEY] || "").trim();
}

export function assertAdminApiAccess(
  req: NextApiRequest,
  res: NextApiResponse
): boolean {
  const configuredToken = getConfiguredAdminToken();

  if (!configuredToken) {
    res.status(500).json({
      error:
        "Admin access is not configured. Set FREE_WEBSITE_ADMIN_TOKEN in the environment.",
    });
    return false;
  }

  const headerToken = (req.headers["x-admin-token"] || "")
    .toString()
    .trim();
  const queryToken = (req.query.adminToken || "").toString().trim();
  const provided = headerToken || queryToken;

  if (!provided || provided !== configuredToken) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }

  return true;
}
