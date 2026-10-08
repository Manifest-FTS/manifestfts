// Minimal RFC 9309 robots.txt evaluator: group selection by user-agent token, longest-match
// wins between Allow/Disallow, Allow wins ties, and `*` / `$` wildcards are supported.

interface Rule {
  allow: boolean;
  pattern: string;
}

interface Group {
  agents: string[];
  rules: Rule[];
}

export interface RobotsFile {
  groups: Group[];
  sitemaps: string[];
}

export function parseRobots(body: string): RobotsFile {
  const groups: Group[] = [];
  const sitemaps: string[] = [];
  let current: Group | null = null;
  let lastWasAgent = false;

  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const field = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();

    if (field === 'user-agent') {
      if (!current || !lastWasAgent) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
    } else if (field === 'allow' || field === 'disallow') {
      lastWasAgent = false;
      if (!current) continue;
      // An empty Disallow means "allow everything" and adds no rule.
      if (value === '' && field === 'disallow') continue;
      current.rules.push({ allow: field === 'allow', pattern: value });
    } else if (field === 'sitemap') {
      sitemaps.push(value);
    } else {
      lastWasAgent = false;
    }
  }
  return { groups, sitemaps };
}

function patternToRegExp(pattern: string) {
  const anchored = pattern.endsWith('$');
  const body = (anchored ? pattern.slice(0, -1) : pattern)
    .split('*')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  return new RegExp(`^${body}${anchored ? '$' : ''}`);
}

function selectGroups(robots: RobotsFile, agent: string) {
  const token = agent.toLowerCase();
  const specific = robots.groups.filter((g) => g.agents.includes(token));
  if (specific.length) return { groups: specific, matchedAgent: agent };
  const wildcard = robots.groups.filter((g) => g.agents.includes('*'));
  return { groups: wildcard, matchedAgent: wildcard.length ? '*' : null };
}

export function evaluateRobots(robots: RobotsFile, agent: string, path = '/') {
  const { groups, matchedAgent } = selectGroups(robots, agent);
  const rules = groups.flatMap((g) => g.rules);
  let best: Rule | null = null;
  for (const rule of rules) {
    if (!patternToRegExp(rule.pattern).test(path)) continue;
    if (!best || rule.pattern.length > best.pattern.length || (rule.pattern.length === best.pattern.length && rule.allow)) best = rule;
  }
  return {
    allowed: best ? best.allow : true,
    matchedAgent,
    rule: best ? `${best.allow ? 'Allow' : 'Disallow'}: ${best.pattern}` : null,
    /** The selected group restricts at least one path (used to report "partial" access). */
    restricted: rules.some((r) => !r.allow && r.pattern !== ''),
  };
}
