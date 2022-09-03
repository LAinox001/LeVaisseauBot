import {Database} from "better-sqlite3";
import SQLite from "better-sqlite3";
const database: Database = new SQLite("./database.sqlite");
const createTable: string = "CREATE TABLE IF NOT EXISTS scores('id' varchar, 'score' number, 'responded' boolean);";

database.exec(createTable);
database.exec("CREATE UNIQUE INDEX IF NOT EXISTS ux_scores_id ON scores(id);");
console.log("Database created.");

export default database;