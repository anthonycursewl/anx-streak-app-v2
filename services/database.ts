import * as SQLite from 'expo-sqlite';

export interface Activity {
  id: number;
  description: string;
  type: string;
  intensity: string;
  duration: number;
  mood: string;
  created_at: string;
}

export interface Streak {
  id: number;
  length: number;      
  start_date: string;  
  end_date: string;    
}

const dbPromise = SQLite.openDatabaseAsync('activities.db');

export const initDatabase = async (): Promise<boolean> => {
  try {
    const db = await dbPromise;
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        type TEXT NOT NULL,
        intensity TEXT NOT NULL,
        duration INTEGER NOT NULL,
        mood TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now', 'localtime')),
        activity_date TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(activity_date);
      
      CREATE TABLE IF NOT EXISTS streaks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        length INTEGER NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL UNIQUE
      );

      CREATE INDEX IF NOT EXISTS idx_streaks_end_date ON streaks(end_date);
    `);
    
    console.log('Database initialized with activities and streaks tables.');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const logActivity = async (activity: Omit<Activity, 'id' | 'created_at' | 'activity_date'>): Promise<number> => {
  const db = await dbPromise;

  // ▼▼▼ 1. DECLARAMOS UNA VARIABLE PARA CAPTURAR EL ID ▼▼▼
  let insertedId: number = 0;

  // ▼▼▼ 2. YA NO ASIGNAMOS EL RESULTADO DE la transacción A UNA CONSTANTE ▼▼▼
  await db.withTransactionAsync(async () => {
    // Toda la lógica interna de la transacción permanece idéntica...
    const today = new Date().toISOString().slice(0, 10);

    const lastActivity = await db.getFirstAsync<{ last_date: string }>(
      `SELECT MAX(activity_date) as last_date FROM activities`
    );
    const lastActivityDate = lastActivity?.last_date;

    if (lastActivityDate && lastActivityDate !== today) {
      const daysSinceLastActivity = Math.round(
        (new Date(today).getTime() - new Date(lastActivityDate).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastActivity > 1) {
        console.log(`Streak broken. Last activity was on ${lastActivityDate}. Today is ${today}.`);
        const lostStreakQuery = `
          WITH RECURSIVE
            activity_days AS (SELECT DISTINCT activity_date FROM activities),
            streak_chain(d) AS (
              VALUES(?)
              UNION ALL
              SELECT date(d, '-1 day')
              FROM streak_chain
              WHERE EXISTS (SELECT 1 FROM activity_days WHERE activity_date = date(streak_chain.d, '-1 day'))
            )
          SELECT
            MIN(d) AS start_date,
            COUNT(*) AS length
          FROM streak_chain;
        `;

        const lostStreak = await db.getFirstAsync<{ start_date: string; length: number }>(
          lostStreakQuery,
          [lastActivityDate]
        );

        if (lostStreak && lostStreak.length > 0) {
          console.log(`Saving lost streak: ${lostStreak.length} days, from ${lostStreak.start_date} to ${lastActivityDate}`);
          await db.runAsync(
            `INSERT INTO streaks (length, start_date, end_date) VALUES (?, ?, ?)
             ON CONFLICT(end_date) DO NOTHING`,
            [lostStreak.length, lostStreak.start_date, lastActivityDate]
          );
        }
      }
    }

    const insertResult = await db.runAsync(
      `INSERT INTO activities (description, type, intensity, duration, mood, activity_date) VALUES (?, ?, ?, ?, ?, ?)`,
      [activity.description, activity.type, activity.intensity, activity.duration, activity.mood, today]
    );

    // ▼▼▼ 3. EN LUGAR DE 'RETURN', ASIGNAMOS EL VALOR A LA VARIABLE EXTERNA ▼▼▼
    insertedId = insertResult.lastInsertRowId;
  });

  return insertedId;
};

/**
 * Obtiene todas las actividades de la base de datos, ordenadas por fecha de creación.
 */
export const getAllActivities = async (): Promise<Activity[]> => {
  try {
    const db = await dbPromise;

    // `getAllAsync` es para sentencias SELECT que devuelven múltiples filas.
    // Devuelve directamente un array de objetos con el tipo que le especifiquemos.
    return await db.getAllAsync<Activity>('SELECT * FROM activities ORDER BY created_at DESC');
  } catch (error) {
    console.error('Error getting activities:', error);
    throw error;
  }
};

/**
 * Obtiene actividades dentro de un rango de fechas específico.
 */
export const getActivitiesByDateRange = async (startDate: string, endDate: string): Promise<Activity[]> => {
  try {
    const db = await dbPromise;
    return await db.getAllAsync<Activity>(
      `SELECT * FROM activities WHERE date(created_at) BETWEEN date(?) AND date(?) ORDER BY created_at DESC`,
      [startDate, endDate]
    );
  } catch (error) {
    console.error('Error getting activities by date range:', error);
    throw error;
  }
};

/**
 * Obtiene la racha actual (días consecutivos con actividad hasta hoy o ayer).
 * Esta función no modifica datos, solo lee el estado actual.
 */
export const getCurrentStreak = async (): Promise<number> => {
  try {
    const db = await dbPromise;
    const result = await db.getFirstAsync<{ streak: number }>(`
      WITH RECURSIVE
        activity_days AS (SELECT DISTINCT activity_date FROM activities),
        streak_start_date AS (
          SELECT MAX(activity_date) as last_day
          FROM activity_days
          WHERE activity_date IN (date('now', 'localtime'), date('now', 'localtime', '-1 day'))
        ),
        streak_counter(streak_day, length) AS (
          SELECT last_day, 1 FROM streak_start_date WHERE last_day IS NOT NULL
          UNION ALL
          SELECT date(sc.streak_day, '-1 day'), sc.length + 1
          FROM streak_counter sc
          JOIN activity_days ad ON ad.activity_date = date(sc.streak_day, '-1 day')
        )
      SELECT COALESCE(MAX(length), 0) as streak FROM streak_counter;
    `);
    console.log(result)
    return result?.streak || 0;
  } catch (error) {
    console.error('Error getting current streak:', error);
    return 0;
  }
};

/**
 * Obtiene todas las rachas pasadas guardadas, ordenadas de la más reciente a la más antigua.
 */
export const getPastStreaks = async (): Promise<Streak[]> => {
  try {
    const db = await dbPromise;
    return await db.getAllAsync<Streak>('SELECT * FROM streaks ORDER BY end_date DESC');
  } catch (error) {
    console.error('Error getting past streaks:', error);
    return []; // Devuelve un array vacío en caso de error
  }
};

/**
 * Obtiene un número limitado de actividades recientes.
 */
export const getRecentActivities = async (limit = 10): Promise<Activity[]> => {
  try {
    const db = await dbPromise;
    return await db.getAllAsync<Activity>(
      'SELECT * FROM activities ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
  } catch (error) {
    console.error('Error getting recent activities:', error);
    throw error;
  }
};

/**
 * Verifica si ya se registró una actividad en el día de hoy.
 */
export const hasActivityToday = async (): Promise<boolean> => {
  try {
    const db = await dbPromise;
    const result = await db.getFirstAsync(
      `SELECT 1 FROM activities WHERE date(created_at, 'localtime') = date('now', 'localtime') LIMIT 1`
    );
    
    // Si `result` no es nulo, significa que se encontró una fila, por lo que hay actividad.
    return !!result;
  } catch (error) {
    console.error('Error checking today\'s activity:', error);
    // En caso de error, es más seguro devolver false.
    return false;
  }
};