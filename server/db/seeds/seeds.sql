-- Seeds for all tables

-- password: $2b$10$zUr5GSoayQGyHxrhRU512ekcmmdQe0dcI7v3BJlbukUz7U6IOVQim
-- 123:      $2b$10$WMtxQHMdAIcArSAe8B.dPu3FJ56M2.MenoSGja8Xx/6PGkDcFgrzG

INSERT INTO sessions (session_key, username, host_password, email, name) VALUES
  ('default',    'default', '$2b$10$WMtxQHMdAIcArSAe8B.dPu3FJ56M2.MenoSGja8Xx/6PGkDcFgrzG', 'de@fau.lt', 'Default Session')
;
