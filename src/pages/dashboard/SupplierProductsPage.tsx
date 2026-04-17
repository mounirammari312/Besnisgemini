import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, Boxes } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SupplierProductsPage() {
  const products = [
    { id: '1', name: 'آلة طحن صناعية X200', category: 'معدات صناعية', price: 450000, stock: 12, status: 'active' },
    { id: '2', name: 'مثقاب صناعي بوش', category: 'معدات صناعية', price: 35000, stock: 45, status: 'active' },
    { id: '3', name: 'مولد كهربائي 50KVA', category: 'طاقة', price: 1200000, stock: 3, status: 'out_of_stock' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl font-black text-primary uppercase">إدارة المنتجات PRODUCTS</h1>
          <p className="text-muted-foreground text-sm">أضف، عدل، أو احذف منتجاتك من المنصة.</p>
        </div>
        <Button className="font-bold gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/10">
          <Plus className="h-5 w-5" />
          إضافة منتج جديد
        </Button>
      </div>

      <Card className="rounded-2xl border shadow-sm">
        <div className="p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="بحث برقم المنتج أو الاسم..." className="pl-10 rounded-full h-10 border-muted" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full">تصدير CSV</Button>
            <Button variant="outline" size="sm" className="rounded-full">الفلاتر</Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>المنتج</TableHead>
              <TableHead>التصنيف</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead>المخزون</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="text-left">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id} className="hover:bg-muted/10 transition-colors">
                <td className="p-4 font-mono text-xs text-muted-foreground">#PRD-{p.id.padStart(4, '0')}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden flex items-center justify-center p-1 border">
                        <Boxes className="h-5 w-5 text-primary/40" />
                     </div>
                     <span className="font-bold">{p.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm">{p.category}</td>
                <td className="p-4 font-bold">{formatCurrency(p.price)}</td>
                <td className="p-4">
                  <span className={p.stock < 10 ? "text-red-500 font-bold" : ""}>{p.stock} وحدة</span>
                </td>
                <td className="p-4">
                  <Badge variant={p.status === 'active' ? 'secondary' : 'outline'} className={p.status === 'active' ? "bg-green-100 text-green-700 hover:bg-green-200 border-0" : ""}>
                    {p.status === 'active' ? 'نشط' : 'نفذ'}
                  </Badge>
                </td>
                <td className="p-4 text-left">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                       <DropdownMenuItem className="gap-2"><Eye className="h-4 w-4" /> عرض</DropdownMenuItem>
                       <DropdownMenuItem className="gap-2"><Edit className="h-4 w-4" /> تعديل</DropdownMenuItem>
                       <DropdownMenuItem className="gap-2 text-red-500"><Trash2 className="h-4 w-4" /> حذف</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function Card({ children, className }: any) {
  return <div className={cn("bg-white overflow-hidden", className)}>{children}</div>;
}
