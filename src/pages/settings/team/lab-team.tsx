import { useState } from 'react';
import { Plus, X, UserPlus2, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

interface LabTeamMember {
  id: string;
  name: string;
  role: 'owner' | 'technician' | 'driver' | 'admin';
  email: string;
  phone: string;
  specialization?: string;
  status: 'active' | 'invited' | 'inactive';
}

const specializations = [
  { value: 'crown_bridge', label: 'Kronen und Brücken' },
  { value: 'implants', label: 'Implantate' },
  { value: 'cad_cam', label: 'CAD/CAM' },
  { value: 'ceramics', label: 'Keramik' },
  { value: 'orthodontics', label: 'Kieferorthopädie' },
  { value: 'dentures', label: 'Prothetik' },
];

const roleStyles = {
  owner: 'bg-purple-100 text-purple-800',
  technician: 'bg-blue-100 text-blue-800',
  driver: 'bg-green-100 text-green-800',
  admin: 'bg-orange-100 text-orange-800',
};

const statusStyles = {
  active: 'bg-green-100 text-green-800',
  invited: 'bg-yellow-100 text-yellow-800',
  inactive: 'bg-gray-100 text-gray-800',
};

export function LabTeamSettings() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<LabTeamMember[]>([
    {
      id: '1',
      name: 'Thomas Weber',
      role: 'owner',
      email: 'thomas@example.com',
      phone: '+49 123 456789',
      specialization: 'crown_bridge',
      status: 'active',
    },
    {
      id: '2',
      name: 'Anna Schmidt',
      role: 'technician',
      email: 'anna@example.com',
      phone: '+49 234 567890',
      specialization: 'ceramics',
      status: 'active',
    },
    {
      id: '3',
      name: 'Klaus Müller',
      role: 'driver',
      email: 'klaus@example.com',
      phone: '+49 345 678901',
      status: 'active',
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    role: 'technician' as const,
    email: '',
    phone: '',
    specialization: '',
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
      const newMember: LabTeamMember = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        status: 'invited',
      };
      setTeamMembers([...teamMembers, newMember]);
    }
    setFormData({
      name: '',
      role: 'technician',
      email: '',
      phone: '',
      specialization: '',
    });
    setShowDialog(false);
  };

  const handleEdit = (member: LabTeamMember) => {
    setFormData({
      name: member.name,
      role: member.role,
      email: member.email,
      phone: member.phone,
      specialization: member.specialization || '',
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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner': return 'Inhaber';
      case 'technician': return 'Techniker';
      case 'driver': return 'Fahrer';
      case 'admin': return 'Verwaltung';
      default: return role;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Laborteam</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihr Laborteam und deren Zugriffsrechte
          </p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <UserPlus2 className="h-4 w-4 mr-2" />
          Teammitglied hinzufügen
        </Button>
      </div>

      <div className="grid gap-4">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{member.name}</h3>
                    <Badge variant="secondary" className={roleStyles[member.role]}>
                      {getRoleLabel(member.role)}
                    </Badge>
                    <Badge variant="secondary" className={statusStyles[member.status]}>
                      {member.status === 'active' ? 'Aktiv' :
                       member.status === 'invited' ? 'Eingeladen' : 'Inaktiv'}
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
                      Bearbeiten
                    </Button>
                    {member.role !== 'owner' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(member.id)}
                      >
                        Deaktivieren
                      </Button>
                    )}
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReactivate(member.id)}
                  >
                    Reaktivieren
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {editingId ? 'Teammitglied bearbeiten' : 'Teammitglied hinzufügen'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {editingId
                ? 'Aktualisieren Sie die Informationen des Teammitglieds.'
                : 'Fügen Sie ein neues Mitglied zu Ihrem Laborteam hinzu.'}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Max Mustermann"
              />
            </div>

            <div className="space-y-2">
              <Label>Rolle</Label>
              <Select
                value={formData.role}
                onValueChange={(value: 'technician' | 'driver' | 'admin') =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technician">Techniker</SelectItem>
                  <SelectItem value="driver">Fahrer</SelectItem>
                  <SelectItem value="admin">Verwaltung</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>E-Mail</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="max@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+49 123 456789"
                />
              </div>
            </div>

            {formData.role === 'technician' && (
              <div className="space-y-2">
                <Label>Spezialisierung</Label>
                <Select
                  value={formData.specialization}
                  onValueChange={(value) =>
                    setFormData({ ...formData, specialization: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Spezialisierung auswählen..." />
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
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAdd}
              disabled={!formData.name || !formData.email || !formData.phone}
            >
              {editingId ? 'Speichern' : 'Hinzufügen'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}