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

interface DentistTeamMember {
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
  { value: 'general', label: 'Allgemeine Zahnheilkunde' },
  { value: 'orthodontics', label: 'Kieferorthopädie' },
  { value: 'endodontics', label: 'Endodontie' },
  { value: 'periodontics', label: 'Parodontologie' },
  { value: 'prosthodontics', label: 'Prothetik' },
  { value: 'oral_surgery', label: 'Oralchirurgie' },
];

const roleStyles = {
  owner: 'bg-purple-100 text-purple-800',
  doctor: 'bg-blue-100 text-blue-800',
  assistant: 'bg-green-100 text-green-800',
};

const statusStyles = {
  active: 'bg-green-100 text-green-800',
  invited: 'bg-yellow-100 text-yellow-800',
  inactive: 'bg-gray-100 text-gray-800',
};

export function DentistTeamSettings() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<DentistTeamMember[]>([
    {
      id: '1',
      name: 'Dr. Sarah Schmidt',
      role: 'owner',
      email: 'sarah@example.com',
      phone: '+49 123 456789',
      specialization: 'general',
      registrationNumber: 'DE123456',
      status: 'active',
    },
    {
      id: '2',
      name: 'Dr. Michael Weber',
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
      const newMember: DentistTeamMember = {
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

  const handleEdit = (member: DentistTeamMember) => {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Praxisteam</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihr Praxisteam und deren Zugriffsrechte
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
                      {member.role === 'owner' ? 'Inhaber' : 
                       member.role === 'doctor' ? 'Zahnarzt' : 'Assistent'}
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
                : 'Fügen Sie ein neues Mitglied zu Ihrem Praxisteam hinzu.'}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. Max Mustermann"
              />
            </div>

            <div className="space-y-2">
              <Label>Rolle</Label>
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
                  <SelectItem value="doctor">Zahnarzt</SelectItem>
                  <SelectItem value="assistant">Assistent</SelectItem>
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

            {formData.role === 'doctor' && (
              <>
                <div className="space-y-2">
                  <Label>Fachrichtung</Label>
                  <Select
                    value={formData.specialization}
                    onValueChange={(value) =>
                      setFormData({ ...formData, specialization: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Fachrichtung auswählen..." />
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
                  <Label>Registrierungsnummer</Label>
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