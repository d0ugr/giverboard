-- Seeds for all tables

-- password: $2b$10$zUr5GSoayQGyHxrhRU512ekcmmdQe0dcI7v3BJlbukUz7U6IOVQim
-- 123:      $2b$10$WMtxQHMdAIcArSAe8B.dPu3FJ56M2.MenoSGja8Xx/6PGkDcFgrzG

INSERT INTO sessions (session_key, username, host_password, email, name) VALUES
  ('default',    'default', '$2b$10$WMtxQHMdAIcArSAe8B.dPu3FJ56M2.MenoSGja8Xx/6PGkDcFgrzG', 'de@fau.lt', 'Default Session'),
  ('kitties',    '123',     '$2b$10$WMtxQHMdAIcArSAe8B.dPu3FJ56M2.MenoSGja8Xx/6PGkDcFgrzG', 't@e.st',    'Kitties'),
  ('mad_sesh',   '123',     '$2b$10$WMtxQHMdAIcArSAe8B.dPu3FJ56M2.MenoSGja8Xx/6PGkDcFgrzG', 't@e.st',    'Chickens'),
  ('max+relax',  '421',     '$2b$10$WMtxQHMdAIcArSAe8B.dPu3FJ56M2.MenoSGja8Xx/6PGkDcFgrzG', '4@2.0',     'Kitties and Chickens'),
  ('sleeeeeeps', '421',     '$2b$10$WMtxQHMdAIcArSAe8B.dPu3FJ56M2.MenoSGja8Xx/6PGkDcFgrzG', '4@2.0',     'Sleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeep')
;

INSERT INTO cards (session_id, content, position) VALUES
  (1, '{ "title": "Kitties!", "content": "MEOW!" }', '{ "x":-100, "y":-60 }'),
  (1, '{ "title": "Chickens!", "content": "CLUCK!" }', '{ "x":-50, "y":-10 }'),
  (1, '{ "title": "Kitties and Chickens!!!", "content": "MEUCK!!!" }', '{ "x":0, "y":40 }'),
  (2, '{ "title": "123", "content": "How to count to 3" }', '{ "x":0, "y":0 }'),
  (2, '{ "title": "123456", "content": "How to count to 6" }', '{ "x":0, "y":0 }'),
  (2, '{ "title": "123456789", "content": "How to count to 9" }', '{ "x":0, "y":0 }'),
  (2, '{ "title": "fewafewafewafewafewafewafewafewafewa", "content": "Dr. Fewa Jiop" }', '{ "x":0, "y":0 }'),
  (2, '{ "title": "jiop is the best", "content": "word" }', '{ "x":0, "y":0 }')
;

INSERT INTO participants (session_id, client_key, sequence, name) VALUES
  (1, '1', 1, 'Linh Nguyen'),
  (1, '2', 2, 'Doug Ross'),
  (1, '3', 3, 'X Æ A-12'),
  (2, '4', 1, 'Herbert'),
  (2, '5', 2, 'Bob Knickeryanker'),
  (2, '6', 3, 'Let''s Play Checkers'),
  (2, '7', 4, 'Magical Bongo'),
  (2, '8', 5, 'Password'),
  (2, '9', 6, 'Chowder Crowder')
;
