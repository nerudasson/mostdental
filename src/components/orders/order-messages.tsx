import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Image, Paperclip, Package2, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';

interface Message {
  id: string;
  type: 'message' | 'delivery_info';
  sender: {
    name: string;
    role: 'dentist' | 'lab';
    avatar?: string;
  };
  content: string;
  attachments?: {
    type: 'image' | 'file';
    name: string;
    url: string;
  }[];
  timestamp: Date;
  deliveryDate?: Date;
  timeSlot?: string;
  notes?: string;
}

interface OrderMessagesProps {
  orderId: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'message',
    sender: {
      name: 'Dr. Smith',
      role: 'dentist',
    },
    content: 'Please ensure the margins are at least 0.5mm thick.',
    timestamp: new Date('2024-02-20T10:30:00'),
  },
  {
    id: '2',
    type: 'message',
    sender: {
      name: 'John Lab',
      role: 'lab',
    },
    content: 'Will do. I\'ve also noticed some undercuts in the preparation. Would you like me to block them out?',
    timestamp: new Date('2024-02-20T11:15:00'),
  },
  {
    id: '3',
    type: 'message',
    sender: {
      name: 'Dr. Smith',
      role: 'dentist',
    },
    content: 'Yes, please block out the undercuts. Thank you for catching that.',
    attachments: [
      {
        type: 'image',
        name: 'scan_view.jpg',
        url: '#',
      },
    ],
    timestamp: new Date('2024-02-20T11:30:00'),
  },
];

export function OrderMessages({ orderId }: OrderMessagesProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleSend = () => {
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'message',
      sender: {
        name: user.name,
        role: user.role,
      },
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Case Discussion</h3>
        <p className="text-sm text-muted-foreground">
          Communicate about this case
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.sender.role === user?.role ? 'flex-row-reverse' : ''
            }`}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {message.sender.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div
              className={`flex flex-col space-y-2 max-w-[80%] ${
                message.sender.role === user?.role ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{message.sender.name}</span>
                <span className="text-xs text-muted-foreground">
                  {format(message.timestamp, 'p')}
                </span>
              </div>
              <div
                className={`rounded-lg p-3 ${
                  message.sender.role === user?.role
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.type === 'delivery_info' ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Package2 className="h-4 w-4" />
                      <span className="font-medium">Order Ready for Pickup</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>{format(message.deliveryDate!, 'PPP')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{message.timeSlot}</span>
                    </div>
                    {message.notes && (
                      <p className="text-sm mt-2">{message.notes}</p>
                    )}
                  </div>
                ) : (
                  <>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.attachments?.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm rounded bg-background/10 p-2"
                          >
                            {attachment.type === 'image' ? (
                              <Image className="h-4 w-4" />
                            ) : (
                              <Paperclip className="h-4 w-4" />
                            )}
                            <span>{attachment.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="shrink-0">
            <Image className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="min-h-[80px]"
          />
          <Button
            className="shrink-0"
            onClick={handleSend}
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}