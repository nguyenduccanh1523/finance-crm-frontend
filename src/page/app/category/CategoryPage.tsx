import { useEffect, useRef, useState } from "react";
import { Plus, Edit2, Trash2, Search, Loader } from "lucide-react";
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
import { useAppToast } from "@/components/common/toast/useToast";
import {
  useGetCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  type Category,
} from "@/lib/hooks/categories/useCategories";

export function CategoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [formData, setFormData] = useState({ name: "", description: "" });
  const hasInitialized = useRef(false);

  const { categories, setCategories, loading, fetchCategories } =
    useGetCategories();
  const { createCategory, loading: createLoading } = useCreateCategory();
  const { updateCategory, loading: updateLoading } = useUpdateCategory();
  const { deleteCategory, loading: deleteLoading } = useDeleteCategory();
  const { showSuccess, showError } = useAppToast();

  // Fetch categories only once on mount
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    fetchCategories().catch((err) => {
      console.error("Failed to load categories:", err);
    });
  }, [fetchCategories]);

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setIsEditMode(true);
      setSelectedCategory(category);
      setFormData({ name: category.name, description: category.description });
    } else {
      setIsEditMode(false);
      setSelectedCategory(null);
      setFormData({ name: "", description: "" });
    }
    setIsOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
    setFormData({ name: "", description: "" });
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
        // Update
        const updatedCategory = await updateCategory(selectedCategory.id, {
          name: formData.name,
          description: formData.description,
        });

        setCategories(
          categories.map((cat) =>
            cat.id === selectedCategory.id ? updatedCategory : cat,
          ),
        );
        showSuccess("Category updated successfully");
      } else {
        // Create
        const newCategory = await createCategory({
          name: formData.name,
          description: formData.description,
        });

        setCategories([...categories, newCategory]);
        showSuccess("Category created successfully");
      }

      handleCloseDialog();
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || "An error occurred. Please try again.";
      showError(errorMsg);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await deleteCategory(id);
      setCategories(categories.filter((cat) => cat.id !== id));
      showSuccess("Category deleted successfully");
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || "Failed to delete category";
      showError(errorMsg);
    }
  };

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all product categories
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

      {/* Table */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900">
              <TableHead>Category Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Items</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <TableRow
                  key={category.id}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                >
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {category.description}
                  </TableCell>
                  <TableCell className="text-center text-gray-900 dark:text-white">
                    {category.count}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenDialog(category)}
                        disabled={updateLoading || deleteLoading}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition text-blue-600 dark:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={deleteLoading || updateLoading}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition text-red-600 dark:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
                : "Create a new product category"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Category Name *
              </label>
              <Input
                placeholder="e.g., Electronics"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={createLoading || updateLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Description
              </label>
              <Input
                placeholder="e.g., Electronic devices and accessories"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={createLoading || updateLoading}
              />
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
    </div>
  );
}
