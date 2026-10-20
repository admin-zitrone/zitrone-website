#!/bin/zsh
# Run from the repository root. Synthetic values only; no connections or SQL.
TEST_PG_URL='postgres://fake:fake@example.invalid/postgres' zsh -c '
  set -euo pipefail
  source scripts/lib/test-db.sh
  print VALIDATION_DID_NOT_STOP
'
node <<'JS'
const ConnectionParameters = require('pg/lib/connection-parameters');
const url = 'postgres://fake:fake@127.0.0.1:5432/postgres?host=example.invalid';
console.log({validatedHost:new URL(url).hostname, pgActualHost:new ConnectionParameters({connectionString:url}).host});
JS
