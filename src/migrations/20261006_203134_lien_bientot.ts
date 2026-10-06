import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_site_settings_elsewhere\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`url\` text,
  	\`soon\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_site_settings_elsewhere\`("_order", "_parent_id", "id", "label", "url", "soon") SELECT "_order", "_parent_id", "id", "label", "url", false FROM \`site_settings_elsewhere\`;`)
  await db.run(sql`DROP TABLE \`site_settings_elsewhere\`;`)
  await db.run(sql`ALTER TABLE \`__new_site_settings_elsewhere\` RENAME TO \`site_settings_elsewhere\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`site_settings_elsewhere_order_idx\` ON \`site_settings_elsewhere\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_elsewhere_parent_id_idx\` ON \`site_settings_elsewhere\` (\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_site_settings_elsewhere\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_site_settings_elsewhere\`("_order", "_parent_id", "id", "label", "url") SELECT "_order", "_parent_id", "id", "label", coalesce("url", '') FROM \`site_settings_elsewhere\`;`)
  await db.run(sql`DROP TABLE \`site_settings_elsewhere\`;`)
  await db.run(sql`ALTER TABLE \`__new_site_settings_elsewhere\` RENAME TO \`site_settings_elsewhere\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`site_settings_elsewhere_order_idx\` ON \`site_settings_elsewhere\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_elsewhere_parent_id_idx\` ON \`site_settings_elsewhere\` (\`_parent_id\`);`)
}
