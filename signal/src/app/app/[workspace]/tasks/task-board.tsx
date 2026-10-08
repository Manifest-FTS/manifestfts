'use client';
import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { ArrowRight, CalendarDays, Link2, ListChecks, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { saveTask, setTaskStatus, deleteTask } from '@/app/app/_actions/data';
import type { ActionState } from '@/app/app/_actions/workspace';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Dropdown, DropdownContent, DropdownItem, DropdownLabel, DropdownSeparator, DropdownTrigger } from '@/components/ui/dropdown';
import { Field, Input, Select, Textarea, describedBy } from '@/components/ui/field';
import { SubmitButton } from '@/components/ui/submit-button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { PriorityBadge, CATEGORY_LABEL } from '@/components/app/task-badges';
import { useActionToast, toastResult } from '@/components/app/use-action-toast';
import { formatShortDate } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { TaskCategory, TaskEvidence, TaskPriority, TaskStatus } from '@/lib/db/schema';

export interface TaskItem {
  id: string; title: string; description: string; status: TaskStatus; priority: TaskPriority; category: TaskCategory;
  evidence: TaskEvidence | null; assignee: { id: string; name: string } | null; dueDate: string | null; automatic: boolean; createdAt: string;
}

const COLUMNS: { id: TaskStatus; label: string }[] = [{ id: 'todo', label: 'To do' }, { id: 'in_progress', label: 'In progress' }, { id: 'done', label: 'Done' }];

function evidenceHref(slug: string, e: TaskEvidence) {
  switch (e.kind) {
    case 'audit': return `/app/${slug}/readiness?audit=${e.refId}`;
    case 'prompt': return `/app/${slug}/prompts/${e.refId}`;
    case 'claim': return `/app/${slug}/accuracy?status=inaccurate`;
    case 'source': return `/app/${slug}/sources`;
  }
}

