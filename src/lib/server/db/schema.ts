import { timestamp } from 'drizzle-orm/mysql-core';
import { mysqlTable, serial, int, varchar } from 'drizzle-orm/mysql-core';

// export const user = mysqlTable('user', {
// 	id: serial('id').primaryKey(),
// 	age: int('age')
// });

export const modpackTable = mysqlTable('modpacks', {
	id: serial('id').primaryKey(),
	modpackName: varchar('name', { length: 255 }),
	downloadCount: int('download_count').default(0),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});
