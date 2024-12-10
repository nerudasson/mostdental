import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';

interface MessageThread {
  id: string;
  orderId: string;
  patientName: string;
  patientId: string;
  treatmentType: string;
  lastMessage: {
    content: string;
    sender: string;
    timestamp: Date;
  };
  unreadCount: number;
}

const mockThreads: MessageThread[] = [
  {
    id: '1',
    orderId: 'O001',
    patientName: 'John Doe',
    patientId: '#3454',
    treatmentType: 'Crown',
    lastMessage: {
      content: 'Please check the margin on tooth 14',
      sender: 'Dr. Smith',
      timestamp: new Date('2024-02-20T10:30:00'),
    },
    unreadCount: 2,
  },
  {
    id: '2',
    orderId: 'O002',
    patientName: 'Jane Smith',
    patientId: '#3455',
    treatmentType: 'Bridge',
    lastMessage: {
      content: 'Material preference updated',
      sender: 'Best Lab',
      timestamp: new Date('2024-02-20T09:15:00'),
    },
    unreadCount: 0,
  },
];

export function MessagesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredThreads = mockThreads.filter(thread => 
    (filter === 'all' || thread.unreadCount > 0) &&
    (thread.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     thread.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
     thread.orderId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleThreadClick = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter(filter === 'unread' ? 'all' : 'unread')}
          className="w-full sm:w-auto"
        >
          <Filter className="h-4 w-4 mr-2" />
          {filter === 'unread' ? 'Show All' : 'Show Unread'}
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-2">
        {filteredThreads.map((thread) => (
          <Card
            key={thread.id}
            className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => handleThreadClick(thread.orderId)}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
              <div className="space-y-1 w-full">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium">{thread.patientName}</h3>
                  <Badge variant="outline">{thread.patientId}</Badge>
                  {thread.unreadCount > 0 && (
                    <Badge>{thread.unreadCount} new</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Order {thread.orderId} • {thread.treatmentType}
                </p>
                <div className="flex items-start gap-2 mt-2">
                  <span className="text-sm font-medium shrink-0">
                    {thread.lastMessage.sender}:
                  </span>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {thread.lastMessage.content}
                  </p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {format(thread.lastMessage.timestamp, 'PP')}
              </span>
            </div>
          </Card>
        ))}

        {filteredThreads.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No messages found
          </div>
        )}
      </div>
    </div>
  );
}