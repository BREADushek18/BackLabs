import fs from 'fs';
import path from 'path';

const logFilePath = path.join(__dirname, '../../logs/user-events.log');

export function logUserRegisteredEvent(data: any) {
  const logEntry = `[${new Date().toISOString()}] User registered: ${JSON.stringify(
    data,
  )}\n`;
  fs.appendFileSync(logFilePath, logEntry, 'utf-8');
}
