'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Calendar, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProjectCreated: () => void;
}

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }: CreateProjectModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'planning',
        priority: 'medium',
        startDate: '',
        endDate: '',
        deadline: '',
        assignedUsers: [] as Array<{ user: string; role: string }>,
        settings: {
            isPublic: false,
            allowMemberInvite: true
        }
    });
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const { token } = useAuth();

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const response = await fetch('http://localhost:3000/api/auth/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/projects', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                onProjectCreated();
                resetForm();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Error al crear el proyecto');
            }
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Error al crear el proyecto');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            status: 'planning',
            priority: 'medium',
            startDate: '',
            endDate: '',
            deadline: '',
            assignedUsers: [],
            settings: {
                isPublic: false,
                allowMemberInvite: true
            }
        });
    };

    const addUser = (userId: string, role: string) => {
        if (!formData.assignedUsers.some(u => u.user === userId)) {
            setFormData(prev => ({
                ...prev,
                assignedUsers: [...prev.assignedUsers, { user: userId, role }]
            }));
        }
    };

    const removeUser = (userId: string) => {
        setFormData(prev => ({
            ...prev,
            assignedUsers: prev.assignedUsers.filter(u => u.user !== userId)
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/90 backdrop-blur-sm border-white/20 shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-2xl font-bold text-slate-800">
                        Crear Nuevo Proyecto
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-700"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name" className="text-slate-700">
                                    Nombre del Proyecto *
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="bg-white/60 border-blue-200 focus:border-blue-400"
                                    required
                                    placeholder="Ej: Desarrollo de aplicación móvil"
                                />
                            </div>

                            <div>
                                <Label htmlFor="description" className="text-slate-700">
                                    Descripción
                                </Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="bg-white/60 border-blue-200 focus:border-blue-400"
                                    placeholder="Describe el objetivo y alcance del proyecto..."
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="status" className="text-slate-700">
                                        Estado
                                    </Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                                    >
                                        <SelectTrigger className="bg-white/60 border-blue-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="planning">Planificación</SelectItem>
                                            <SelectItem value="active">Activo</SelectItem>
                                            <SelectItem value="on-hold">En Pausa</SelectItem>
                                            <SelectItem value="completed">Completado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="priority" className="text-slate-700">
                                        Prioridad
                                    </Label>
                                    <Select
                                        value={formData.priority}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                                    >
                                        <SelectTrigger className="bg-white/60 border-blue-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Baja</SelectItem>
                                            <SelectItem value="medium">Media</SelectItem>
                                            <SelectItem value="high">Alta</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="h-4 w-4 text-blue-600" />
                                <Label className="text-slate-700 font-medium">Fechas del Proyecto</Label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="startDate" className="text-slate-700">
                                        Fecha de Inicio
                                    </Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                        className="bg-white/60 border-blue-200 focus:border-blue-400"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="endDate" className="text-slate-700">
                                        Fecha de Fin
                                    </Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                        className="bg-white/60 border-blue-200 focus:border-blue-400"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="deadline" className="text-slate-700">
                                        Deadline
                                    </Label>
                                    <Input
                                        id="deadline"
                                        type="date"
                                        value={formData.deadline}
                                        onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                                        className="bg-white/60 border-blue-200 focus:border-blue-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Team Members */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="h-4 w-4 text-blue-600" />
                                <Label className="text-slate-700 font-medium">Miembros del Equipo</Label>
                            </div>

                            {loadingUsers ? (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {users.map((user) => {
                                        const isAssigned = formData.assignedUsers.some(u => u.user === user._id);
                                        return (
                                            <div key={user._id} className="flex items-center justify-between p-3 bg-white/40 rounded-lg border border-blue-100">
                                                <div>
                                                    <p className="font-medium text-slate-800">{user.name}</p>
                                                    <p className="text-sm text-slate-600">{user.email}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {isAssigned ? (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => removeUser(user._id)}
                                                            className="border-red-200 text-red-600 hover:bg-red-50"
                                                        >
                                                            Remover
                                                        </Button>
                                                    ) : (
                                                        <div className="flex gap-1">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => addUser(user._id, 'member')}
                                                                className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                                            >
                                                                + Miembro
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => addUser(user._id, 'lead')}
                                                                className="border-green-200 text-green-600 hover:bg-green-50"
                                                            >
                                                                + Lead
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-blue-100">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="border-slate-200 text-slate-600 hover:bg-slate-50"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading || !formData.name.trim()}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Creando...
                                    </div>
                                ) : (
                                    'Crear Proyecto'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
