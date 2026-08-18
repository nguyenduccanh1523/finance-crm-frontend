import { useEffect, useState, type ReactNode } from "react";
import { CheckCircle2, Clock3, Coins, Edit3, FolderKanban, Plus } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { workManagementApi } from "@/features/work-management/work-management.api";

type Language = "vi" | "en";
type Member = { id: string; membershipId?: string; name: string; avatarUrl?: string };

const words = {
  vi: { loading: "Đang tải chi tiết dự án…", owner: "Người phụ trách", members: "Thành viên", budget: "Ngân sách", estimate: "Ước tính", actual: "Đã chấm công", completed: "Hoàn thành", entries: "Bản chấm công", taskList: "Công việc trong dự án", noTasks: "Dự án chưa có công việc. Hãy thêm công việc đầu tiên.", page: "Trang", previous: "Trước", next: "Sau", addTask: "Thêm công việc", editProject: "Chỉnh sửa", save: "Lưu", cancel: "Huỷ", taskName: "Tên công việc", taskDescription: "Mô tả công việc", status: "Trạng thái", estimateMinutes: "Ước tính (phút)", assignees: "Người thực hiện", selectStatus: "Chọn trạng thái", selectMembers: "Chọn người thực hiện", created: "Đã thêm công việc vào dự án.", updated: "Đã cập nhật dự án.", projectStatus: "Trạng thái dự án", projectName: "Tên dự án", projectDescription: "Mô tả", budgetVnd: "Ngân sách (VND)", dueDate: "Hạn hoàn thành", time: "Thời gian" },
  en: { loading: "Loading project details…", owner: "Owner", members: "Members", budget: "Budget", estimate: "Estimated", actual: "Logged", completed: "Completed", entries: "Timesheets", taskList: "Project tasks", noTasks: "This project has no tasks yet. Add the first one.", page: "Page", previous: "Previous", next: "Next", addTask: "Add task", editProject: "Edit project", save: "Save", cancel: "Cancel", taskName: "Task name", taskDescription: "Task description", status: "Status", estimateMinutes: "Estimate (minutes)", assignees: "Assignees", selectStatus: "Select status", selectMembers: "Select assignees", created: "Task added to project.", updated: "Project updated.", projectStatus: "Project status", projectName: "Project name", projectDescription: "Description", budgetVnd: "Budget (VND)", dueDate: "Due date", time: "Time" },
} as const;

const labels: Record<Language, Record<string, string>> = {
  vi: { PLANNING: "Lập kế hoạch", ACTIVE: "Đang hoạt động", ON_HOLD: "Tạm dừng", COMPLETED: "Hoàn thành", TODO: "Cần làm", IN_PROGRESS: "Đang thực hiện", IN_REVIEW: "Đang xem xét", DONE: "Đã xong", CANCELLED: "Đã huỷ" },
  en: { PLANNING: "Planning", ACTIVE: "Active", ON_HOLD: "On hold", COMPLETED: "Completed", TODO: "To do", IN_PROGRESS: "In progress", IN_REVIEW: "In review", DONE: "Done", CANCELLED: "Cancelled" },
};

const minutes = (value?: number | string) => { const total = Number(value || 0); return `${Math.floor(total / 60)}h ${total % 60}m`; };
const money = (value: unknown, code = "VND") => new Intl.NumberFormat("vi-VN", { style: "currency", currency: code, maximumFractionDigits: 0 }).format(Number(value || 0) / 100);
const initials = (name?: string) => name?.split(" ").filter(Boolean).slice(-2).map((part) => part[0]).join("").toUpperCase() || "?";

