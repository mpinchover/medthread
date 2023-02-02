import * as mysql2 from "mysql2/promise";

class Database {
  private static mysqlDB: mysql2.Connection;

  private constructor() {
    //...
  }

  public static async closeConn() {
    if (this.mysqlDB) {
      await this.mysqlDB.end();
    }
  }

  public static async getDb(): Promise<mysql2.Connection> {
    if (this.mysqlDB) {
      return this.mysqlDB;
    }

    let host, user, password, database, port;

    host = process.env.MEDTHREAD_HOST;
    user = process.env.MEDTHREAD_USER;
    password = process.env.MEDTHREAD_PASSWORD;
    database = process.env.MEDTHREAD_DATABASE;
    port = parseInt(process.env.MEDTHREAD_PORT);

    const connection = await mysql2.createConnection({
      host,
      user,
      password,
      database,
      port,
    });
    this.mysqlDB = connection;
    return connection;
  }
}

export default Database;
