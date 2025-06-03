Currently there is no centerilized database so the PostgresSQL is given below:

"
BEGIN;


CREATE TABLE IF NOT EXISTS public.applications
(
    application_id serial NOT NULL,
    job_id integer,
    user_id uuid,
    resume_url text COLLATE pg_catalog."default",
    applied_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cover_letter text COLLATE pg_catalog."default",
    CONSTRAINT applications_pkey PRIMARY KEY (application_id)
);

CREATE TABLE IF NOT EXISTS public.comments
(
    comment_id serial NOT NULL,
    post_id integer,
    user_id uuid,
    content text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT comments_pkey PRIMARY KEY (comment_id)
);

CREATE TABLE IF NOT EXISTS public.connections
(
    connection_id serial NOT NULL,
    sender_id uuid,
    receiver_id uuid,
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT connections_pkey PRIMARY KEY (connection_id)
);

CREATE TABLE IF NOT EXISTS public.education
(
    education_id serial NOT NULL,
    profile_id integer,
    institution_name character varying(255) COLLATE pg_catalog."default",
    degree character varying(100) COLLATE pg_catalog."default",
    field_of_study character varying(100) COLLATE pg_catalog."default",
    start_date date,
    end_date date,
    CONSTRAINT education_pkey PRIMARY KEY (education_id)
);

CREATE TABLE IF NOT EXISTS public.experience
(
    experience_id serial NOT NULL,
    profile_id integer,
    company_name character varying(255) COLLATE pg_catalog."default",
    job_title character varying(100) COLLATE pg_catalog."default",
    start_date date,
    end_date date,
    description text COLLATE pg_catalog."default",
    CONSTRAINT experience_pkey PRIMARY KEY (experience_id)
);

CREATE TABLE IF NOT EXISTS public.jobs
(
    job_id serial NOT NULL,
    company_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    location character varying(100) COLLATE pg_catalog."default",
    posted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id uuid NOT NULL,
    CONSTRAINT jobs_pkey PRIMARY KEY (job_id)
);

CREATE TABLE IF NOT EXISTS public.likes
(
    like_id serial NOT NULL,
    post_id integer,
    user_id uuid,
    CONSTRAINT likes_pkey PRIMARY KEY (like_id)
);

CREATE TABLE IF NOT EXISTS public.posts
(
    post_id serial NOT NULL,
    user_id uuid,
    content text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT posts_pkey PRIMARY KEY (post_id)
);

CREATE TABLE IF NOT EXISTS public.profiles
(
    profile_id serial NOT NULL,
    user_id uuid,
    location character varying(100) COLLATE pg_catalog."default",
    summary text COLLATE pg_catalog."default",
    CONSTRAINT profiles_pkey PRIMARY KEY (profile_id)
);

CREATE TABLE IF NOT EXISTS public.skills
(
    skill_id serial NOT NULL,
    profile_id integer,
    skill_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT skills_pkey PRIMARY KEY (skill_id),
    CONSTRAINT skills_profile_id_skill_name_key UNIQUE (profile_id, skill_name)
);

CREATE TABLE IF NOT EXISTS public.users
(
    user_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    username character varying(50) COLLATE pg_catalog."default" NOT NULL,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    password_hash character varying(255) COLLATE pg_catalog."default" NOT NULL,
    role character varying(20) COLLATE pg_catalog."default" NOT NULL,
    name character varying(255) COLLATE pg_catalog."default",
    surname character varying(255) COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pkey PRIMARY KEY (user_id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_username_key UNIQUE (username)
);

ALTER TABLE IF EXISTS public.applications
    ADD CONSTRAINT applications_job_id_fkey FOREIGN KEY (job_id)
    REFERENCES public.jobs (job_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.applications
    ADD CONSTRAINT applications_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.comments
    ADD CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id)
    REFERENCES public.posts (post_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.connections
    ADD CONSTRAINT connections_receiver_id_fkey FOREIGN KEY (receiver_id)
    REFERENCES public.users (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.connections
    ADD CONSTRAINT connections_sender_id_fkey FOREIGN KEY (sender_id)
    REFERENCES public.users (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.education
    ADD CONSTRAINT education_profile_id_fkey FOREIGN KEY (profile_id)
    REFERENCES public.profiles (profile_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.experience
    ADD CONSTRAINT experience_profile_id_fkey FOREIGN KEY (profile_id)
    REFERENCES public.profiles (profile_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.jobs
    ADD CONSTRAINT fk_connections_user FOREIGN KEY (user_id)
    REFERENCES public.users (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.likes
    ADD CONSTRAINT likes_post_id_fkey FOREIGN KEY (post_id)
    REFERENCES public.posts (post_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.likes
    ADD CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.skills
    ADD CONSTRAINT skills_profile_id_fkey FOREIGN KEY (profile_id)
    REFERENCES public.profiles (profile_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

END;
"
