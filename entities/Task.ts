export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type Recurrence = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface Task {
    id: string;
    title: string;
    description?: string; 
    priority: Priority;
    recurrence: Recurrence;
    emailNotifications: boolean;
    lastCompletedAt: Date | null;
    selectedDays?: number[];
    nextOccurrence?: Date;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}