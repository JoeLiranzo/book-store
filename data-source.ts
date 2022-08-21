import "reflect-metadata";
import { DataSource } from "typeorm";

export const appDataSource = new DataSource({
    type: "postgres",
    host: "192.168.100.19",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "bookstore",
	entities: ["dist/src/**/*.entity.js"],
	migrations: ["dist/src/database/migrations/*.js"],
	//entities: ["src/**/**/*.entity{.ts,.js}"],
	//migrations: ["src/database/migrations/*{.ts,.js}"],
})

// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
appDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })
