import {
  connect,
  connection,
  Connection
} from 'mongoose';

import { environment } from './index';

/**
 * Database initialization
 */
export const dbInit = (): void => {
  const connectionString: string = `mongodb://${environment.dbHost}:${environment.dbPort}/${environment.dbName}`;
  connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
  const db: Connection = connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', (err: Error) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log('Database connected at ' + connectionString);
    }
  });
};
