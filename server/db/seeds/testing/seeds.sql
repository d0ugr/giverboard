-- Seeds for all testing database tables

-- password: $2b$10$zUr5GSoayQGyHxrhRU512ekcmmdQe0dcI7v3BJlbukUz7U6IOVQim
-- 123:      $2b$10$WMtxQHMdAIcArSAe8B.dPu3FJ56M2.MenoSGja8Xx/6PGkDcFgrzG

INSERT INTO sessions (session_key, username, host_password, email, name) VALUES
  ('default',    'default', '$2b$10$WMtxQHMdAIcArSAe8B.dPu3FJ56M2.MenoSGja8Xx/6PGkDcFgrzG', 'de@fau.lt', 'Default Session'),
  ('kitties',    '123',     '$2b$10$WMtxQHMdAIcArSAe8B.dPu3FJ56M2.MenoSGja8Xx/6PGkDcFgrzG', 't@e.st',    'Kitties'),
  ('mad_sesh',   '123',     '$2b$10$WMtxQHMdAIcArSAe8B.dPu3FJ56M2.MenoSGja8Xx/6PGkDcFgrzG', 't@e.st',    'Chickens'),
  ('max+relax',  '421',     '$2b$10$WMtxQHMdAIcArSAe8B.dPu3FJ56M2.MenoSGja8Xx/6PGkDcFgrzG', '4@2.0',     'Kitties and Chickens'),
  ('sleeeeeeps', '421',     '$2b$10$WMtxQHMdAIcArSAe8B.dPu3FJ56M2.MenoSGja8Xx/6PGkDcFgrzG', '4@2.0',     'Sleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeep')
;

INSERT INTO cards (card_key, session_id, content, position) VALUES
  ('card_key_1', 1, '{ "title": "Kitties!", "body": "MEOW!" }', '{ "x":-100, "y":-60 }'),
  ('card_key_2', 1, '{ "title": "Chickens!", "body": "CLUCK!" }', '{ "x":-50, "y":-10 }'),
  ('card_key_3', 1, '{ "title": "Kitties and Chickens!!!", "body": "MEUCK!!!" }', '{ "x":0, "y":40 }'),
  ('card_key_4', 2, '{ "title": "123", "body": "How to count to 3" }', '{ "x":50, "y":-100 }'),
  ('card_key_5', 2, '{ "title": "123456", "body": "How to count to 6" }', '{ "x":65, "y":-25 }'),
  ('card_key_6', 2, '{ "title": "123456789", "body": "How to count to 9" }', '{ "x":80, "y":70 }'),
  ('card_key_7', 2, '{ "title": "fewafewafewafewafewafewafewafewafewa", "body": "Dr. Fewa Jiop" }', '{ "x":-150, "y":-80 }'),
  ('card_key_8', 2, '{ "title": "jiop is the best", "body": "word" }', '{ "x":-130, "y":60 }')
;

INSERT INTO participants (session_id, client_key, sequence, name) VALUES
  (1, 'client_key_1', 1, 'Linh Nguyen'),
  (1, 'client_key_2', 2, 'Doug Ross'),
  (1, 'client_key_3', 3, 'X Æ A-12'),
  (2, 'client_key_4', 1, 'Herbert'),
  (2, 'client_key_5', 2, 'Bob Knickeryanker'),
  (2, 'client_key_6', 3, 'Let''s Play Checkers'),
  (2, 'client_key_7', 4, 'Magical Bongo'),
  (2, 'client_key_8', 5, 'Password'),
  (2, 'client_key_9', 6, 'Chowder Crowder')
;
