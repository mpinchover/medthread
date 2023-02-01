import * as mysql2 from "mysql2/promise";

class Database {
  private static mysqlDB: mysql2.Connection;
  //   private static mongoClient: Mongo.MongoClient;

  private constructor() {
    //...
  }

  //   public static async getClient(): Promise<Mongo.MongoClient> {
  //     if (this.mongoClient) {
  //       console.log("DB CLIENT ALREADY EXISTS");
  //       return this.mongoClient;
  //     }

  //     console.log("CREATING MONGO CONNECTION...");

  //     const mongoClient = new Mongo.MongoClient(process.env.MONGO_URI);
  //     this.mongoClient = mongoClient;
  //     return this.mongoClient;
  //   }

  public static async getDb(): Promise<mysql2.Connection> {
    if (this.mysqlDB) {
      return this.mysqlDB;
    }

    const port: number = parseInt(process.env.MYSQL_PORT);
    const connection = await mysql2.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port,
    });
    return connection;
  }
}

export default Database;