function TaskDialog({ open, onOpenChange, workspaceId, members, task }: { open: boolean; onOpenChange: (o: boolean) => void; workspaceId: string; members: { id: string; name: string }[]; task?: TaskItem }) {
  const [state, action] = useActionState<ActionState, FormData>(saveTask, {});
  useActionToast(state, () => onOpenChange(false));
  const e = state.fieldErrors ?? {};
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={task ? 'Edit task' : 'New task'} wide>
        <form action={action} className="grid gap-4" key={task?.id ?? 'new'}>
          <input type="hidden" name="workspaceId" value={workspaceId} />
          {task && <input type="hidden" name="taskId" value={task.id} />}
          <Field label="Title" htmlFor="t-title" error={e.title}><Input id="t-title" name="title" required defaultValue={task?.title} {...describedBy('t-title', e.title)} /></Field>
          <Field label="Details" htmlFor="t-desc" optional><Textarea id="t-desc" name="description" rows={4} defaultValue={task?.description} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Priority" htmlFor="t-priority"><Select id="t-priority" name="priority" defaultValue={task?.priority ?? 'medium'}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></Select></Field>
            <Field label="Category" htmlFor="t-category"><Select id="t-category" name="category" defaultValue={task?.category ?? 'content'}>{Object.entries(CATEGORY_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select></Field>
            <Field label="Assignee" htmlFor="t-assignee" error={e.assigneeId}><Select id="t-assignee" name="assigneeId" defaultValue={task?.assignee?.id ?? ''}><option value="">Unassigned</option>{members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</Select></Field>
            <Field label="Due date" htmlFor="t-due" optional><Input id="t-due" name="dueDate" type="date" defaultValue={task?.dueDate?.slice(0, 10)} /></Field>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
            <SubmitButton pendingLabel="Saving…">{task ? 'Save task' : 'Create task'}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function TaskBoard({ tasks, workspaceId, slug, members, canEdit }: { tasks: TaskItem[]; workspaceId: string; slug: string; members: { id: string; name: string }[]; canEdit: boolean }) {
  const params = useSearchParams();
  const [dialog, setDialog] = React.useState<{ open: boolean; task?: TaskItem }>({ open: params.get('new') === '1' && canEdit });
  const [detail, setDetail] = React.useState<TaskItem | null>(() => tasks.find((t) => t.id === params.get('task')) ?? null);
  const [category, setCategory] = React.useState<TaskCategory | 'all'>('all');
  const [optimistic, move] = React.useOptimistic(tasks, (state, u: { id: string; status: TaskStatus }) => state.map((t) => (t.id === u.id ? { ...t, status: u.status } : t)));
  const [, startTransition] = React.useTransition();

  const setStatus = (id: string, status: TaskStatus) => startTransition(async () => {
    move({ id, status });
    const r = await setTaskStatus(workspaceId, id, status);
    if (r.error) toastResult(r);
  });

  const visible = optimistic.filter((t) => category === 'all' || t.category === category);

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1" role="radiogroup" aria-label="Category">
          {(['all', ...Object.keys(CATEGORY_LABEL)] as (TaskCategory | 'all')[]).map((c) => (
            <button key={c} type="button" role="radio" aria-checked={category === c} onClick={() => setCategory(c)}
              className={cn('h-8 rounded-full border px-3 text-[12.5px] font-medium transition-colors', category === c ? 'border-fg bg-fg text-bg' : 'border-border bg-panel text-fg-muted hover:text-fg')}>
              {c === 'all' ? 'All' : CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>
        {canEdit && <Button size="sm" className="ml-auto" onClick={() => setDialog({ open: true })}><Plus aria-hidden />New task</Button>}
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-panel border border-border bg-panel"><EmptyState icon={<ListChecks />} title="No tasks yet" description="Recommendations appear after runs and readiness audits. You can also add your own." action={canEdit ? <Button onClick={() => setDialog({ open: true })}><Plus aria-hidden />New task</Button> : undefined} /></div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {COLUMNS.map((col) => {
            const items = visible.filter((t) => t.status === col.id);
            return (
              <section key={col.id} aria-labelledby={`col-${col.id}`} className="flex flex-col rounded-panel border border-border bg-bg-muted/40 p-2">
                <h2 id={`col-${col.id}`} className="flex items-center gap-2 px-2 py-2 text-[13px] font-semibold text-fg">
                  {col.label}<span className="rounded-full bg-panel px-1.5 text-[11px] font-medium text-fg-muted ring-1 ring-border tabular">{items.length}</span>
                </h2>
                <ul className="grid gap-2">
                  {items.length === 0 && <li className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-[12.5px] text-fg-faint">No tasks</li>}
                  {items.map((t) => (
                    <li key={t.id} className="group rounded-xl border border-border bg-panel p-3.5 shadow-card transition hover:shadow-raised">
                      <div className="flex items-start gap-2">
                        <button type="button" onClick={() => setDetail(t)} className={cn('min-w-0 flex-1 text-left text-[13.5px] font-medium leading-snug text-fg hover:text-accent', t.status === 'done' && 'text-fg-muted line-through decoration-fg-faint')}>{t.title}</button>
                        {canEdit && (
                          <Dropdown>
                            <DropdownTrigger asChild><Button variant="ghost" size="icon-sm" className="-mr-1.5 -mt-1 shrink-0" aria-label={`Actions for ${t.title}`}><MoreHorizontal aria-hidden /></Button></DropdownTrigger>
                            <DropdownContent>
                              <DropdownLabel>Move to</DropdownLabel>
                              {COLUMNS.filter((c) => c.id !== t.status).map((c) => <DropdownItem key={c.id} onSelect={() => setStatus(t.id, c.id)}><ArrowRight aria-hidden />{c.label}</DropdownItem>)}
                              <DropdownSeparator />
                              <DropdownItem onSelect={() => setDialog({ open: true, task: t })}><Pencil aria-hidden />Edit</DropdownItem>
                              <DropdownItem destructive onSelect={() => startTransition(async () => toastResult(await deleteTask(workspaceId, t.id)))}><Trash2 aria-hidden />{t.automatic ? 'Dismiss' : 'Delete'}</DropdownItem>
                            </DropdownContent>
                          </Dropdown>
                        )}
                      </div>
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        <PriorityBadge priority={t.priority} />
                        <Badge tone="outline">{CATEGORY_LABEL[t.category]}</Badge>
                        {t.dueDate && <span className="inline-flex items-center gap-1 text-[11.5px] text-fg-muted"><CalendarDays className="size-3" aria-hidden />{formatShortDate(t.dueDate)}</span>}
                        {t.assignee && <span className="ml-auto" title={t.assignee.name}><Avatar name={t.assignee.name} size={22} /><span className="sr-only">Assigned to {t.assignee.name}</span></span>}
                      </div>
                      {t.evidence && (
                        <Link href={evidenceHref(slug, t.evidence)} className="mt-2.5 flex items-center gap-1.5 truncate rounded-lg bg-bg-subtle px-2 py-1.5 text-[11.5px] text-fg-muted hover:text-fg">
                          <Link2 className="size-3 shrink-0" aria-hidden /><span className="truncate">{t.evidence.label}</span>
                        </Link>
                      )}
                      {canEdit && t.status !== 'done' && (
                        <button type="button" onClick={() => setStatus(t.id, t.status === 'todo' ? 'in_progress' : 'done')} className="mt-2.5 text-[12px] font-medium text-accent hover:underline">
                          {t.status === 'todo' ? 'Start' : 'Mark done'}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      <TaskDialog open={dialog.open} onOpenChange={(open) => setDialog((d) => ({ ...d, open }))} workspaceId={workspaceId} members={members} task={dialog.task} />
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        {detail && (
          <DialogContent title={detail.title} wide description={<span className="flex flex-wrap gap-1.5 pt-1"><PriorityBadge priority={detail.priority} /><Badge tone="outline">{CATEGORY_LABEL[detail.category]}</Badge>{detail.automatic && <Badge tone="accent">Recommended by Signal</Badge>}</span>}>
            <p className="whitespace-pre-line text-[14px] leading-relaxed text-fg-soft">{detail.description || 'No details.'}</p>
            {detail.evidence && (
              <div className="mt-5 rounded-xl border border-border bg-bg-subtle p-4">
                <p className="text-[12px] font-medium uppercase tracking-wider text-fg-faint">Evidence</p>
                <p className="mt-1 text-[14px] text-fg">{detail.evidence.label}</p>
                <div className="mt-2 flex flex-wrap gap-4">
                  <Link href={evidenceHref(slug, detail.evidence)} className="inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:underline">View evidence <ArrowRight className="size-3.5" aria-hidden /></Link>
                  {detail.evidence.kind === 'prompt' && <Link href={`/app/${slug}/content?prompt=${detail.evidence.refId}`} className="inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:underline">Create a content brief <ArrowRight className="size-3.5" aria-hidden /></Link>}
                </div>
              </div>
            )}
            <dl className="mt-5 grid grid-cols-2 gap-3 text-[13px]">
              <div><dt className="text-fg-muted">Assignee</dt><dd className="text-fg">{detail.assignee?.name ?? 'Unassigned'}</dd></div>
              <div><dt className="text-fg-muted">Due</dt><dd className="text-fg">{detail.dueDate ? formatShortDate(detail.dueDate) : 'No date'}</dd></div>
            </dl>
            {canEdit && (
              <DialogFooter>
                <Button variant="secondary" onClick={() => { setDialog({ open: true, task: detail }); setDetail(null); }}><Pencil aria-hidden />Edit</Button>
                {detail.status !== 'done' && <Button onClick={() => { setStatus(detail.id, 'done'); setDetail(null); }}>Mark done</Button>}
              </DialogFooter>
            )}
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
