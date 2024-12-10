import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X, UserPlus2, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface TeamMember {
  id: string;
  name: string;
  role: 'owner' | 'doctor' | 'assistant';
  email: string;
  phone: string;
  specialization?: string;
  registrationNumber?: string;
  status: 'active' | 'invited' | 'inactive';
}

const specializations = [
  { value: 'general', label: 'General Dentistry' },
  { value: 'orthodontics', label: 'Orthodontics' },
  { value: 'endodontics', label: 'Endodontics' },
  { value: 'periodontics', label: 'Periodontics' },
  { value: 'prosthodontics', label: 'Prosthodontics' },
  { value: 'oral_surgery', label: 'Oral Surgery' },
];

const roleStyles = {
  owner: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  doctor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  assistant: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
};

const statusStyles = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  invited: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
};

export function TeamSettingsPage() {
  const { t } = useTranslation();
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Dr. Sarah Smith',
      role: 'owner',
      email: 'sarah@example.com',
      phone: '+49 123 456789',
      specialization: 'general',
      registrationNumber: 'DE123456',
      status: 'active',
    },
    {
      id: '2',
      name: 'Dr. Michael Johnson',
      role: 'doctor',
      email: 'michael@example.com',
      phone: '+49 234 567890',
      specialization: 'orthodontics',
      registrationNumber: 'DE234567',
      status: 'active',
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    role: 'doctor' as const,
    email: '',
    phone: '',
    specialization: '',
    registrationNumber: '',
  });

  const handleAdd = () => {
    if (editingId) {
      setTeamMembers(members =>
        members.map(member =>
          member.id === editingId
            ? {
                ...member,
                ...formData,
              }
            : member
        )
      );
      setEditingId(null);
    } else {
      const newMember: TeamMember = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        status: 'invited',
      };
      setTeamMembers([...teamMembers, newMember]);
    }
    setFormData({
      name: '',
      role: 'doctor',
      email: '',
      phone: '',
      specialization: '',
      registrationNumber: '',
    });
    setShowDialog(false);
  };

  const handleEdit = (member: TeamMember) => {
    setFormData({
      name: member.name,
      role: member.role,
      email: member.email,
      phone: member.phone,
      specialization: member.specialization || '',
      registrationNumber: member.registrationNumber || '',
    });
    setEditingId(member.id);
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    setTeamMembers(members =>
      members.map(member =>
        member.id === id ? { ...member, status: 'inactive' } : member
      )
    );
  };

  const handleReactivate = (id: string) => {
    setTeamMembers(members =>
      members.map(member =>
        member.id === id ? { ...member, status: 'active' } : member
      )
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Team Management</h1>
        <Button onClick={() => setShowDialog(true)}>
          <UserPlus2 className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      <div className="grid gap-4">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{member.name}</h3>
                    <Badge variant="secondary" className={roleStyles[member.role]}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </Badge>
                    <Badge variant="secondary" className={statusStyles[member.status]}>
                      {member.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {member.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {member.phone}
                    </div>
                  </div>
                  {member.specialization && (
                    <p className="text-sm mt-1">
                      {specializations.find(s => s.value === member.specialization)?.label}
                      {member.registrationNumber && ` • Reg. ${member.registrationNumber}`}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {member.status !== 'inactive' ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(member)}
                    >
                      Edit
                    </Button>
                    {member.role !== 'owner' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(member.id)}
                      >
                        Deactivate
                      </Button>
                    )}
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReactivate(member.id)}
                  >
                    Reactivate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {teamMembers.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-32">
              <p className="text-muted-foreground text-sm">No team members added yet.</p>
              <Button
                variant="link"
                className="mt-2"
                onClick={() => setShowDialog(true)}
              >
                Add your first team member
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {editingId ? 'Edit Team Member' : 'Add Team Member'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {editingId
                ? 'Update team member information.'
                : 'Add a new member to your practice team.'}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: 'doctor' | 'assistant') =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="assistant">Assistant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+49 123 456789"
                />
              </div>
            </div>

            {formData.role === 'doctor' && (
              <>
                <div className="space-y-2">
                  <Label>Specialization</Label>
                  <Select
                    value={formData.specialization}
                    onValueChange={(value) =>
                      setFormData({ ...formData, specialization: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization..." />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((spec) => (
                        <SelectItem key={spec.value} value={spec.value}>
                          {spec.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Registration Number</Label>
                  <Input
                    value={formData.registrationNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, registrationNumber: e.target.value })
                    }
                    placeholder="DE123456"
                  />
                </div>
              </>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAdd}
              disabled={!formData.name || !formData.email || !formData.phone}
            >
              {editingId ? 'Save Changes' : 'Add Member'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}