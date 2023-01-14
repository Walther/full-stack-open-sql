CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes integer DEFAULT 0
);
INSERT INTO blogs (author, url, title)
values (
    'Example Author',
    'https://example.com/',
    'Example Domain'
  );
INSERT INTO blogs (author, url, title)
values (
    'Matti Luukkainen',
    'https://fullstackopen.com/',
    'Full Stack Open'
  );
