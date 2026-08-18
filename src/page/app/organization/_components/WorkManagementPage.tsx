import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Edit3, Eye, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { workManagementApi, type WorkKind } from "@/features/work-management/work-management.api";
import { ProjectDetailDrawer } from "./work-management/ProjectDetailDrawer";
import { WorkDetailDrawer } from "./work-management/WorkDetailDrawer";

type Kind = WorkKind;
type Language = "vi" | "en";

const statusLabels: Record<Language, Record<string, string>> = {
  vi: { PLANNING: "Lập kế hoạch", ACTIVE: "Đang hoạt động", ON_HOLD: "Tạm dừng", COMPLETED: "Hoàn thành", TODO: "Cần làm", IN_PROGRESS: "Đang thực hiện", IN_REVIEW: "Đang xem xét", DONE: "Đã xong", CANCELLED: "Đã huỷ", SUBMITTED: "Đã gửi", APPROVED: "Đã duyệt", REJECTED: "Từ chối" },
  en: { PLANNING: "Planning", ACTIVE: "Active", ON_HOLD: "On hold", COMPLETED: "Completed", TODO: "To do", IN_PROGRESS: "In progress", IN_REVIEW: "In review", DONE: "Done", CANCELLED: "Cancelled", SUBMITTED: "Submitted", APPROVED: "Approved", REJECTED: "Rejected" },
};

const copy = {
  vi: {
    projects: "Dự án", tasks: "Công việc", timesheets: "Chấm công", project: "Dự án", task: "Công việc", timesheet: "Bản chấm công",
    title: { projects: "Quản lý dự án trong tổ chức hiện tại.", tasks: "Theo dõi và phân công công việc theo dự án.", timesheets: "Ghi nhận thời gian thực hiện công việc." },
    add: "Thêm", list: "Danh sách", inlineHelp: "Thêm và chỉnh sửa trực tiếp trên từng dòng.", name: "Tên", owner: "Người phụ trách", member: "Người thực hiện", selectMember: "Chọn người thực hiện", selectTask: "Chọn công việc", assignedBy: "Giao bởi", assignedTo: "Giao cho", assignees: "Người thực hiện", selectAssignees: "Chọn người thực hiện", status: "Trạng thái", budget: "Ngân sách (VND)", details: "Mô tả", projectColumn: "Dự án", estimate: "Ước tính", actual: "Thực tế", dueDate: "Hạn hoàn thành", date: "Ngày làm", minutes: "Số phút", type: "Loại", actions: "Thao tác", selectProject: "Chọn dự án", selectStatus: "Chọn trạng thái", selectOwner: "Chọn người phụ trách", optionalTask: "Không gắn công việc", noRecords: "Chưa có dữ liệu.", create: "Tạo", save: "Lưu", cancel: "Huỷ", edit: "Sửa", view: "Xem chi tiết", delete: "Xoá", deleteTitle: "Xác nhận xoá", deleteDescription: "Bạn sắp xoá", deleteWarning: "Thao tác này không thể hoàn tác. Dự án có công việc hoặc công việc đã có chấm công sẽ không thể xoá để đảm bảo dữ liệu chính xác.", deleted: "Đã xoá thành công.", created: "Đã tạo thành công.", updated: "Đã cập nhật thành công.", loadError: "Không thể tải dữ liệu.", saveError: "Không thể lưu dữ liệu.", deleteError: "Không thể xoá dữ liệu.", descriptionPlaceholder: "Nhập mô tả", namePlaceholder: "Nhập tên", taskPlaceholder: "Nhập tên công việc", refresh: "Làm mới",
  },
  en: {
    projects: "Projects", tasks: "Tasks", timesheets: "Timesheets", project: "Project", task: "Task", timesheet: "Timesheet",
    title: { projects: "Manage projects in the active organization.", tasks: "Track and assign work by project.", timesheets: "Record time spent on work." },
    add: "Add", list: "List", inlineHelp: "Create and edit directly in each table row.", name: "Name", owner: "Owner", member: "Member", selectMember: "Select member", selectTask: "Select task", assignedBy: "Assigned by", assignedTo: "Assigned to", assignees: "Assignees", selectAssignees: "Select assignees", status: "Status", budget: "Budget (VND)", details: "Description", projectColumn: "Project", estimate: "Estimate", actual: "Actual", dueDate: "Due date", date: "Work date", minutes: "Minutes", type: "Type", actions: "Actions", selectProject: "Select project", selectStatus: "Select status", selectOwner: "Select owner", optionalTask: "No linked task", noRecords: "No records yet.", create: "Create", save: "Save", cancel: "Cancel", edit: "Edit", view: "View details", delete: "Delete", deleteTitle: "Confirm deletion", deleteDescription: "You are about to delete", deleteWarning: "This action cannot be undone. Projects with tasks and tasks with time entries cannot be deleted to keep the data accurate.", deleted: "Deleted successfully.", created: "Created successfully.", updated: "Updated successfully.", loadError: "Unable to load data.", saveError: "Unable to save data.", deleteError: "Unable to delete data.", descriptionPlaceholder: "Enter description", namePlaceholder: "Enter name", taskPlaceholder: "Enter task title", refresh: "Refresh",
  },
} as const;

