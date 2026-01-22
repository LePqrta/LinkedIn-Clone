-- 1. Fix Post ID (Primary Key)
ALTER TABLE posts ALTER COLUMN post_id TYPE BIGINT;

-- 2. Fix Like ID (Primary Key) AND its reference to Post
ALTER TABLE likes ALTER COLUMN like_id TYPE BIGINT;
ALTER TABLE likes ALTER COLUMN post_id TYPE BIGINT;

-- 3. Fix Comment ID (Primary Key) AND its reference to Post
ALTER TABLE comments ALTER COLUMN comment_id TYPE BIGINT;
ALTER TABLE comments ALTER COLUMN post_id TYPE BIGINT;

-- 4. Fix Skills ID (Primary Key)
ALTER TABLE skills ALTER COLUMN skill_id TYPE BIGINT;