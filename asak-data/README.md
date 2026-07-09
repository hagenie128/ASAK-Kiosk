# ASAK Data

This folder contains canonical sample data generated from
`data-pipeline/phase1/output`.

## Build Sample DB

Create a local SQLite database from the current seed JSON:

```powershell
python asak-data/scripts/load_seed_sqlite.py
```

Regenerate `asak-data/seed/*.json` from `data-pipeline/phase1/output` first, then
load the DB:

```powershell
python asak-data/scripts/load_seed_sqlite.py --rebuild-seed
```

Default output:

```text
asak-data/asak_sample.db
```

The loaded tables follow `docs/wiki/db-table-definition.md`. Current sample data
covers the menu/catalog tables plus `payment_method_config`; order/payment tables
are created empty for API prototyping.