const formatMinutes = (value?: number | string) => { const minutes = Number(value || 0); return `${Math.floor(minutes / 60)}h ${minutes % 60}m`; };
const projectBudget = (value?: number | string) => new Intl.NumberFormat("vi-VN").format(Number(value || 0) / 100);

export function WorkManagementPage({ kind }: { kind: Kind }) {
  const { i18n } = useTranslation();
  const language: Language = i18n.language.startsWith("vi") ? "vi" : "en";
  const t = copy[language];
  const singular = t[kind === "projects" ? "project" : kind === "tasks" ? "task" : "timesheet"];
  const [metadata, setMetadata] = useState<any>();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>();
  const [form, setForm] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<any>();
  const [detailProjectId, setDetailProjectId] = useState<string>();
  const [detailTarget, setDetailTarget] = useState<{ kind: "tasks" | "timesheets"; id: string }>();

  const formatStatus = (value?: string) => statusLabels[language][value || ""] || value || "—";
  const load = async () => {
    setLoading(true);
    try { const [meta, rows] = await Promise.all([workManagementApi.metadata(), workManagementApi.list(kind)]); setMetadata(meta); setItems(rows); }
    catch { toast.error(t.loadError); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, [kind]);
  const closeForm = () => { setFormOpen(false); setEditing(undefined); setForm({}); };
  const openCreate = () => { setEditing(undefined); setForm({ workDate: new Date().toISOString().slice(0, 10), priority: "0" }); setFormOpen(true); };
  const openEdit = (row: any) => {
    setEditing(row);
    const budgetCents = row.budget_cents ?? row.budgetCents;
    setForm({ name: row.name || "", title: row.title || "", description: row.description || "", projectId: row.project_id || row.projectId || "", statusId: row.status_id || row.statusId || "", ownerMembershipId: row.owner_membership_id || row.ownerMembershipId || "", assigneeMembershipIds: (row.assignees || []).map((member: any) => member.membershipId).filter(Boolean).join(","), priority: String(row.priority ?? 0), estimateMinutes: String(row.estimate_minutes ?? row.estimateMinutes ?? ""), budget: budgetCents === null || budgetCents === undefined ? "" : String(Number(budgetCents) / 100), minutes: String(row.minutes ?? ""), workDate: row.work_date || row.workDate || "", taskId: row.task_id || row.taskId || "", dueAt: row.due_at ? new Date(row.due_at).toISOString().slice(0, 10) : "" });
    setFormOpen(true);
  };
  const save = async () => {
    try {
      const payload: Record<string, unknown> = kind === "projects"
        ? { name: form.name, description: form.description || undefined, statusId: form.statusId || undefined, ownerMembershipId: form.ownerMembershipId || undefined, budgetCents: form.budget ? String(Math.round(Number(form.budget) * 100)) : editing ? null : undefined, estimateMinutes: form.estimateMinutes ? Number(form.estimateMinutes) : editing ? null : undefined }
        : kind === "tasks"
          ? { projectId: form.projectId, title: form.title, description: form.description || undefined, statusId: form.statusId || undefined, priority: Number(form.priority || 0), estimateMinutes: form.estimateMinutes ? Number(form.estimateMinutes) : undefined, dueAt: form.dueAt || undefined, assigneeMembershipIds: form.assigneeMembershipIds ? form.assigneeMembershipIds.split(",").filter(Boolean) : undefined }
          : { projectId: form.projectId || undefined, taskId: form.taskId || undefined, membershipId: form.membershipId || metadata?.currentMembershipId, minutes: Number(form.minutes), workDate: form.workDate || new Date().toISOString().slice(0, 10), description: form.description || undefined };
      if (editing && kind !== "timesheets") await workManagementApi.update(kind, editing.id, payload); else await workManagementApi.create(kind, payload);
      toast.success(editing ? t.updated : t.created); closeForm(); await load();
    } catch (error: any) { toast.error(error?.response?.data?.message || t.saveError); }
  };
  const remove = async () => {
    if (!deleteTarget) return;
    try { await workManagementApi.remove(kind, deleteTarget.id); toast.success(t.deleted); setDeleteTarget(undefined); await load(); }
    catch (error: any) { toast.error(error?.response?.data?.message || t.deleteError); }
  };
  const statuses = kind === "projects" ? metadata?.projectStatuses || [] : metadata?.taskStatuses || [];
  const tasks = (metadata?.tasks || []).filter((task: any) => !form.projectId || task.projectId === form.projectId);
  const primary = (row: any) => row.name || row.title || row.taskTitle || singular;

  return <div className="space-y-5 p-4 md:p-6">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-bold">{t[kind]}</h2><p className="mt-1 text-sm text-muted-foreground">{t.title[kind]}</p></div><Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />{t.add} {singular}</Button></div>
    <Card className="overflow-hidden rounded-2xl"><div className="flex items-center justify-between border-b p-4"><div><h3 className="font-semibold">{t.list} {t[kind].toLowerCase()}</h3><p className="text-xs text-muted-foreground">{t.inlineHelp}</p></div><Button aria-label={t.refresh} variant="ghost" size="icon" onClick={() => void load()}><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /></Button></div>
      <div className="overflow-x-auto"><table className="min-w-[1280px] w-full text-left text-sm"><thead className="bg-muted/50 text-xs text-muted-foreground">{kind === "projects" ? <tr><th className="px-5 py-3">{t.name}</th><th className="px-5 py-3">{t.owner}</th><th className="px-5 py-3">{t.status}</th><th className="px-5 py-3">{t.budget}</th><th className="px-5 py-3">{t.estimate}</th><th className="px-5 py-3">{t.details}</th><th className="px-5 py-3 text-right">{t.actions}</th></tr> : kind === "tasks" ? <tr><th className="px-5 py-3">{t.task}</th><th className="px-5 py-3">{t.projectColumn}</th><th className="px-5 py-3">{t.status}</th><th className="px-5 py-3">{t.assignedBy}</th><th className="px-5 py-3">{t.assignedTo}</th><th className="px-5 py-3">{t.estimate}</th><th className="px-5 py-3">{t.actual}</th><th className="px-5 py-3">{t.dueDate}</th><th className="px-5 py-3 text-right">{t.actions}</th></tr> : <tr><th className="px-5 py-3">{t.date}</th><th className="px-5 py-3">{t.projectColumn}</th><th className="px-5 py-3">{t.task}</th><th className="px-5 py-3">{t.member}</th><th className="px-5 py-3">{t.minutes}</th><th className="px-5 py-3">{t.details}</th><th className="px-5 py-3 text-right">{t.actions}</th></tr>}</thead>
        <tbody>{formOpen && !editing && <InlineForm kind={kind} form={form} setForm={setForm} metadata={metadata} statuses={statuses} tasks={tasks} text={t} formatStatus={formatStatus} editing={false} onSave={() => void save()} onCancel={closeForm} />}{items.map((row) => editing?.id === row.id ? <InlineForm key={row.id} kind={kind} form={form} setForm={setForm} metadata={metadata} statuses={statuses} tasks={tasks} text={t} formatStatus={formatStatus} editing onSave={() => void save()} onCancel={closeForm} /> : <DataRow key={row.id} kind={kind} row={row} text={t} formatStatus={formatStatus} primary={primary} onEdit={() => openEdit(row)} onDelete={() => setDeleteTarget(row)} onView={() => kind === "projects" ? setDetailProjectId(row.id) : setDetailTarget({ kind, id: row.id })} />)}{!loading && !items.length && <tr><td className="p-10 text-center text-muted-foreground" colSpan={kind === "tasks" ? 9 : kind === "projects" ? 7 : 7}>{t.noRecords}</td></tr>}</tbody>
      </table></div>
    </Card>
    <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open: boolean) => !open && setDeleteTarget(undefined)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{t.deleteTitle}</AlertDialogTitle><AlertDialogDescription>{t.deleteDescription} <strong>{primary(deleteTarget || {})}</strong>. {t.deleteWarning}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel onClick={() => setDeleteTarget(undefined)}>{t.cancel}</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => void remove()}>{t.delete}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    <ProjectDetailDrawer projectId={detailProjectId} open={Boolean(detailProjectId)} onOpenChange={(open) => !open && setDetailProjectId(undefined)} language={language} metadata={metadata} onChanged={() => void load()} />
    <WorkDetailDrawer target={detailTarget} open={Boolean(detailTarget)} onOpenChange={(open) => !open && setDetailTarget(undefined)} language={language} />
  </div>;
}

