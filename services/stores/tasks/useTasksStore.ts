import { Task } from '@/entities/Task';
import { secureFetch } from '@/services/http/secureFetch';
import { create } from 'zustand';

interface TasksStore {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    tasks: Task[],
    setTasks: (tasks: Task[]) => void,
    completedTasksToday: Task[],
    setCompletedTasksToday: (completedTasksToday: Task[]) => void,
    skip: number,
    take: number,
    isEnd: boolean,

    // functions crud
    getTasks: (options?: { reset?: boolean }) => Promise<Task[] | []>;
    createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'lastCompletedAt' | 'userId'>) => Promise<Task>;
    deleteTask: (taskId: string) => Promise<boolean>;
    enableNotification: (taskId: string, newValue: boolean) => Promise<boolean>;
    completeTask: (taskId: string) => Promise<boolean>;
    getCompletedTasksToday: () => Promise<Task[] | []>;
}

export const useTasksStore = create<TasksStore>((set, get) => ({
    loading: false,
    setLoading: (loading) => set({ loading }),
    error: null,
    setError: (error) => set({ error }),
    tasks: [],
    setTasks: (tasks) => set({ tasks }),
    completedTasksToday: [],
    setCompletedTasksToday: (completedTasksToday) => set({ completedTasksToday }),
    skip: 0,
    take: 10,
    isEnd: false,

    getTasks: async (options = { reset: false }) => {
        const { loading, isEnd, take, skip, setLoading, setError } = get();

        if (loading) return;

        if (!options.reset && isEnd) return;

        set({ loading: true, error: null });

        const currentSkip = options.reset ? 0 : skip;
        const url = `/tasks/all?skip=${currentSkip}&take=${take}`;

        const { data, error } = await secureFetch(url, {
            method: 'GET',
            content_type: 'application/json',
        }, setLoading);

        if (error) {
            setError(error)
            console.log(error)

            return []
        }

        if (data && Array.isArray(data)) {
                set(state => ({
                    tasks: options.reset ? data : [...state.tasks, ...data],
                    skip: currentSkip + data.length,
                    isEnd: data.length < take,
                }));
            }

        return data
    },
    createTask: async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'lastCompletedAt' | 'userId'>) => {
        const { setLoading, setError, setTasks } = get()
        setError(null)
        const { data, error } = await secureFetch(`/tasks/save`, {
            method: 'POST',
            content_type: 'application/json',
            stringify: true,
            body: task
        }, setLoading)

        if (error) {
            setError(error)
            console.log(error)
            return {} as Task
        }

        if (data) {
            setError(null)
            setTasks([data, ...get().tasks])
            return data
        }

        return {} as Task
    },

    deleteTask: async (taskId: string) => {
        const { setLoading, setError, tasks, setTasks } = get()
        setError(null)
        
        const previousTasks = [...tasks]
        setTasks(tasks.filter(task => task.id !== taskId))
        
        const { error } = await secureFetch(`/tasks/delete/${taskId}`, {
            method: 'DELETE',
            content_type: 'application/json',
        }, setLoading)

        if (error) {
            setTasks(previousTasks)
            setError(error)
            console.error('Error deleting task:', error)
            return false
        }

        return true
    },

    enableNotification: async (taskId: string, newValue: boolean) => {
        const { setLoading, setError, tasks, setTasks } = get()
        setError(null)
        
        const previousTasks = [...tasks]
        setTasks(tasks.map(task => 
            task.id === taskId ? { ...task, emailNotifications: newValue } : task
        ));
        
        const { error, data } = await secureFetch(`/tasks/enable/reminder/${taskId}/${newValue}`, {
            method: 'PUT',
            content_type: 'application/json',
            stringify: true,
        }, setLoading)

        if (error) {
            setTasks(previousTasks)
            setError(error)
            console.error('Error enabling notification:', error)
            return false
        }

        if (data) {
            setError(null)
            return true
        }

        return false
    },

    async completeTask(taskId: string) {
        const { setLoading, setError, tasks, setTasks } = get()
        setError(null)
        
        const previousTasks = [...tasks]
        setTasks(tasks.map(task => 
            task.id === taskId ? { ...task, lastCompletedAt: new Date() } : task
        ));
        
        const { error, data } = await secureFetch(`/tasks/complete/${taskId}`, {
            method: 'PUT',
            content_type: 'application/json',
            stringify: true,
        }, setLoading)

        if (error) {
            setTasks(previousTasks)
            setError(error)
            console.error('Error completing task:', error)
            return false
        }

        if (data) {
            setError(null)
            return true
        }

        return false
    },

    async getCompletedTasksToday(options = { reset: false, skip: 0, take: 10 }) {
        const { setLoading, setError, setCompletedTasksToday, loading } = get()
        
        setError(null)
        if (loading) return
        if (options.reset) {
            setCompletedTasksToday([])
        }

        const currentSkip = options.reset ? 0 : get().completedTasksToday.length;
        const { error, data } = await secureFetch(`/tasks/all/completed-today?skip=${currentSkip}&take=${options.take}`, {
            method: 'GET',
            content_type: 'application/json',
        }, setLoading)

        if (error) {
            setError(error)
            console.error('Error completing task:', error)
            return []
        }

        if (data) {
            setError(null)
            if (Array.isArray(data) && data.length === 0) return
            if (options.skip > 10) {   
                setCompletedTasksToday([...data, ...get().completedTasksToday])
                return data
            }
            
            setCompletedTasksToday(data)
            return data
        }

        return []
    },
   
}))