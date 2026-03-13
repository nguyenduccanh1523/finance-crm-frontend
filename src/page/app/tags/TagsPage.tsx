import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Search, Loader, Lock } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import { useAppToast } from "@/components/common/toast/useToast";
import {
  useGetFinanceTags,
  useCreateFinanceTag,
  useUpdateFinanceTag,
  useDeleteFinanceTag,
  type FinanceTag,
} from "@/lib/hooks/tags/useFinanceTags";

interface FormData {
  name: string;
  color: string;
}

export function TagsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTag, setSelectedTag] = useState<FinanceTag | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<FinanceTag | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    color: "#FF0000",
  });
  const hasInitialized = useRef(false);

  const { global, workspace, setWorkspace, loading, fetchTags } =
    useGetFinanceTags();
  const { createTag, loading: createLoading } = useCreateFinanceTag();
  const { updateTag, loading: updateLoading } = useUpdateFinanceTag();
  const { deleteTag, loading: deleteLoading } = useDeleteFinanceTag();
  const { showSuccess, showError } = useAppToast();

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    fetchTags().catch((err) => {
      console.error("Failed to load tags:", err);
    });
  }, [fetchTags]);

  const filteredGlobal = global.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredWorkspace = workspace.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleOpenDialog = (tag?: FinanceTag) => {
    if (tag) {
      setIsEditMode(true);
      setSelectedTag(tag);
      setFormData({
        name: tag.name,
        color: tag.color,
      });
    } else {
      setIsEditMode(false);
      setSelectedTag(null);
      setFormData({ name: "", color: "#FF0000" });
    }
    setIsOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
    setFormData({ name: "", color: "#FF0000" });
    setSelectedTag(null);
    setIsEditMode(false);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showError("Tag name is required");
      return;
    }

    try {
      if (isEditMode && selectedTag) {
        // Update only workspace tags
        if (selectedTag.scope !== "workspace") {
          showError("Cannot edit global tags");
          return;
        }

        const updatedTag = await updateTag(selectedTag.id, {
          name: formData.name,
          color: formData.color,
        });

        setWorkspace(
          workspace.map((tag) =>
            tag.id === selectedTag.id ? updatedTag : tag,
          ),
        );
        showSuccess("Tag updated successfully");
      } else {
        // Create
        const newTag = await createTag({
          name: formData.name,
          color: formData.color,
        });

        setWorkspace([...workspace, newTag]);
        showSuccess("Tag created successfully");
      }

      handleCloseDialog();
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || "An error occurred. Please try again.";
      showError(errorMsg);
    }
  };

  const handleDelete = async (tag: FinanceTag) => {
    if (tag.scope !== "workspace") {
      showError("Cannot delete global tags");
      return;
    }

    setTagToDelete(tag);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!tagToDelete) return;

    try {
      await deleteTag(tagToDelete.id);
      setWorkspace(workspace.filter((t) => t.id !== tagToDelete.id));
      showSuccess("Tag deleted successfully");
      setDeleteConfirmOpen(false);
      setTagToDelete(null);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Failed to delete tag";
      showError(errorMsg);
    }
  };

  const TagRow = ({ tag }: { tag: FinanceTag }) => (
    <TableRow className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50">
      <TableCell className="font-medium text-gray-900 dark:text-white">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-md border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: tag.color }}
          />
          <span>{tag.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-gray-600 dark:text-gray-400 font-mono text-sm">
        {tag.color}
      </TableCell>
      <TableCell className="text-gray-600 dark:text-gray-400">
        {new Date(tag.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right">
        {tag.scope === "global" ? (
          <div className="flex justify-end gap-2 items-center text-yellow-600 dark:text-yellow-400">
            <Lock size={16} />
            <span className="text-sm">System</span>
          </div>
        ) : (
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleOpenDialog(tag)}
              disabled={updateLoading || deleteLoading}
              className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition text-blue-600 dark:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => handleDelete(tag)}
              disabled={deleteLoading || updateLoading}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition text-red-600 dark:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tags
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage transaction tags and labels
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="gap-2"
          disabled={loading || createLoading}
        >
          <Plus size={18} />
          Add Tag
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          placeholder="Search tags..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Global Tags Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            System Tags
          </h2>
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
            Read Only
          </span>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-900">
                <TableHead>Name</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-gray-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader size={16} className="animate-spin" />
                      Loading tags...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredGlobal.length > 0 ? (
                filteredGlobal.map((tag) => <TagRow key={tag.id} tag={tag} />)
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-gray-500"
                  >
                    No system tags found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Workspace Tags Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Custom Tags
          </h2>
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
            Editable
          </span>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-900">
                <TableHead>Name</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkspace.length > 0 ? (
                filteredWorkspace.map((tag) => (
                  <TagRow key={tag.id} tag={tag} />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-gray-500"
                  >
                    No custom tags found. Create one to get started!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={isOpenDialog} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Tag" : "Add New Tag"}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the tag details"
                : "Create a new tag for transactions"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Tag Name *
              </label>
              <Input
                placeholder="e.g., Important"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={createLoading || updateLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Color *
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  disabled={createLoading || updateLoading}
                  className="h-12 w-16 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                />
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="#FF0000"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    disabled={createLoading || updateLoading}
                    className="font-mono"
                  />
                </div>
                <div
                  className="w-12 h-12 rounded border-2 border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: formData.color }}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={createLoading || updateLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createLoading || updateLoading}
              className="gap-2"
            >
              {(createLoading || updateLoading) && (
                <Loader size={16} className="animate-spin" />
              )}
              {isEditMode ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Tag?"
        description="This will permanently remove this custom tag from your workspace. All transactions with this tag will have it removed."
        itemName={tagToDelete?.name || ""}
        isLoading={deleteLoading}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
