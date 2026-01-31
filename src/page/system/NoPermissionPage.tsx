import { ShieldAlert } from "lucide-react";

export function NoPermissionPage() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center text-center gap-3">
      <ShieldAlert className="h-12 w-12 text-red-500" />
      <h1 className="text-2xl font-bold">Không có quyền truy cập</h1>
      <p className="text-muted-foreground">
        Bạn không có quyền xem trang này. Vui lòng liên hệ quản trị viên.
      </p>
    </div>
  );
}
