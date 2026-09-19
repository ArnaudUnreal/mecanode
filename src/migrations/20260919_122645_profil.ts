import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_timeline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`period\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_timeline_order_idx\` ON \`pages_timeline\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_timeline_parent_id_idx\` ON \`pages_timeline\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_timeline_locales\` (
  	\`title\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_timeline\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_timeline_locales_locale_parent_id_unique\` ON \`pages_timeline_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_timeline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`period\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_version_timeline_order_idx\` ON \`_pages_v_version_timeline\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_timeline_parent_id_idx\` ON \`_pages_v_version_timeline\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_timeline_locales\` (
  	\`title\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_version_timeline\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_version_timeline_locales_locale_parent_id_unique\` ON \`_pages_v_version_timeline_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_locales\` ADD \`role\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_locales\` ADD \`version_role\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_timeline\`;`)
  await db.run(sql`DROP TABLE \`pages_timeline_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_timeline\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_timeline_locales\`;`)
  await db.run(sql`ALTER TABLE \`pages_locales\` DROP COLUMN \`role\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_locales\` DROP COLUMN \`version_role\`;`)
}
