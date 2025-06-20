import { Priority } from "@/entities/Task";

export const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'HIGH': return '#ff6b6b';
      case 'MEDIUM': return '#ffd93d';
      case 'LOW': return '#6bcb77';
      default: return '#6bcb77';
    }
  };

  export const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case 'HIGH': return 'High';
      case 'MEDIUM': return 'Medium';
      case 'LOW': return 'Low';
      default: return '';
    }
  };