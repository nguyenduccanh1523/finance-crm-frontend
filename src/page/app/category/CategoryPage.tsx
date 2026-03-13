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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import { useAppToast } from "@/components/common/toast/useToast";
import {
  useGetFinanceCategories,
  useCreateFinanceCategory,
  useUpdateFinanceCategory,
  useDeleteFinanceCategory,
  type FinanceCategory,
  type CategoryKind,
} from "@/lib/hooks/categories/useFinanceCategories";

const EMOJI_LIST = [
  "💰",
  "💸",
  "💵",
  "💴",
  "💶",
  "💷",
  "💳",
  "🏦",
  "🏧",
  "💼",
  "📊",
  "📈",
  "🎁",
  "🛍️",
  "🍔",
  "🍕",
  "🚗",
  "✈️",
  "🏠",
  "🎓",
  "⚕️",
  "🎬",
  "🎮",
  "📱",
  "💻",
  "⚡",
  "📚",
  "🎵",
  "⚽",
  "🏥",
];

interface FormData {
  name: string;
  kind: CategoryKind;
  icon: string;
}

export function CategoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<FinanceCategory | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<FinanceCategory | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    kind: "EXPENSE",
    icon: "💰",
  });
  const hasInitialized = useRef(false);

  const { global, workspace, setWorkspace, loading, fetchCategories } =
    useGetFinanceCategories();
  const { createCategory, loading: createLoading } = useCreateFinanceCategory();
  const { updateCategory, loading: updateLoading } = useUpdateFinanceCategory();
  const { deleteCategory, loading: deleteLoading } = useDeleteFinanceCategory();
  const { showSuccess, showError } = useAppToast();

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    fetchCategories().catch((err) => {
      console.error("Failed to load categories:", err);
    });
  }, [fetchCategories]);

  const filteredGlobal = global.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredWorkspace = workspace.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleOpenDialog = (category?: FinanceCategory) => {
    if (category) {
      setIsEditMode(true);
      setSelectedCategory(category);
      setFormData({
        name: category.name,
        kind: category.kind,
        icon: category.icon,
      });
    } else {
      setIsEditMode(false);
      setSelectedCategory(null);
      setFormData({ name: "", kind: "EXPENSE", icon: "💰" });
    }
    setIsOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
    setFormData({ name: "", kind: "EXPENSE", icon: "💰" });
    setSelectedCategory(null);
    setIsEditMode(false);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showError("Category name is required");
      return;
    }

    try {
      if (isEditMode && selectedCategory) {
        // Update only workspace categories
        if (selectedCategory.scope !== "workspace") {
          showError("Cannot edit global categories");
          return;
        }

        const updatedCategory = await updateCategory(selectedCategory.id, {
          name: formData.name,
          kind: formData.kind,
          icon: formData.icon,
        });

        setWorkspace(
          workspace.map((cat) =>
            cat.id === selectedCategory.id ? updatedCategory : cat,
          ),
        );
        showSuccess("Category updated successfully");
      } else {
        // Create
        const newCategory = await createCategory({
          name: formData.name,
          kind: formData.kind,
          icon: formData.icon,
        });

        setWorkspace([...workspace, newCategory]);
        showSuccess("Category created successfully");
      }

      handleCloseDialog();
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || "An error occurred. Please try again.";
      showError(errorMsg);
    }
  };

  const handleDelete = async (category: FinanceCategory) => {
    if (category.scope !== "workspace") {
      showError("Cannot delete global categories");
      return;
    }

    setCategoryToDelete(category);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id);
      setWorkspace(workspace.filter((cat) => cat.id !== categoryToDelete.id));
      showSuccess("Category deleted successfully");
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || "Failed to delete category";
      showError(errorMsg);
    }
  };

  const CategoryRow = ({ category }: { category: FinanceCategory }) => (
    <TableRow className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50">
      <TableCell className="font-medium text-gray-900 dark:text-white">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.icon}</span>
          <span>{category.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            category.kind === "INCOME"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {category.kind === "INCOME" ? "Income" : "Expense"}
        </span>
      </TableCell>
      <TableCell className="text-gray-600 dark:text-gray-400">
        {new Date(category.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right">
        {category.scope === "global" ? (
          <div className="flex justify-end gap-2 items-center text-yellow-600 dark:text-yellow-400">
            <Lock size={16} />
            <span className="text-sm">System</span>
          </div>
        ) : (
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleOpenDialog(category)}
              disabled={updateLoading || deleteLoading}
              className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition text-blue-600 dark:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => handleDelete(category)}
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
            Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage income and expense categories
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="gap-2"
          disabled={loading || createLoading}
        >
          <Plus size={18} />
          Add Category
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          placeholder="Search categories..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Global Categories Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            System Categories
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
                <TableHead>Type</TableHead>
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
                      Loading categories...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredGlobal.length > 0 ? (
                filteredGlobal.map((category) => (
                  <CategoryRow key={category.id} category={category} />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-gray-500"
                  >
                    No system categories found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Workspace Categories Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Custom Categories
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
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkspace.length > 0 ? (
                filteredWorkspace.map((category) => (
                  <CategoryRow key={category.id} category={category} />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-gray-500"
                  >
                    No custom categories found. Create one to get started!
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
            <DialogTitle>
              {isEditMode ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the category details"
                : "Create a new income or expense category"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Category Name *
              </label>
              <Input
                placeholder="e.g., Groceries"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={createLoading || updateLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Type *
              </label>
              <Select
                value={formData.kind}
                onValueChange={(value) =>
                  setFormData({ ...formData, kind: value as CategoryKind })
                }
                disabled={createLoading || updateLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCOME">Income</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Icon *
              </label>
              <div className="grid grid-cols-6 gap-2">
                {EMOJI_LIST.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setFormData({ ...formData, icon: emoji })}
                    disabled={createLoading || updateLoading}
                    className={`p-2 text-2xl rounded-lg transition ${
                      formData.icon === emoji
                        ? "bg-blue-500 ring-2 ring-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
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
        title="Delete Category?"
        description="This will permanently remove this custom category from your workspace. All transactions with this category will need to be reassigned."
        itemName={categoryToDelete?.name || ""}
        isLoading={deleteLoading}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
