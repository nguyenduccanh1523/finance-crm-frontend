import { useState } from "react";
import { Plus, Edit2, Trash2, Search, Share2, Lock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock data
const mockWorkspaces = [
  {
    id: 1,
    name: "Main Business",
    description: "Primary workspace for business operations",
    members: 5,
    status: "active",
    createdAt: "2025-01-15",
    role: "Owner",
  },
  {
    id: 2,
    name: "Project Alpha",
    description: "Marketing campaign management",
    members: 3,
    status: "active",
    createdAt: "2025-02-01",
    role: "Admin",
  },
  {
    id: 3,
    name: "Client Works",
    description: "Client projects and collaboration",
    members: 8,
    status: "active",
    createdAt: "2025-01-20",
    role: "Member",
  },
  {
    id: 4,
    name: "R&D Team",
    description: "Research and development workspace",
    members: 2,
    status: "inactive",
    createdAt: "2024-12-10",
    role: "Owner",
  },
];

export function PersonalWorkspacePage() {
  const [workspaces, setWorkspaces] = useState(mockWorkspaces);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWorkspaces = workspaces.filter(
    (ws) =>
      ws.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ws.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = (id: number) => {
    setWorkspaces(workspaces.filter((ws) => ws.id !== id));
  };

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Personal Workspace
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your workspaces and team collaboration
          </p>
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          Create Workspace
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          placeholder="Search workspaces..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900">
              <TableHead>Workspace Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Members</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWorkspaces.length > 0 ? (
              filteredWorkspaces.map((workspace) => (
                <TableRow
                  key={workspace.id}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition"
                >
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    {workspace.name}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {workspace.description}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Users size={16} className="text-gray-500" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {workspace.members}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                    >
                      {workspace.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        workspace.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      }
                    >
                      {workspace.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 text-sm">
                    {workspace.createdAt}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition text-blue-600 dark:text-blue-400">
                        <Share2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition text-green-600 dark:text-green-400">
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(workspace.id)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition text-red-600 dark:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  No workspaces found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Icon import needed
import { Users } from "lucide-react";
