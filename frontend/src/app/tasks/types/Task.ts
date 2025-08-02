export interface Task {
    _id: string;
    title: string;
    description?: string;
    status?: 'pending' | 'in-progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
    assignedTo?: string[]; // Array de user IDs
    createdBy?: string; // User ID
}
