import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const transactions = [
  { id: 1, title: "Subscription Payment", amount: 49, status: "paid", date: "2024-01-10" },
  { id: 2, title: "Refund", amount: -19, status: "refunded", date: "2024-01-12" },
  { id: 3, title: "Upgrade", amount: 99, status: "pending", date: "2024-01-15" },
];

export function TransactionsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transactions</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex items-center gap-4">
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">Export CSV</Button>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>${t.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        t.status === "paid"
                          ? "default"
                          : t.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{t.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* pagination */}
          <div className="mt-4 flex justify-end gap-3">
            <Button variant="outline">Previous</Button>
            <Button variant="outline">Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