export function ProjectDetailDrawer({ projectId, open, onOpenChange, language, metadata, onChanged }: { projectId?: string; open: boolean; onOpenChange: (value: boolean) => void; language: Language; metadata?: any; onChanged?: () => void }) {
  const [detail, setDetail] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [addingTask, setAddingTask] = useState(false);
  const [projectForm, setProjectForm] = useState<Record<string, string>>({});
  const [taskForm, setTaskForm] = useState<Record<string, string | string[]>>({});
  const t = words[language];
  const status = (value?: string) => labels[language][value || ""] || value || "—";
  const load = async (page = 1) => {
    if (!projectId) return;
    setLoading(true);
    try {
      const response = await workManagementApi.projectDetail(projectId, page);
      setDetail(response);
      const budgetCents = response.project.budget_cents ?? response.project.budgetCents;
      setProjectForm({ name: response.project.name || "", description: response.project.description || "", statusId: response.project.status_id || response.project.statusId || "", budget: budgetCents === null || budgetCents === undefined ? "" : String(Number(budgetCents) / 100), estimateMinutes: String(response.project.estimate_minutes ?? response.project.estimateMinutes ?? ""), memberMembershipIds: (response.members || []).map((member: Member) => member.membershipId).filter(Boolean).join(",") });
    } catch (error: any) { toast.error(error?.response?.data?.message || "Unable to load project detail."); }
    finally { setLoading(false); }
  };
  useEffect(() => { if (open) { setEditing(false); setAddingTask(false); void load(); } }, [open, projectId]);
  const saveProject = async () => {
    if (!projectId) return;
    try {
      await workManagementApi.update("projects", projectId, { name: projectForm.name, description: projectForm.description || undefined, statusId: projectForm.statusId || undefined, budgetCents: projectForm.budget ? String(Math.round(Number(projectForm.budget) * 100)) : null, estimateMinutes: projectForm.estimateMinutes ? Number(projectForm.estimateMinutes) : null, memberMembershipIds: projectForm.memberMembershipIds ? projectForm.memberMembershipIds.split(",").filter(Boolean) : undefined });
      toast.success(t.updated); setEditing(false); await load(); onChanged?.();
    } catch (error: any) { toast.error(error?.response?.data?.message || "Unable to update project."); }
  };
  const saveTask = async () => {
    if (!projectId) return;
    try {
      await workManagementApi.create("tasks", { projectId, title: taskForm.title, description: taskForm.description || undefined, statusId: taskForm.statusId || undefined, estimateMinutes: taskForm.estimateMinutes ? Number(taskForm.estimateMinutes) : undefined, assigneeMembershipIds: taskForm.assigneeMembershipIds || undefined });
      toast.success(t.created); setTaskForm({}); setAddingTask(false); await load(); onChanged?.();
    } catch (error: any) { toast.error(error?.response?.data?.message || "Unable to create task."); }
  };
  const project = detail?.project;
  const summary = detail?.summary;
  const logs = detail?.timesheets;
  const pagination = detail?.tasks?.pagination;
  const members: Member[] = metadata?.members || [];
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="!left-auto !right-0 !top-0 !z-[100] !h-dvh !w-full !max-w-[1100px] !translate-x-0 !translate-y-0 !gap-0 overflow-y-auto rounded-none border-l p-0 sm:rounded-none">
      {loading && !detail ? <div className="p-8 text-sm text-muted-foreground">{t.loading}</div> : project && <>
        <div className="relative min-h-[188px] shrink-0 overflow-hidden border-b bg-gradient-to-br from-primary/25 via-violet-500/15 to-cyan-500/20 p-6 pr-16">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/25 blur-2xl" />
          <div className="relative flex gap-4"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30"><FolderKanban className="h-7 w-7" /></div><div className="min-w-0"><div className="mb-2 flex flex-wrap items-center gap-2"><DialogTitle className="truncate text-2xl font-bold">{project.name}</DialogTitle><Badge className="border-0 bg-emerald-500/15 text-emerald-500">{status(project.statusName)}</Badge></div><DialogDescription className="max-w-xl text-sm">{project.description || "—"}</DialogDescription></div></div>
          <div className="relative mt-5 flex flex-wrap gap-2"><Button size="sm" variant="secondary" onClick={() => setEditing(!editing)}><Edit3 className="mr-2 h-4 w-4" />{t.editProject}</Button><Button size="sm" onClick={() => setAddingTask(!addingTask)}><Plus className="mr-2 h-4 w-4" />{t.addTask}</Button></div>
        </div>
        <div className="space-y-6 p-5 md:p-6">
          {editing && <Card className="border-primary/30 bg-primary/[0.04] p-4"><div className="grid gap-3 sm:grid-cols-2"><Field label={t.projectName}><Input value={projectForm.name || ""} onChange={(event) => setProjectForm({ ...projectForm, name: event.target.value })} /></Field><Field label={t.projectStatus}><select className="h-10 w-full rounded-lg border bg-background px-3" value={projectForm.statusId || ""} onChange={(event) => setProjectForm({ ...projectForm, statusId: event.target.value })}>{(metadata?.projectStatuses || []).map((item: any) => <option key={item.id} value={item.id}>{status(item.name)}</option>)}</select></Field><Field label={t.budgetVnd}><Input inputMode="numeric" value={projectForm.budget || ""} onChange={(event) => setProjectForm({ ...projectForm, budget: event.target.value })} /></Field><Field label={t.estimateMinutes}><Input type="number" min="0" value={projectForm.estimateMinutes || ""} onChange={(event) => setProjectForm({ ...projectForm, estimateMinutes: event.target.value })} /></Field><Field label={t.members}><select multiple className="h-24 w-full rounded-lg border bg-background px-3" value={(projectForm.memberMembershipIds || "").split(",").filter(Boolean)} onChange={(event) => setProjectForm({ ...projectForm, memberMembershipIds: Array.from(event.currentTarget.selectedOptions, (option) => option.value).join(",") })}>{members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></Field><Field label={t.projectDescription}><Input value={projectForm.description || ""} onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })} /></Field></div><div className="mt-4 flex justify-end gap-2"><Button variant="outline" onClick={() => setEditing(false)}>{t.cancel}</Button><Button onClick={() => void saveProject()}>{t.save}</Button></div></Card>}
          {addingTask && <Card className="border-violet-500/30 bg-violet-500/[0.05] p-4"><div className="mb-3 flex items-center gap-2 font-semibold text-violet-400"><Plus className="h-4 w-4" />{t.addTask}</div><div className="grid gap-3 sm:grid-cols-2"><Field label={t.taskName}><Input value={String(taskForm.title || "")} onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })} /></Field><Field label={t.status}><select className="h-10 w-full rounded-lg border bg-background px-3" value={String(taskForm.statusId || "")} onChange={(event) => setTaskForm({ ...taskForm, statusId: event.target.value })}><option value="">{t.selectStatus}</option>{(metadata?.taskStatuses || []).map((item: any) => <option key={item.id} value={item.id}>{status(item.name)}</option>)}</select></Field><Field label={t.estimateMinutes}><Input type="number" min="0" value={String(taskForm.estimateMinutes || "")} onChange={(event) => setTaskForm({ ...taskForm, estimateMinutes: event.target.value })} /></Field><Field label={t.assignees}><select multiple className="h-20 w-full rounded-lg border bg-background px-3" value={(taskForm.assigneeMembershipIds as string[]) || []} onChange={(event) => setTaskForm({ ...taskForm, assigneeMembershipIds: Array.from(event.currentTarget.selectedOptions, (option) => option.value) })}>{members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></Field><div className="sm:col-span-2"><Field label={t.taskDescription}><Input value={String(taskForm.description || "")} onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })} /></Field></div></div><div className="mt-4 flex justify-end gap-2"><Button variant="outline" onClick={() => setAddingTask(false)}>{t.cancel}</Button><Button onClick={() => void saveTask()}>{t.addTask}</Button></div></Card>}
          <section className="grid gap-3 sm:grid-cols-2"><Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-4"><p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.owner}</p><MemberAvatar member={{ name: project.ownerName, avatarUrl: project.ownerAvatarUrl }} /></Card><Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-transparent p-4"><p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.members}</p><div className="flex items-center"><div className="flex -space-x-2">{detail.members?.slice(0, 5).map((member: Member) => <Avatar key={member.name} className="h-9 w-9 border-2 border-background"><AvatarImage src={member.avatarUrl} /><AvatarFallback className="bg-cyan-500/20 text-xs text-cyan-400">{initials(member.name)}</AvatarFallback></Avatar>)}</div><span className="ml-3 text-sm text-muted-foreground">{detail.members?.length || 0} {t.members.toLowerCase()}</span></div></Card></section>
          <section className="grid gap-3 grid-cols-2 lg:grid-cols-4"><Metric color="blue" icon={<Coins />} label={t.budget} value={money(project.budget_cents ?? project.budgetCents, project.currency)} /><Metric color="violet" icon={<Clock3 />} label={t.estimate} value={minutes(project.estimate_minutes ?? project.estimateMinutes ?? summary?.estimateMinutes)} /><Metric color="cyan" icon={<Clock3 />} label={t.actual} value={minutes(logs?.totalMinutes)} /><Metric color="emerald" icon={<CheckCircle2 />} label={t.completed} value={`${summary?.completedTaskCount || 0}/${summary?.taskCount || 0}`} /></section>
          <Card className="overflow-hidden rounded-2xl border-violet-500/15"><div className="flex items-center justify-between border-b bg-gradient-to-r from-violet-500/[0.10] to-transparent p-4"><div><h3 className="font-semibold">{t.taskList}</h3><p className="text-xs text-muted-foreground">{logs?.entryCount || 0} {t.entries.toLowerCase()}</p></div><Badge variant="secondary">{summary?.taskCount || 0}</Badge></div><div className="overflow-x-auto"><table className="min-w-[720px] w-full text-sm"><thead className="bg-muted/50 text-left text-xs text-muted-foreground"><tr><th className="px-4 py-3">{t.taskName}</th><th className="px-4 py-3">{t.status}</th><th className="px-4 py-3">{t.time}</th><th className="px-4 py-3">{t.assignees}</th><th className="px-4 py-3">{t.dueDate}</th></tr></thead><tbody>{detail.tasks?.data?.map((task: any) => <tr key={task.id} className="border-t transition-colors hover:bg-violet-500/[0.04]"><td className="px-4 py-3"><p className="font-medium">{task.title}</p><p className="mt-1 max-w-xs truncate text-xs text-muted-foreground">{task.description || "—"}</p></td><td className="px-4 py-3"><Badge variant="secondary">{status(task.statusName)}</Badge></td><td className="px-4 py-3 text-xs">{minutes(task.actual_minutes ?? task.actualMinutes)} <span className="text-muted-foreground">/ {minutes(task.estimate_minutes ?? task.estimateMinutes)}</span></td><td className="px-4 py-3"><div className="flex -space-x-2">{(task.assignees || []).slice(0, 4).map((member: Member) => <Avatar key={member.name} title={member.name} className="h-7 w-7 border-2 border-background"><AvatarImage src={member.avatarUrl} /><AvatarFallback className="bg-violet-500/20 text-[10px] text-violet-400">{initials(member.name)}</AvatarFallback></Avatar>)}{!(task.assignees || []).length && <span className="text-xs text-muted-foreground">—</span>}</div></td><td className="px-4 py-3 text-xs">{task.due_at ? new Date(task.due_at).toLocaleDateString(language === "vi" ? "vi-VN" : "en-GB") : "—"}</td></tr>)}{!detail.tasks?.data?.length && <tr><td className="px-4 py-12 text-center text-muted-foreground" colSpan={5}>{t.noTasks}</td></tr>}</tbody></table></div>{pagination && pagination.totalPages > 1 && <div className="flex items-center justify-between border-t p-3"><span className="text-sm text-muted-foreground">{t.page} {pagination.page}/{pagination.totalPages}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={pagination.page === 1 || loading} onClick={() => void load(pagination.page - 1)}>{t.previous}</Button><Button size="sm" variant="outline" disabled={pagination.page === pagination.totalPages || loading} onClick={() => void load(pagination.page + 1)}>{t.next}</Button></div></div>}</Card>
        </div>
      </>}
    </DialogContent>
  </Dialog>;
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="grid gap-1.5 text-sm font-medium"><span>{label}</span>{children}</label>; }
function MemberAvatar({ member }: { member: Partial<Member> }) { return <div className="flex items-center gap-3"><Avatar className="h-11 w-11 ring-2 ring-primary/30"><AvatarImage src={member.avatarUrl} /><AvatarFallback className="bg-primary/20 font-semibold text-primary">{initials(member.name)}</AvatarFallback></Avatar><div><p className="font-semibold">{member.name || "—"}</p><p className="text-xs text-muted-foreground">Project owner</p></div></div>; }
function Metric({ icon, label, value, color }: { icon: ReactNode; label: string; value: string; color: "blue" | "violet" | "cyan" | "emerald" }) { const tones = { blue: "border-blue-500/25 from-blue-500/15 text-blue-400", violet: "border-violet-500/25 from-violet-500/15 text-violet-400", cyan: "border-cyan-500/25 from-cyan-500/15 text-cyan-400", emerald: "border-emerald-500/25 from-emerald-500/15 text-emerald-400" }; return <Card className={`border bg-gradient-to-br to-transparent p-4 ${tones[color]}`}><div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{icon}{label}</div><p className="text-lg font-bold text-foreground">{value}</p></Card>; }
