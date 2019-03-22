import * as mysql from "mysql";

class Database {
  public connection: mysql.Connection;

  constructor(host: string, user: string, password: string) {
    this.connection = this.connect(host, user, password);
  }

  public connect(host: string, user: string, password: string) {
    const connection = mysql.createConnection({
      host,
      user,
      password
    });

    connection.connect(err => {
      if (err) {
        return console.log(err);
      }
    });

    return connection;
  }

  public getDatabases(connection: mysql.Connection, callback: any): void {
    connection.query("SHOW DATABASES", this.getQueryHandler(callback));
  }

  /**
   * Gets all tables for a database
   */
  public getTables(
    connection: mysql.Connection,
    database: string,
    callback: any
  ): void {
    connection.query(
      `SHOW TABLES FROM ${database}`,
      this.getQueryHandler(callback)
    );
  }

  /**
   * Runs an EXPLAIN on the query. If it doesn't run successfully, errors will come through,
   * which is what we want.
   */
  public lintQuery(
    connection: mysql.Connection,
    query: string,
    callback: any
  ): void {
    connection.query(`EXPLAIN ${query}`, (error, results, fields) => {
      if (error) {
        callback(error);
      }
    });
  }

  private getQueryHandler(callback: any) {
    return (error: mysql.MysqlError | null, results: any) => {
      if (error) {
        return console.log(error);
      }

      callback(results);
    };
  }
}

export { Database };
