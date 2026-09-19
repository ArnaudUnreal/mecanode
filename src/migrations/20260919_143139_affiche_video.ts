import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`tools\` ADD \`video_poster_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`tools_video_poster_idx\` ON \`tools\` (\`video_poster_id\`);`)
  await db.run(sql`ALTER TABLE \`_tools_v\` ADD \`version_video_poster_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_tools_v_version_version_video_poster_idx\` ON \`_tools_v\` (\`version_video_poster_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_tools\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`main_image_id\` integer,
  	\`video_url\` text,
  	\`category_id\` integer,
  	\`fab_url\` text,
  	\`release_date\` text,
  	\`featured\` integer DEFAULT false,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`main_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`tags\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_tools\`("id", "name", "main_image_id", "video_url", "category_id", "fab_url", "release_date", "featured", "slug", "updated_at", "created_at", "_status") SELECT "id", "name", "main_image_id", "video_url", "category_id", "fab_url", "release_date", "featured", "slug", "updated_at", "created_at", "_status" FROM \`tools\`;`)
  await db.run(sql`DROP TABLE \`tools\`;`)
  await db.run(sql`ALTER TABLE \`__new_tools\` RENAME TO \`tools\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`tools_main_image_idx\` ON \`tools\` (\`main_image_id\`);`)
  await db.run(sql`CREATE INDEX \`tools_category_idx\` ON \`tools\` (\`category_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`tools_slug_idx\` ON \`tools\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`tools_updated_at_idx\` ON \`tools\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`tools_created_at_idx\` ON \`tools\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`tools__status_idx\` ON \`tools\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__tools_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_name\` text,
  	\`version_main_image_id\` integer,
  	\`version_video_url\` text,
  	\`version_category_id\` integer,
  	\`version_fab_url\` text,
  	\`version_release_date\` text,
  	\`version_featured\` integer DEFAULT false,
  	\`version_slug\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`tools\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_main_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_category_id\`) REFERENCES \`tags\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__tools_v\`("id", "parent_id", "version_name", "version_main_image_id", "version_video_url", "version_category_id", "version_fab_url", "version_release_date", "version_featured", "version_slug", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "snapshot", "published_locale", "latest") SELECT "id", "parent_id", "version_name", "version_main_image_id", "version_video_url", "version_category_id", "version_fab_url", "version_release_date", "version_featured", "version_slug", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "snapshot", "published_locale", "latest" FROM \`_tools_v\`;`)
  await db.run(sql`DROP TABLE \`_tools_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__tools_v\` RENAME TO \`_tools_v\`;`)
  await db.run(sql`CREATE INDEX \`_tools_v_parent_idx\` ON \`_tools_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_version_version_main_image_idx\` ON \`_tools_v\` (\`version_main_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_version_version_category_idx\` ON \`_tools_v\` (\`version_category_id\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_version_version_slug_idx\` ON \`_tools_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_version_version_updated_at_idx\` ON \`_tools_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_version_version_created_at_idx\` ON \`_tools_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_version_version__status_idx\` ON \`_tools_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_created_at_idx\` ON \`_tools_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_updated_at_idx\` ON \`_tools_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_snapshot_idx\` ON \`_tools_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_published_locale_idx\` ON \`_tools_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_latest_idx\` ON \`_tools_v\` (\`latest\`);`)
}
