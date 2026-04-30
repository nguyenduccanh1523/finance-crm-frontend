import { useNavigate } from "react-router-dom";
import { WorkspaceChooser } from "@/components/workspace-chooser";
import { useLogout } from "@/lib/hooks/auth/useLogout";

type WorkspaceType = "finance" | "organization";

const getWorkspacePath = (workspace: WorkspaceType) =>
  workspace === "finance" ? "/app" : "/app/organization";

export function WorkspaceChooserPage() {
  const navigate = useNavigate();
  const { logout } = useLogout();

  const handleWorkspaceSelect = (type: WorkspaceType) => {
    localStorage.setItem("selectedWorkspace", type);
    navigate(getWorkspacePath(type), { replace: true });
  };

  return (
    <WorkspaceChooser
      onWorkspaceSelect={handleWorkspaceSelect}
      onLogout={logout}
    />
  );
}
