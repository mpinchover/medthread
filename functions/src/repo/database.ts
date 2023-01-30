import * as Mongo from "mongodb";

class Database {
  private static mongoDb: Mongo.Db;
  private static mongoClient: Mongo.MongoClient;

  private constructor() {
    //...
  }

  public static async getClient(): Promise<Mongo.MongoClient> {
    if (this.mongoClient) {
      console.log("DB CLIENT ALREADY EXISTS");
      return this.mongoClient;
    }

    console.log("CREATING MONGO CONNECTION...");

    const mongoClient = new Mongo.MongoClient(process.env.MONGO_URI);
    this.mongoClient = mongoClient;
    return this.mongoClient;
  }

  public static async getDb(): Promise<Mongo.Db> {
    if (this.mongoDb) {
      console.log("DB CONNECTION ALREADY EXISTS");
      return this.mongoDb;
    }

    console.log("CREATING MONGO CONNECTION...");

    const mongoClient = new Mongo.MongoClient(process.env.MONGO_URI);
    const mongoDb = mongoClient.db("medthread-local");
    this.mongoDb = mongoDb;
    return this.mongoDb;
  }
}

export default Database;
