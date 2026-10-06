import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/**
 * Le parcours devient un tableau par langue : chaque étape est recopiée dans chaque langue
 * où elle a un texte, avec sa période. La migration générée supprimait les traductions avant
 * de les recopier ; celle-ci reconstruit les tables pour ne rien perdre.
 *
 * Les identifiants de ligne doivent rester uniques entre langues : l'anglais garde le sien,
 * les autres langues en reçoivent un neuf, repris dans les versions pour qu'une restauration
 * retrouve les mêmes lignes.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TEMP TABLE \`timeline_ids\` (
  	\`old_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`new_id\` text NOT NULL,
  	PRIMARY KEY (\`old_id\`, \`_locale\`)
  );
  `)
  await db.run(sql`INSERT INTO \`timeline_ids\` (\`old_id\`, \`_locale\`, \`new_id\`)
  	SELECT \`_parent_id\`, \`_locale\`,
  		CASE WHEN \`_locale\` = 'en' THEN \`_parent_id\` ELSE lower(hex(randomblob(12))) END
  	FROM \`pages_timeline_locales\`;
  `)

  await db.run(sql`CREATE TABLE \`__new_pages_timeline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`period\` text,
  	\`title\` text,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_timeline\`
  	(\`_order\`, \`_parent_id\`, \`_locale\`, \`id\`, \`period\`, \`title\`, \`text\`)
  	SELECT t.\`_order\`, t.\`_parent_id\`, l.\`_locale\`, m.\`new_id\`, t.\`period\`, l.\`title\`, l.\`text\`
  	FROM \`pages_timeline\` t
  	JOIN \`pages_timeline_locales\` l ON l.\`_parent_id\` = t.\`id\`
  	JOIN \`timeline_ids\` m ON m.\`old_id\` = t.\`id\` AND m.\`_locale\` = l.\`_locale\`;
  `)

  await db.run(sql`CREATE TABLE \`__new__pages_v_version_timeline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`period\` text,
  	\`title\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_version_timeline\`
  	(\`_order\`, \`_parent_id\`, \`_locale\`, \`period\`, \`title\`, \`text\`, \`_uuid\`)
  	SELECT t.\`_order\`, t.\`_parent_id\`, l.\`_locale\`, t.\`period\`, l.\`title\`, l.\`text\`,
  		CASE WHEN l.\`_locale\` = 'en' THEN t.\`_uuid\`
  			ELSE coalesce(m.\`new_id\`, lower(hex(randomblob(12)))) END
  	FROM \`_pages_v_version_timeline\` t
  	JOIN \`_pages_v_version_timeline_locales\` l ON l.\`_parent_id\` = t.\`id\`
  	LEFT JOIN \`timeline_ids\` m ON m.\`old_id\` = t.\`_uuid\` AND m.\`_locale\` = l.\`_locale\`
  	ORDER BY t.\`id\`, l.\`_locale\`;
  `)

  await db.run(sql`DROP TABLE \`pages_timeline_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_timeline\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_timeline\` RENAME TO \`pages_timeline\`;`)
  await db.run(sql`CREATE INDEX \`pages_timeline_order_idx\` ON \`pages_timeline\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_timeline_parent_id_idx\` ON \`pages_timeline\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_timeline_locale_idx\` ON \`pages_timeline\` (\`_locale\`);`)

  await db.run(sql`DROP TABLE \`_pages_v_version_timeline_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_timeline\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_version_timeline\` RENAME TO \`_pages_v_version_timeline\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_timeline_order_idx\` ON \`_pages_v_version_timeline\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_timeline_parent_id_idx\` ON \`_pages_v_version_timeline\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_timeline_locale_idx\` ON \`_pages_v_version_timeline\` (\`_locale\`);`)

  await db.run(sql`DROP TABLE \`timeline_ids\`;`)
}

/** Retour arrière : les étapes de même rang sont fusionnées en une seule, dont la période vient
 * de l'anglais quand il existe. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages_timeline\` RENAME TO \`__loc_pages_timeline\`;`)
  await db.run(sql`DROP INDEX \`pages_timeline_order_idx\`;`)
  await db.run(sql`DROP INDEX \`pages_timeline_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`pages_timeline_locale_idx\`;`)
  await db.run(sql`CREATE TABLE \`pages_timeline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`period\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`pages_timeline\` (\`_order\`, \`_parent_id\`, \`id\`, \`period\`)
  	SELECT \`_order\`, \`_parent_id\`, \`id\`, \`period\` FROM \`__loc_pages_timeline\` t
  	WHERE t.\`id\` = (
  		SELECT x.\`id\` FROM \`__loc_pages_timeline\` x
  		WHERE x.\`_parent_id\` = t.\`_parent_id\` AND x.\`_order\` = t.\`_order\`
  		ORDER BY x.\`_locale\` = 'en' DESC, x.\`_locale\` LIMIT 1
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
  await db.run(sql`INSERT INTO \`pages_timeline_locales\` (\`title\`, \`text\`, \`_locale\`, \`_parent_id\`)
  	SELECT t.\`title\`, t.\`text\`, t.\`_locale\`, e.\`id\`
  	FROM \`__loc_pages_timeline\` t
  	JOIN \`pages_timeline\` e ON e.\`_parent_id\` = t.\`_parent_id\` AND e.\`_order\` = t.\`_order\`;
  `)
  await db.run(sql`DROP TABLE \`__loc_pages_timeline\`;`)

  await db.run(sql`ALTER TABLE \`_pages_v_version_timeline\` RENAME TO \`__loc__pages_v_version_timeline\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_version_timeline_order_idx\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_version_timeline_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_version_timeline_locale_idx\`;`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_timeline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`period\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`_pages_v_version_timeline\` (\`_order\`, \`_parent_id\`, \`id\`, \`period\`, \`_uuid\`)
  	SELECT \`_order\`, \`_parent_id\`, \`id\`, \`period\`, \`_uuid\` FROM \`__loc__pages_v_version_timeline\` t
  	WHERE t.\`id\` = (
  		SELECT x.\`id\` FROM \`__loc__pages_v_version_timeline\` x
  		WHERE x.\`_parent_id\` = t.\`_parent_id\` AND x.\`_order\` = t.\`_order\`
  		ORDER BY x.\`_locale\` = 'en' DESC, x.\`_locale\` LIMIT 1
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
  await db.run(sql`INSERT INTO \`_pages_v_version_timeline_locales\` (\`title\`, \`text\`, \`_locale\`, \`_parent_id\`)
  	SELECT t.\`title\`, t.\`text\`, t.\`_locale\`, e.\`id\`
  	FROM \`__loc__pages_v_version_timeline\` t
  	JOIN \`_pages_v_version_timeline\` e ON e.\`_parent_id\` = t.\`_parent_id\` AND e.\`_order\` = t.\`_order\`;
  `)
  await db.run(sql`DROP TABLE \`__loc__pages_v_version_timeline\`;`)
}
