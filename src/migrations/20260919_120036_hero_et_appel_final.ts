import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`site_settings_hero_meta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_hero_meta_order_idx\` ON \`site_settings_hero_meta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_hero_meta_parent_id_idx\` ON \`site_settings_hero_meta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_hero_meta_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings_hero_meta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`site_settings_hero_meta_locales_locale_parent_id_unique\` ON \`site_settings_hero_meta_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`site_settings_locales\` ADD \`hero_title\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings_locales\` ADD \`cta_title\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings_locales\` ADD \`cta_lede\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`site_settings_hero_meta\`;`)
  await db.run(sql`DROP TABLE \`site_settings_hero_meta_locales\`;`)
  await db.run(sql`ALTER TABLE \`site_settings_locales\` DROP COLUMN \`hero_title\`;`)
  await db.run(sql`ALTER TABLE \`site_settings_locales\` DROP COLUMN \`cta_title\`;`)
  await db.run(sql`ALTER TABLE \`site_settings_locales\` DROP COLUMN \`cta_lede\`;`)
}
