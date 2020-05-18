-- Enter a password for the production database role and uncomment the following line.
-- It is recommended to use different user and database names, but this is not necessary.

--CREATE USER estimatron2020_production WITH NOSUPERUSER PASSWORD '<SECURE_PASSSWORD_HERE>';
CREATE DATABASE estimatron2020_production OWNER estimatron2020_production;
GRANT ALL ON DATABASE estimatron2020_production TO estimatron2020_production;
