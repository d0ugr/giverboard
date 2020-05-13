-- Seeds for all tables

-- password: $2b$10$zUr5GSoayQGyHxrhRU512ekcmmdQe0dcI7v3BJlbukUz7U6IOVQim
-- 123:      $2b$10$WMtxQHMdAIcArSAe8B.dPu3FJ56M2.MenoSGja8Xx/6PGkDcFgrzG

INSERT INTO sessions (username, password, email, name) VALUES
  ('123', '$2b$10$WMtxQHMdAIcArSAe8B.dPu3FJ56M2.MenoSGja8Xx/6PGkDcFgrzG', 't@e.st', 'Jazz Session'),
  ('123', '$2b$10$WMtxQHMdAIcArSAe8B.dPu3FJ56M2.MenoSGja8Xx/6PGkDcFgrzG', 't@e.st', 'Mad Sesh'),
  ('421', '$2b$10$WMtxQHMdAIcArSAe8B.dPu3FJ56M2.MenoSGja8Xx/6PGkDcFgrzG', '4@2.0', 'Max and Relax'),
  ('421', '$2b$10$WMtxQHMdAIcArSAe8B.dPu3FJ56M2.MenoSGja8Xx/6PGkDcFgrzG', '4@2.0', 'Chillin Yo'),
  ('421', '$2b$10$WMtxQHMdAIcArSAe8B.dPu3FJ56M2.MenoSGja8Xx/6PGkDcFgrzG', '4@2.0', 'Let''s go to Sleep')
;

INSERT INTO cards (session_id, content) VALUES
  (1, '{ "title": "Kitties!", "content": "MEOW!" }'),
  (1, '{ "title": "Chickens!", "content": "CLUCK!" }'),
  (1, '{ "title": "Kitties and Chickens", "content": "MEUCK!!!" }'),
  (2, '{ "title": "123", "content": "How to count to 3" }'),
  (2, '{ "title": "123456", "content": "How to count to 6" }'),
  (2, '{ "title": "123456789", "content": "How to count to 9" }'),
  (2, '{ "title": "fewafewafewafewafewafewafewafewafewa", "content": "Dr. Fewa Jiop" }'),
  (2, '{ "title": "jiop 2 da max", "content": "w3rd" }')
;

INSERT INTO participants (session_id, sequence, name) VALUES
  (1, 1, 'Linh Nguyen'),
  (1, 2, 'Doug Ross'),
  (1, 3, 'X Æ A-12'),
  (1, 1, 'Herbert'),
  (1, 2, 'Bob Knickeryanker'),
  (1, 3, 'Let''s Play Checkers'),
  (1, 4, 'Magical Bongo'),
  (1, 5, 'Password'),
  (1, 6, 'Chowder Crowder')
;
