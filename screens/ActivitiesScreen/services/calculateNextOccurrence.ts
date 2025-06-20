import { Task } from "@/entities/Task";

export const calculateNextOccurrence = (task: Omit<Task, 'id'>): Date => {
    const now = new Date();
    const created = new Date(task.createdAt);
    let nextDate = new Date(created);
    
    if (nextDate > now) return nextDate;
    
    switch (task.recurrence) {
      case 'DAILY':
        while (nextDate <= now) {
          nextDate.setDate(nextDate.getDate() + 1);
        }
        break;
      case 'WEEKLY':
        if (task.selectedDays?.length) {
          const currentDay = now.getDay();
          let daysToAdd = 0;
          
          const nextDay = task.selectedDays.find(day => day > currentDay) || 
                         task.selectedDays[0] + 7;
          
          daysToAdd = nextDay - currentDay;
          if (daysToAdd <= 0) daysToAdd += 7;
          
          nextDate = new Date(now);
          nextDate.setDate(now.getDate() + daysToAdd);
          nextDate.setHours(created.getHours(), created.getMinutes(), 0, 0);
        } else {
          nextDate.setDate(nextDate.getDate() + 7);
          while (nextDate <= now) {
            nextDate.setDate(nextDate.getDate() + 7);
          }
        }
        break;
      case 'MONTHLY':
        nextDate = new Date(now);
        nextDate.setDate(created.getDate());
        nextDate.setHours(created.getHours(), created.getMinutes(), 0, 0);
        
        if (nextDate <= now) {
          nextDate.setMonth(nextDate.getMonth() + 1);
        }
        if (nextDate <= now) {
          nextDate.setMonth(nextDate.getMonth() + 1);
        }
        break;
      case 'YEARLY':
        nextDate = new Date(now);
        nextDate.setMonth(created.getMonth(), created.getDate());
        nextDate.setHours(created.getHours(), created.getMinutes(), 0, 0);
        
        if (nextDate <= now) {
          nextDate.setFullYear(nextDate.getFullYear() + 1);
        }
        break;
        
      default:
        return created;
    }
    
    return nextDate;
  };