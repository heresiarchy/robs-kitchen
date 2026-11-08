import {sqliteTable,text,integer,primaryKey,check} from 'drizzle-orm/sqlite-core';
import {sql} from 'drizzle-orm';
export const records=sqliteTable('kitchen_records',{owner:text('owner').notNull(),id:text('id').notNull(),kind:text('kind').notNull(),data:text('data').notNull(),updatedAt:text('updated_at').notNull()},t=>[primaryKey({columns:[t.owner,t.id]})]);
export const meta=sqliteTable('kitchen_meta',{owner:text('owner').primaryKey(),revision:integer('revision').notNull()},t=>[check('revision_positive',sql`${t.revision} > 0`)]);
export const operations=sqliteTable('kitchen_operations',{owner:text('owner').notNull(),id:text('id').notNull(),fingerprint:text('fingerprint').notNull(),result:text('result').notNull(),createdAt:text('created_at').notNull()},t=>[primaryKey({columns:[t.owner,t.id]})]);
