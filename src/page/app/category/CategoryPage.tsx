import { useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
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

// Mock data
const mockCategories = [
  {
    id: 1,
    name: "Electronics",
    description: "Electronic devices and accessories",
    count: 45,
  },
  {
    id: 2,
    name: "Clothing",
    description: "Apparel and fashion items",
    count: 120,
  },
  {
    id: 3,
    name: "Food & Beverage",
    description: "Food and drink products",
    count: 87,
  },
  {
    id: 4,
    name: "Home & Garden",
    description: "Home and gardening products",
    count: 156,
  },
  {
    id: 5,
    name: "Sports",
    description: "Sports equipment and gear",
    count: 92,
  },
];

export function CategoryPage() {
  const [categories, setCategories] = useState(mockCategories);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id));
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
        <Button className="gap-2">
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
            {filteredCategories.length > 0 ? (
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
                      <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition text-blue-600 dark:text-blue-400">
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
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
    </div>
  );
}
