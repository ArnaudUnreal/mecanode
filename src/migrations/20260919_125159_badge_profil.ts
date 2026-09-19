import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages_locales\` ADD \`badge_title\` text;`)
  await db.run(sql`ALTER TABLE \`pages_locales\` ADD \`badge_text\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_locales\` ADD \`version_badge_title\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_locales\` ADD \`version_badge_text\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages_locales\` DROP COLUMN \`badge_title\`;`)
  await db.run(sql`ALTER TABLE \`pages_locales\` DROP COLUMN \`badge_text\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_locales\` DROP COLUMN \`version_badge_title\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_locales\` DROP COLUMN \`version_badge_text\`;`)
}
