-- Read-only catalog of the source database for the isolated QA copy
-- (scripts/qa-release/prod-read.mjs catalog). Structure only: table and
-- column names, sizes, foreign keys, applied migrations and exact row counts
-- of the tables whose data would be copied. No row content leaves the server.
-- Runs inside READ ONLY on a session already opened with
-- default_transaction_read_only=on; both settings are reported back.
\set ON_ERROR_STOP on
BEGIN READ ONLY;
SELECT json_build_object(
  'capturedAt', now(),
  'serverVersionNum', current_setting('server_version_num')::int,
  'transactionReadOnly', current_setting('transaction_read_only'),
  'defaultTransactionReadOnly', current_setting('default_transaction_read_only'),
  'migrations', (SELECT json_agg(json_build_object('name', name, 'batch', batch) ORDER BY id) FROM public.payload_migrations),
  'tables', (
    SELECT json_object_agg(c.relname, json_build_object(
      'bytes', pg_total_relation_size(c.oid),
      'columns', (
        SELECT json_agg(a.attname ORDER BY a.attnum)
        FROM pg_attribute a
        WHERE a.attrelid = c.oid AND a.attnum > 0 AND NOT a.attisdropped
      ),
      'rows', CASE
        WHEN c.relname = ANY (string_to_array(:'schema_only', ',')) THEN NULL
        ELSE (xpath('/row/n/text()', query_to_xml(format('SELECT count(*) AS n FROM public.%I', c.relname), false, true, '')))[1]::text::bigint
      END
    ))
    FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')
  ),
  'foreignKeys', (
    SELECT json_agg(json_build_object(
      'from', cl.relname,
      'to', cf.relname,
      'columns', (SELECT json_agg(a.attname) FROM unnest(co.conkey) k JOIN pg_attribute a ON a.attrelid = co.conrelid AND a.attnum = k)
    ))
    FROM pg_constraint co
    JOIN pg_class cl ON cl.oid = co.conrelid
    JOIN pg_class cf ON cf.oid = co.confrelid
    JOIN pg_namespace n ON n.oid = cl.relnamespace
    WHERE co.contype = 'f' AND n.nspname = 'public'
  ),
  'otherRelations', (
    SELECT json_agg(c.relname::text || ':' || c.relkind::text)
    FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind IN ('v', 'm', 'f')
  ),
  'otherSchemas', (
    SELECT json_agg(nspname) FROM pg_namespace
    WHERE nspname NOT IN ('public', 'information_schema') AND nspname NOT LIKE 'pg\_%'
  )
);
ROLLBACK;