function InlineForm({ kind, form, setForm, metadata, statuses, tasks, text: t, formatStatus, editing, onSave, onCancel }: any) {
  const inputClass = "h-10 min-w-0 rounded-lg border bg-background px-3";
  const statusSelect = <select className={inputClass} value={form.statusId || ""} onChange={(event) => setForm({ ...form, statusId: event.target.value })}><option value="">{t.selectStatus}</option>{statuses.map((status: any) => <option key={status.id} value={status.id}>{formatStatus(status.name)}</option>)}</select>;
  const actions = <div className="flex justify-end gap-2"><Button size="sm" onClick={onSave}>{editing ? t.save : t.create}</Button><Button size="icon" variant="outline" onClick={onCancel}><X className="h-4 w-4" /></Button></div>;
  const selectedTask = tasks.find((task: any) => task.id === form.taskId);
  const eligibleMembers = (metadata?.members || []).filter((member: any) => selectedTask?.assigneeMembershipIds?.includes(member.id));
  const isAdmin = ["ORG_ADMIN", "SUPER_ADMIN", "TESTER"].includes(metadata?.accessRole);
  if (kind === "projects") return <tr className="border-b bg-primary/[0.04]"><td className="px-3 py-3"><Input placeholder={t.namePlaceholder} value={form.name || ""} onChange={(event) => setForm({ ...form, name: event.target.value })} /></td><td className="px-3 py-3"><select className={inputClass} value={form.ownerMembershipId || ""} onChange={(event) => setForm({ ...form, ownerMembershipId: event.target.value })}><option value="">{t.selectOwner}</option>{(metadata?.members || []).map((member: any) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></td><td className="px-3 py-3">{statusSelect}</td><td className="px-3 py-3"><Input inputMode="numeric" placeholder="0" value={form.budget || ""} onChange={(event) => setForm({ ...form, budget: event.target.value })} /></td><td className="px-3 py-3"><Input type="number" min="0" placeholder="0" value={form.estimateMinutes || ""} onChange={(event) => setForm({ ...form, estimateMinutes: event.target.value })} /></td><td className="px-3 py-3"><Input placeholder={t.descriptionPlaceholder} value={form.description || ""} onChange={(event) => setForm({ ...form, description: event.target.value })} /></td><td className="px-3 py-3">{actions}</td></tr>;
  if (kind === "tasks") return <tr className="border-b bg-primary/[0.04]"><td className="px-3 py-3"><Input placeholder={t.taskPlaceholder} value={form.title || ""} onChange={(event) => setForm({ ...form, title: event.target.value })} /><Input className="mt-2" placeholder={t.descriptionPlaceholder} value={form.description || ""} onChange={(event) => setForm({ ...form, description: event.target.value })} /></td><td className="px-3 py-3"><select className={inputClass} value={form.projectId || ""} onChange={(event) => setForm({ ...form, projectId: event.target.value })}><option value="">{t.selectProject}</option>{(metadata?.projects || []).map((project: any) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></td><td className="px-3 py-3">{statusSelect}</td><td className="px-3 py-3 text-center text-xs text-muted-foreground">—</td><td className="px-3 py-3"><select multiple className="h-20 min-w-40 rounded-lg border bg-background px-3" value={(form.assigneeMembershipIds || "").split(",").filter(Boolean)} onChange={(event) => setForm({ ...form, assigneeMembershipIds: Array.from(event.currentTarget.selectedOptions, (option) => option.value).join(",") })}>{(metadata?.members || []).map((member: any) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></td><td className="px-3 py-3"><Input type="number" min="0" value={form.estimateMinutes || ""} onChange={(event) => setForm({ ...form, estimateMinutes: event.target.value })} /></td><td className="px-3 py-3 text-muted-foreground">—</td><td className="px-3 py-3"><Input type="date" value={form.dueAt || ""} onChange={(event) => setForm({ ...form, dueAt: event.target.value })} /></td><td className="px-3 py-3">{actions}</td></tr>;
  return <tr className="border-b bg-primary/[0.04]"><td className="px-3 py-3"><Input type="date" value={form.workDate || ""} onChange={(event) => setForm({ ...form, workDate: event.target.value })} /></td><td className="px-3 py-3"><select className={inputClass} value={form.projectId || ""} onChange={(event) => setForm({ ...form, projectId: event.target.value, taskId: "", membershipId: "" })}><option value="">{t.selectProject}</option>{(metadata?.projects || []).map((project: any) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></td><td className="px-3 py-3"><select disabled={!form.projectId} className={inputClass} value={form.taskId || ""} onChange={(event) => setForm({ ...form, taskId: event.target.value, membershipId: "" })}><option value="">{form.projectId ? t.selectTask : t.selectProject}</option>{tasks.map((task: any) => <option key={task.id} value={task.id}>{task.title}</option>)}</select></td><td className="px-3 py-3"><select disabled={!form.taskId || !isAdmin} className={inputClass} value={form.membershipId || metadata?.currentMembershipId || ""} onChange={(event) => setForm({ ...form, membershipId: event.target.value })}><option value="">{t.selectMember}</option>{eligibleMembers.map((member: any) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></td><td className="px-3 py-3"><Input type="number" min="1" value={form.minutes || ""} onChange={(event) => setForm({ ...form, minutes: event.target.value })} /></td><td className="px-3 py-3"><Input placeholder={t.descriptionPlaceholder} value={form.description || ""} onChange={(event) => setForm({ ...form, description: event.target.value })} /></td><td className="px-3 py-3">{actions}</td></tr>;
}

function DataRow({ kind, row, text: t, formatStatus, primary, onEdit, onDelete, onView }: any) {
  const actions = <td className="px-5 py-4 text-right"><div className="flex justify-end gap-1"><Button aria-label={t.view} title={t.view} variant="ghost" size="icon" onClick={onView}><Eye className="h-4 w-4" /></Button>{kind !== "timesheets" && <Button aria-label={t.edit} title={t.edit} variant="ghost" size="icon" onClick={onEdit}><Edit3 className="h-4 w-4" /></Button>}<Button aria-label={t.delete} title={t.delete} variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button></div></td>;
  if (kind === "projects") return <tr className="border-b last:border-0 hover:bg-muted/40"><td className="px-5 py-4 font-semibold">{primary(row)}</td><td className="px-5 py-4"><div className="flex items-center gap-2 text-muted-foreground"><Avatar className="h-7 w-7"><AvatarImage src={row.ownerAvatarUrl} /><AvatarFallback className="bg-primary/15 text-[10px] text-primary">{initials(row.ownerName)}</AvatarFallback></Avatar>{row.ownerName || "—"}</div></td><td className="px-5 py-4"><Badge variant="secondary">{formatStatus(row.statusName)}</Badge></td><td className="px-5 py-4">{projectBudget(row.budget_cents ?? row.budgetCents)} {row.currency || "VND"}</td><td className="px-5 py-4">{formatMinutes(row.estimate_minutes ?? row.estimateMinutes)}</td><td className="px-5 py-4 text-muted-foreground">{row.taskCount || 0} {t.tasks.toLowerCase()}</td>{actions}</tr>;
  if (kind === "tasks") return <tr className="border-b last:border-0 hover:bg-muted/40"><td className="px-5 py-4"><p className="font-semibold">{primary(row)}</p><p className="mt-1 max-w-xs truncate text-xs text-muted-foreground">{row.description || "—"}</p></td><td className="px-5 py-4 text-muted-foreground">{row.projectName || "—"}</td><td className="px-5 py-4"><Badge variant="secondary">{formatStatus(row.statusName)}</Badge></td><td className="px-5 py-4"><div className="flex items-center gap-2"><Avatar className="h-7 w-7"><AvatarImage src={row.assignedByAvatarUrl} /><AvatarFallback className="bg-primary/15 text-[10px] text-primary">{initials(row.assignedByName)}</AvatarFallback></Avatar><span className="max-w-28 truncate text-xs">{row.assignedByName || "—"}</span></div></td><td className="px-5 py-4"><div className="flex -space-x-2">{(row.assignees || []).slice(0, 4).map((member: any) => <Avatar key={member.membershipId} title={member.name} className="h-7 w-7 border-2 border-background"><AvatarImage src={member.avatarUrl} /><AvatarFallback className="bg-violet-500/20 text-[10px] text-violet-400">{initials(member.name)}</AvatarFallback></Avatar>)}{!(row.assignees || []).length && <span className="text-xs text-muted-foreground">—</span>}</div></td><td className="px-5 py-4">{formatMinutes(row.estimate_minutes ?? row.estimateMinutes)}</td><td className="px-5 py-4">{formatMinutes(row.actual_minutes ?? row.actualMinutes)}</td><td className="px-5 py-4">{row.due_at ? new Date(row.due_at).toLocaleDateString() : "—"}</td>{actions}</tr>;
  return <tr className="border-b last:border-0 hover:bg-muted/40"><td className="px-5 py-4">{row.work_date || row.workDate}</td><td className="px-5 py-4">{row.projectName || "—"}</td><td className="px-5 py-4">{row.taskTitle || "—"}</td><td className="px-5 py-4"><div className="flex items-center gap-2"><Avatar className="h-7 w-7"><AvatarImage src={row.memberAvatarUrl} /><AvatarFallback className="bg-cyan-500/20 text-[10px] text-cyan-400">{initials(row.memberName)}</AvatarFallback></Avatar><span className="max-w-28 truncate text-xs">{row.memberName || "—"}</span></div></td><td className="px-5 py-4">{formatMinutes(row.minutes)}</td><td className="px-5 py-4 text-muted-foreground">{row.description || "—"}</td>{actions}</tr>;
}

function initials(name?: string) { return name?.split(" ").filter(Boolean).slice(-2).map((part) => part[0]).join("").toUpperCase() || "?"; }
