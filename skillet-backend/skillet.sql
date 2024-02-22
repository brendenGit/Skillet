\echo 'Delete and recreate skillet db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE skillet;
CREATE DATABASE skillet;
\connect skillet

\i skillet-schema.sql
\i skillet-seed.sql

\echo 'Delete and recreate skillet_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE skillet_test;
CREATE DATABASE skillet_test;
\connect skillet_test

\i skillet-schema.sql
