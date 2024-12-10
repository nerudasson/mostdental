import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatementList } from '@/components/billing/statement-list';
import { useAuth } from '@/hooks/use-auth';

export function StatementsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payment Statements</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          {user.role === 'lab' && (
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="pending">
          <StatementList filter="pending" />
        </TabsContent>

        <TabsContent value="paid">
          <StatementList filter="paid" />
        </TabsContent>

        {user.role === 'lab' && (
          <TabsContent value="overdue">
            <StatementList filter="overdue" />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}