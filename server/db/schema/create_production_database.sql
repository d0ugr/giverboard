-- Enter a password for the production database role and uncomment the following line.
-- It is recommended to use different user and database names, but this is not necessary.

--CREATE USER giverboard_production WITH NOSUPERUSER PASSWORD '<SECURE_PASSSWORD_HERE>';
CREATE DATABASE giverboard_production OWNER giverboard_production;
GRANT ALL ON DATABASE giverboard_production TO giverboard_production;
