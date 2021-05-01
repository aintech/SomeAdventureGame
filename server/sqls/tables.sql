CREATE TABLE public."user"
(
    id bigint NOT NULL DEFAULT nextval('user_id_seq'::regclass),
    login character varying COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT user_pkey PRIMARY KEY (id)
)

CREATE TABLE public.stats
(
    user_id bigint NOT NULL DEFAULT nextval('stats_user_id_seq'::regclass),
    gold bigint NOT NULL,
    fame bigint NOT NULL,
    CONSTRAINT stats_pkey PRIMARY KEY (user_id)
)

CREATE TABLE public.hero
(
    id bigint NOT NULL DEFAULT nextval('hero_id_seq'::regclass),
    user_id bigint NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    type character varying COLLATE pg_catalog."default" NOT NULL,
    level bigint NOT NULL,
    health bigint NOT NULL,
    power bigint NOT NULL,
    experience bigint NOT NULL,
    gold bigint NOT NULL,
    embarked_quest bigint,
    CONSTRAINT hero_pkey PRIMARY KEY (id)
)

CREATE TABLE public.quest
(
    id bigint NOT NULL DEFAULT nextval('quest_id_seq'::regclass),
    level bigint NOT NULL,
    title character varying COLLATE pg_catalog."default" NOT NULL,
    description character varying COLLATE pg_catalog."default" NOT NULL,
    duration bigint NOT NULL,
    fame bigint NOT NULL,
    tribute bigint NOT NULL,
    experience bigint NOT NULL,
    CONSTRAINT quest_pkey PRIMARY KEY (id)
)

CREATE TABLE public.user_to_quest
(
    user_id bigint NOT NULL,
    quest_id bigint NOT NULL,
    embarked_time timestamp without time zone NOT NULL,
    completed boolean NOT NULL,
    CONSTRAINT user_to_quest_pkey PRIMARY KEY (user_id, quest_id)
)

CREATE TABLE public.equipment
(
    id bigint NOT NULL DEFAULT nextval('equipment_id_seq'::regclass),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    description character varying COLLATE pg_catalog."default" NOT NULL,
    type character varying COLLATE pg_catalog."default" NOT NULL,
    level bigint NOT NULL,
    power bigint NOT NULL,
    price bigint NOT NULL,
    warrior boolean NOT NULL DEFAULT false,
    mage boolean NOT NULL DEFAULT false,
    CONSTRAINT equipment_pkey PRIMARY KEY (id)
)

CREATE TABLE public.hero_level
(
    level bigint NOT NULL,
    experience bigint NOT NULL,
    CONSTRAINT hero_level_pkey PRIMARY KEY (level)
)

CREATE TABLE public.hero_equipment
(
    id bigint NOT NULL DEFAULT nextval('hero_equipment_id_seq'::regclass),
    hero_id bigint NOT NULL,
    equipment_id bigint NOT NULL,
    CONSTRAINT hero_equipment_pkey PRIMARY KEY (id)
)