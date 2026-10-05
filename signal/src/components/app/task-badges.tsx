import { Badge } from '@/components/ui/badge';
import type { TaskPriority, TaskStatus, TaskCategory } from '@/lib/db/schema';

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const map = { high: ['danger', 'High'], medium: ['warning', 'Medium'], low: ['neutral', 'Low'] } as const;
  const [tone, label] = map[priority];
  return <Badge tone={tone} dot className="shrink-0">{label}</Badge>;
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  const map = { todo: ['neutral', 'To do'], in_progress: ['accent', 'In progress'], done: ['success', 'Done'] } as const;
  const [tone, label] = map[status];
  return <Badge tone={tone}>{label}</Badge>;
}

export const CATEGORY_LABEL: Record<TaskCategory, string> = { content: 'Content', technical: 'Technical', schema: 'Structured data', authority: 'Authority', accuracy: 'Accuracy' };
