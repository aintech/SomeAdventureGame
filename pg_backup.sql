--
-- PostgreSQL database dump
--

-- Dumped from database version 10.19 (Ubuntu 10.19-1.pgdg18.04+1)
-- Dumped by pg_dump version 14.1 (Ubuntu 14.1-1.pgdg18.04+1)

-- Started on 2022-01-27 18:51:21 MSK

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE adventure;
--
-- TOC entry 3144 (class 1262 OID 16702)
-- Name: adventure; Type: DATABASE; Schema: -; Owner: yaremchuken
--

CREATE DATABASE adventure WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.UTF-8';


ALTER DATABASE adventure OWNER TO yaremchuken;

\connect adventure

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

--
-- TOC entry 227 (class 1259 OID 17230)
-- Name: building; Type: TABLE; Schema: public; Owner: yaremchuken
--

CREATE TABLE public.building (
    user_id bigint NOT NULL,
    type bigint NOT NULL,
    level bigint NOT NULL,
    upgrade_started bigint
);


ALTER TABLE public.building OWNER TO yaremchuken;

--
-- TOC entry 228 (class 1259 OID 17236)
-- Name: building_upgrade; Type: TABLE; Schema: public; Owner: yaremchuken
--

CREATE TABLE public.building_upgrade (
    type bigint NOT NULL,
    level bigint NOT NULL,
    cost bigint NOT NULL,
    duration bigint NOT NULL
);


ALTER TABLE public.building_upgrade OWNER TO yaremchuken;

--
-- TOC entry 226 (class 1259 OID 17228)
-- Name: building_user_id_seq; Type: SEQUENCE; Schema: public; Owner: yaremchuken
--

CREATE SEQUENCE public.building_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.building_user_id_seq OWNER TO yaremchuken;

--
-- TOC entry 3145 (class 0 OID 0)
-- Dependencies: 226
-- Name: building_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yaremchuken
--

ALTER SEQUENCE public.building_user_id_seq OWNED BY public.building.user_id;


--
-- TOC entry 204 (class 1259 OID 16828)
-- Name: equipment_id_seq; Type: SEQUENCE; Schema: public; Owner: yaremchuken
--

CREATE SEQUENCE public.equipment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.equipment_id_seq OWNER TO yaremchuken;

--
-- TOC entry 206 (class 1259 OID 16869)
-- Name: equipment; Type: TABLE; Schema: public; Owner: yaremchuken
--

CREATE TABLE public.equipment (
    id bigint DEFAULT nextval('public.equipment_id_seq'::regclass) NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    level bigint NOT NULL,
    price bigint NOT NULL,
    warrior boolean DEFAULT false NOT NULL,
    mage boolean DEFAULT false NOT NULL,
    thief boolean DEFAULT false NOT NULL,
    healer boolean DEFAULT false NOT NULL,
    type bigint DEFAULT 0 NOT NULL,
    buying_time bigint DEFAULT 120 NOT NULL
);


ALTER TABLE public.equipment OWNER TO yaremchuken;

--
-- TOC entry 222 (class 1259 OID 17169)
-- Name: equipment_tier; Type: TABLE; Schema: public; Owner: yaremchuken
--

CREATE TABLE public.equipment_tier (
    equipment_id bigint NOT NULL,
    tier bigint NOT NULL,
    power bigint DEFAULT 0 NOT NULL,
    defence bigint DEFAULT 0 NOT NULL,
    vitality bigint DEFAULT 0 NOT NULL,
    initiative bigint DEFAULT 0 NOT NULL,
    upgrading_time bigint DEFAULT 120 NOT NULL,
    wizdom bigint DEFAULT 0 NOT NULL
);


ALTER TABLE public.equipment_tier OWNER TO yaremchuken;

--
-- TOC entry 198 (class 1259 OID 16763)
-- Name: hero_id_seq; Type: SEQUENCE; Schema: public; Owner: yaremchuken
--

CREATE SEQUENCE public.hero_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hero_id_seq OWNER TO yaremchuken;

--
-- TOC entry 207 (class 1259 OID 16880)
-- Name: hero; Type: TABLE; Schema: public; Owner: yaremchuken
--

CREATE TABLE public.hero (
    id bigint DEFAULT nextval('public.hero_id_seq'::regclass) NOT NULL,
    user_id bigint NOT NULL,
    name character varying NOT NULL,
    power bigint NOT NULL,
    defence bigint NOT NULL,
    health bigint NOT NULL,
    experience bigint NOT NULL,
    gold bigint NOT NULL,
    vitality bigint NOT NULL,
    initiative bigint NOT NULL,
    hired boolean DEFAULT false NOT NULL,
    appear_at timestamp without time zone NOT NULL,
    level bigint DEFAULT 1 NOT NULL,
    type bigint DEFAULT 0 NOT NULL,
    wizdom bigint DEFAULT 0 NOT NULL,
    mana bigint
);


ALTER TABLE public.hero OWNER TO yaremchuken;

--
-- TOC entry 214 (class 1259 OID 16993)
-- Name: hero_activity; Type: TABLE; Schema: public; Owner: yaremchuken
--

CREATE TABLE public.hero_activity (
    hero_id bigint NOT NULL,
    activity_id bigint,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    duration bigint,
    activity_type bigint DEFAULT 0 NOT NULL,
    description character varying DEFAULT 'Ни пре делах'::character varying NOT NULL
);


ALTER TABLE public.hero_activity OWNER TO yaremchuken;

--
-- TOC entry 205 (class 1259 OID 16854)
-- Name: hero_equipment; Type: TABLE; Schema: public; Owner: yaremchuken
--

CREATE TABLE public.hero_equipment (
    hero_id bigint NOT NULL,
    equipment_id bigint NOT NULL,
    tier bigint DEFAULT 0 NOT NULL
);


ALTER TABLE public.hero_equipment OWNER TO yaremchuken;

--
-- TOC entry 215 (class 1259 OID 17005)
-- Name: hero_item; Type: TABLE; Schema: public; Owner: yaremchuken
--

CREATE TABLE public.hero_item (
    hero_id bigint NOT NULL,
    item_id bigint NOT NULL,
    amount bigint NOT NULL
);


ALTER TABLE public.hero_item OWNER TO yaremchuken;

--
-- TOC entry 218 (class 1259 OID 17025)
-- Name: hero_perk; Type: TABLE; Schema: public; Owner: yaremchuken
--

CREATE TABLE public.hero_perk (
    hero_id bigint NOT NULL,
    perk_id bigint NOT NULL
);


ALTER TABLE public.hero_perk OWNER TO yaremchuken;

--
-- TOC entry 224 (class 1259 OID 17191)
-- Name: item_id_seq; Type: SEQUENCE; Schema: public; Owner: yaremchuken
--

CREATE SEQUENCE public.item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.item_id_seq OWNER TO yaremchuken;

--
-- TOC entry 223 (class 1259 OID 17183)
-- Name: item; Type: TABLE; Schema: public; Owner: yaremchuken
--

CREATE TABLE public.item (
    id bigint DEFAULT nextval('public.item_id_seq'::regclass) NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    price bigint NOT NULL,
    type bigint NOT NULL,
    subtype bigint NOT NULL,
    buying_time bigint DEFAULT 120 NOT NULL
);


ALTER TABLE public.item OWNER TO yaremchuken;

--
-- TOC entry 203 (class 1259 OID 16807)
-- Name: level_exp; Type: TABLE; Schema: public; Owner: yaremchuken
--

CREATE TABLE public.level_exp (
    level bigint NOT NULL,
    experience bigint NOT NULL,
    cost bigint DEFAULT 0 NOT NULL,
    duration bigint DEFAULT 0 NOT NULL,
    definition character varying DEFAULT ''::character varying NOT NULL
);


ALTER TABLE public.level_exp OWNER TO yaremchuken;

--
-- TOC entry 213 (class 1259 OID 16932)
-- Name: monster; Type: TABLE; Schema: public; Owner: yaremchuken
--

CREATE TABLE public.monster (
    id bigint NOT NULL,
    level bigint NOT NULL,
    name character varying NOT NULL,
    power bigint NOT NULL,
    health bigint NOT NULL,
    initiative bigint NOT NULL,
    defence bigint NOT NULL,
    experience bigint DEFAULT 0 NOT NULL,
    loot character varying DEFAULT '{}'::character varying NOT NULL
);


ALTER TABLE public.monster OWNER TO yaremchuken;

--
-- TOC entry 212 (class 1259 OID 16930)
-- Name: monster_id_seq; Type: SEQUENCE; Schema: public; Owner: yaremchuken
--

CREATE SEQUENCE public.monster_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.monster_id_seq OWNER TO yaremchuken;

--
-- TOC entry 3146 (class 0 OID 0)
-- Dependencies: 212
-- Name: monster_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yaremchuken
--

ALTER SEQUENCE public.monster_id_seq OWNED BY public.monster.id;


--
-- TOC entry 217 (class 1259 OID 17016)
-- Name: perk; Type: TABLE; Schema: public; Owner: yaremchuken
--

CREATE TABLE public.perk (
    id bigint NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL
);


ALTER TABLE public.perk OWNER TO yaremchuken;

--
-- TOC entry 216 (class 1259 OID 17014)
-- Name: perk_id_seq; Type: SEQUENCE; Schema: public; Owner: yaremchuken
--

CREATE SEQUENCE public.perk_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.perk_id_seq OWNER TO yaremchuken;

--
-- TOC entry 3147 (class 0 OID 0)
-- Dependencies: 216
-- Name: perk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yaremchuken
--

ALTER SEQUENCE public.perk_id_seq OWNED BY public.perk.id;


--
-- TOC entry 202 (class 1259 OID 16793)
-- Name: quest; Type: TABLE; Schema: public; Owner: yaremchuken
--

CREATE TABLE public.quest (
    id bigint NOT NULL,
    level bigint NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL,
    fame bigint NOT NULL,
    tribute bigint NOT NULL,
    experience bigint NOT NULL,
    travel_time bigint DEFAULT 0 NOT NULL
);


ALTER TABLE public.quest OWNER TO yaremchuken;

--
-- TOC entry 211 (class 1259 OID 16902)
-- Name: quest_checkpoint; Type: TABLE; Schema: public; Owner: yaremchuken
--

CREATE TABLE public.quest_checkpoint (
    id bigint NOT NULL,
    quest_progress_id bigint NOT NULL,
    type character varying NOT NULL,
    stage bigint NOT NULL,
    enemies character varying,
    passed boolean DEFAULT false NOT NULL,
    treasure bigint,
    linked character varying
);


ALTER TABLE public.quest_checkpoint OWNER TO yaremchuken;

--
-- TOC entry 210 (class 1259 OID 16900)
-- Name: quest_checkpoints_id_seq; Type: SEQUENCE; Schema: public; Owner: yaremchuken
--

CREATE SEQUENCE public.quest_checkpoints_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.quest_checkpoints_id_seq OWNER TO yaremchuken;

--
-- TOC entry 3148 (class 0 OID 0)
-- Dependencies: 210
-- Name: quest_checkpoints_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yaremchuken
--

ALTER SEQUENCE public.quest_checkpoints_id_seq OWNED BY public.quest_checkpoint.id;


--
-- TOC entry 201 (class 1259 OID 16791)
-- Name: quest_id_seq; Type: SEQUENCE; Schema: public; Owner: yaremchuken
--

CREATE SEQUENCE public.quest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.quest_id_seq OWNER TO yaremchuken;

--
-- TOC entry 3149 (class 0 OID 0)
-- Dependencies: 201
-- Name: quest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yaremchuken
--

ALTER SEQUENCE public.quest_id_seq OWNED BY public.quest.id;


--
-- TOC entry 209 (class 1259 OID 16891)
-- Name: quest_progress; Type: TABLE; Schema: public; Owner: yaremchuken
--

CREATE TABLE public.quest_progress (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    quest_id bigint NOT NULL,
    embarked_time timestamp with time zone NOT NULL,
    completed boolean DEFAULT false NOT NULL
);


ALTER TABLE public.quest_progress OWNER TO yaremchuken;

--
-- TOC entry 208 (class 1259 OID 16889)
-- Name: quest_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: yaremchuken
--

CREATE SEQUENCE public.quest_progress_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.quest_progress_id_seq OWNER TO yaremchuken;

--
-- TOC entry 3150 (class 0 OID 0)
-- Dependencies: 208
-- Name: quest_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yaremchuken
--

ALTER SEQUENCE public.quest_progress_id_seq OWNED BY public.quest_progress.id;


--
-- TOC entry 220 (class 1259 OID 17032)
-- Name: skill; Type: TABLE; Schema: public; Owner: yaremchuken
--

CREATE TABLE public.skill (
    id bigint NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    type bigint NOT NULL,
    hero_type bigint NOT NULL,
    mana_cost bigint
);


ALTER TABLE public.skill OWNER TO yaremchuken;

--
-- TOC entry 219 (class 1259 OID 17030)
-- Name: skill_id_seq; Type: SEQUENCE; Schema: public; Owner: yaremchuken
--

CREATE SEQUENCE public.skill_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.skill_id_seq OWNER TO yaremchuken;

--
-- TOC entry 3151 (class 0 OID 0)
-- Dependencies: 219
-- Name: skill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yaremchuken
--

ALTER SEQUENCE public.skill_id_seq OWNED BY public.skill.id;


--
-- TOC entry 200 (class 1259 OID 16785)
-- Name: stats; Type: TABLE; Schema: public; Owner: yaremchuken
--

CREATE TABLE public.stats (
    user_id bigint NOT NULL,
    gold bigint NOT NULL,
    fame bigint NOT NULL
);


ALTER TABLE public.stats OWNER TO yaremchuken;

--
-- TOC entry 199 (class 1259 OID 16783)
-- Name: stats_user_id_seq; Type: SEQUENCE; Schema: public; Owner: yaremchuken
--

CREATE SEQUENCE public.stats_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stats_user_id_seq OWNER TO yaremchuken;

--
-- TOC entry 3152 (class 0 OID 0)
-- Dependencies: 199
-- Name: stats_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yaremchuken
--

ALTER SEQUENCE public.stats_user_id_seq OWNED BY public.stats.user_id;


--
-- TOC entry 197 (class 1259 OID 16740)
-- Name: user; Type: TABLE; Schema: public; Owner: yaremchuken
--

CREATE TABLE public."user" (
    id bigint NOT NULL,
    login character varying NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE public."user" OWNER TO yaremchuken;

--
-- TOC entry 225 (class 1259 OID 17196)
-- Name: user_alchemist_assortment; Type: TABLE; Schema: public; Owner: yaremchuken
--

CREATE TABLE public.user_alchemist_assortment (
    user_id bigint NOT NULL,
    item_id bigint NOT NULL
);


ALTER TABLE public.user_alchemist_assortment OWNER TO yaremchuken;

--
-- TOC entry 196 (class 1259 OID 16738)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: yaremchuken
--

CREATE SEQUENCE public.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO yaremchuken;

--
-- TOC entry 3153 (class 0 OID 0)
-- Dependencies: 196
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yaremchuken
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- TOC entry 221 (class 1259 OID 17147)
-- Name: user_market_assortment; Type: TABLE; Schema: public; Owner: yaremchuken
--

CREATE TABLE public.user_market_assortment (
    user_id bigint NOT NULL,
    equipment_id bigint NOT NULL
);


ALTER TABLE public.user_market_assortment OWNER TO yaremchuken;

--
-- TOC entry 2942 (class 2604 OID 17233)
-- Name: building user_id; Type: DEFAULT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.building ALTER COLUMN user_id SET DEFAULT nextval('public.building_user_id_seq'::regclass);


--
-- TOC entry 2926 (class 2604 OID 16961)
-- Name: monster id; Type: DEFAULT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.monster ALTER COLUMN id SET DEFAULT nextval('public.monster_id_seq'::regclass);


--
-- TOC entry 2932 (class 2604 OID 17019)
-- Name: perk id; Type: DEFAULT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.perk ALTER COLUMN id SET DEFAULT nextval('public.perk_id_seq'::regclass);


--
-- TOC entry 2904 (class 2604 OID 16962)
-- Name: quest id; Type: DEFAULT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.quest ALTER COLUMN id SET DEFAULT nextval('public.quest_id_seq'::regclass);


--
-- TOC entry 2924 (class 2604 OID 16963)
-- Name: quest_checkpoint id; Type: DEFAULT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.quest_checkpoint ALTER COLUMN id SET DEFAULT nextval('public.quest_checkpoints_id_seq'::regclass);


--
-- TOC entry 2923 (class 2604 OID 16964)
-- Name: quest_progress id; Type: DEFAULT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.quest_progress ALTER COLUMN id SET DEFAULT nextval('public.quest_progress_id_seq'::regclass);


--
-- TOC entry 2933 (class 2604 OID 17035)
-- Name: skill id; Type: DEFAULT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.skill ALTER COLUMN id SET DEFAULT nextval('public.skill_id_seq'::regclass);


--
-- TOC entry 2903 (class 2604 OID 16965)
-- Name: stats user_id; Type: DEFAULT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.stats ALTER COLUMN user_id SET DEFAULT nextval('public.stats_user_id_seq'::regclass);


--
-- TOC entry 2902 (class 2604 OID 16966)
-- Name: user id; Type: DEFAULT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- TOC entry 3137 (class 0 OID 17230)
-- Dependencies: 227
-- Data for Name: building; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.building (user_id, type, level, upgrade_started) VALUES (1, 0, 1, NULL);
INSERT INTO public.building (user_id, type, level, upgrade_started) VALUES (1, 7, 1, NULL);
INSERT INTO public.building (user_id, type, level, upgrade_started) VALUES (1, 4, 1, NULL);
INSERT INTO public.building (user_id, type, level, upgrade_started) VALUES (1, 3, 1, NULL);
INSERT INTO public.building (user_id, type, level, upgrade_started) VALUES (1, 8, 1, NULL);
INSERT INTO public.building (user_id, type, level, upgrade_started) VALUES (1, 10, 1, NULL);
INSERT INTO public.building (user_id, type, level, upgrade_started) VALUES (1, 1, 1, NULL);
INSERT INTO public.building (user_id, type, level, upgrade_started) VALUES (1, 2, 1, NULL);
INSERT INTO public.building (user_id, type, level, upgrade_started) VALUES (1, 5, 2, NULL);
INSERT INTO public.building (user_id, type, level, upgrade_started) VALUES (1, 6, 2, NULL);
INSERT INTO public.building (user_id, type, level, upgrade_started) VALUES (1, 9, 2, NULL);


--
-- TOC entry 3138 (class 0 OID 17236)
-- Dependencies: 228
-- Data for Name: building_upgrade; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (0, 1, 0, 0);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (1, 1, 0, 0);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (2, 1, 0, 0);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (3, 1, 0, 0);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (4, 1, 0, 0);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (5, 1, 0, 0);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (6, 1, 0, 0);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (7, 1, 0, 0);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (8, 1, 0, 0);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (9, 1, 0, 0);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (10, 1, 0, 0);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (10, 2, 1000, 180);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (10, 3, 3000, 360);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (10, 4, 7000, 600);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (10, 5, 12000, 900);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (0, 2, 1000, 180);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (1, 2, 1000, 180);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (2, 2, 1000, 180);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (3, 2, 1000, 180);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (4, 2, 1000, 180);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (5, 2, 1000, 180);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (6, 2, 1000, 180);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (7, 2, 1000, 180);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (8, 2, 1000, 180);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (9, 2, 1000, 180);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (0, 3, 3000, 360);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (1, 3, 3000, 360);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (2, 3, 3000, 360);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (3, 3, 3000, 360);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (4, 3, 3000, 360);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (5, 3, 3000, 360);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (6, 3, 3000, 360);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (7, 3, 3000, 360);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (8, 3, 3000, 360);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (9, 3, 3000, 360);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (0, 4, 7000, 600);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (1, 4, 7000, 600);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (2, 4, 7000, 600);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (3, 4, 7000, 600);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (4, 4, 7000, 600);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (5, 4, 7000, 600);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (6, 4, 7000, 600);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (7, 4, 7000, 600);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (8, 4, 7000, 600);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (9, 4, 7000, 600);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (0, 5, 12000, 900);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (1, 5, 12000, 900);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (2, 5, 12000, 900);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (3, 5, 12000, 900);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (4, 5, 12000, 900);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (5, 5, 12000, 900);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (6, 5, 12000, 900);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (7, 5, 12000, 900);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (8, 5, 12000, 900);
INSERT INTO public.building_upgrade (type, level, cost, duration) VALUES (9, 5, 12000, 900);


--
-- TOC entry 3116 (class 0 OID 16869)
-- Dependencies: 206
-- Data for Name: equipment; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.equipment (id, name, description, level, price, warrior, mage, thief, healer, type, buying_time) VALUES (1, 'Старый меч', 'Просто старый и немного ржавый меч', 1, 100, true, false, false, false, 0, 120);
INSERT INTO public.equipment (id, name, description, level, price, warrior, mage, thief, healer, type, buying_time) VALUES (2, 'Кривой посох', 'Простая палка, найдена валяющейся не так далеко от источника силы', 1, 100, false, true, false, true, 0, 120);
INSERT INTO public.equipment (id, name, description, level, price, warrior, mage, thief, healer, type, buying_time) VALUES (3, 'Плотная рубаха', 'Мало что представляет в плане защиты', 1, 70, true, true, true, true, 1, 120);
INSERT INTO public.equipment (id, name, description, level, price, warrior, mage, thief, healer, type, buying_time) VALUES (4, 'Бронзовый меч', 'Меч из бронзы', 2, 150, true, false, false, false, 0, 120);
INSERT INTO public.equipment (id, name, description, level, price, warrior, mage, thief, healer, type, buying_time) VALUES (5, 'Старый кинжал', 'Похоже этот кинжал провалялся на задворках лет сто, лезвие остротоой не блещет', 1, 100, false, false, true, false, 0, 120);
INSERT INTO public.equipment (id, name, description, level, price, warrior, mage, thief, healer, type, buying_time) VALUES (6, 'Стальной меч', 'Уже можно считать оружием', 3, 250, true, false, false, false, 0, 120);
INSERT INTO public.equipment (id, name, description, level, price, warrior, mage, thief, healer, type, buying_time) VALUES (7, 'Деревянный посох', 'В посохе есть магия, в зачаточном состоянии', 2, 150, false, true, false, true, 0, 120);
INSERT INTO public.equipment (id, name, description, level, price, warrior, mage, thief, healer, type, buying_time) VALUES (8, 'Простая роба', 'Подходит для начинающих магов, чтобы побродить туда-сюда, сражаться в этом не стоит', 2, 120, false, true, false, true, 1, 120);
INSERT INTO public.equipment (id, name, description, level, price, warrior, mage, thief, healer, type, buying_time) VALUES (9, 'Кожанная куртка', 'Защитит от острых веток и колючек, на что-то посерьезнее рассчитывать не стоит', 2, 120, true, false, true, false, 1, 120);


--
-- TOC entry 3132 (class 0 OID 17169)
-- Dependencies: 222
-- Data for Name: equipment_tier; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (1, 1, 6, 0, 0, 0, 120, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (2, 1, 6, 0, 0, 0, 120, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (3, 1, 0, 4, 0, 0, 120, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (4, 1, 8, 0, 0, 0, 120, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (5, 1, 6, 0, 0, 0, 120, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (6, 1, 11, 0, 0, 0, 120, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (7, 1, 8, 0, 0, 0, 120, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (8, 1, 0, 6, 0, 0, 120, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (9, 1, 0, 6, 0, 0, 120, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (1, 0, 5, 0, 0, 0, 0, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (2, 0, 5, 0, 0, 0, 0, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (3, 0, 0, 3, 0, 0, 0, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (4, 0, 7, 0, 0, 0, 0, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (5, 0, 5, 0, 0, 0, 0, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (6, 0, 10, 0, 0, 0, 0, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (7, 0, 7, 0, 0, 0, 0, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (8, 0, 0, 5, 0, 0, 0, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (9, 0, 0, 5, 0, 0, 0, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (1, 2, 7, 0, 0, 0, 240, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (2, 2, 7, 0, 0, 0, 240, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (3, 2, 0, 5, 0, 0, 240, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (4, 2, 9, 0, 0, 0, 240, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (5, 2, 7, 0, 0, 0, 240, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (6, 2, 12, 0, 0, 0, 240, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (7, 2, 9, 0, 0, 0, 240, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (8, 2, 0, 7, 0, 0, 240, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (9, 2, 0, 7, 0, 0, 240, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (1, 3, 8, 0, 0, 0, 500, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (2, 3, 8, 0, 0, 0, 500, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (3, 3, 0, 6, 0, 0, 500, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (4, 3, 10, 0, 0, 0, 500, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (5, 3, 8, 0, 0, 0, 500, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (6, 3, 13, 0, 0, 0, 500, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (7, 3, 10, 0, 0, 0, 500, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (8, 3, 0, 8, 0, 0, 500, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) VALUES (9, 3, 0, 8, 0, 0, 500, 0);


--
-- TOC entry 3117 (class 0 OID 16880)
-- Dependencies: 207
-- Data for Name: hero; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (1270, 1, 'Каппи', 9, 0, 100, 0, 190, 10, 2, false, '2022-01-27 11:31:04.13151', 1, 3, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (1271, 1, 'Патока', 8, 0, 120, 0, 200, 12, 2, false, '2022-01-27 11:31:05.13151', 1, 0, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (1239, 1, 'Каппи', 6, 0, 120, 0, 0, 12, 2, true, '2022-01-16 15:53:21.185677', 1, 3, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (837, 1, 'Клевер', 8, 0, 100, 92, 68, 10, 2, true, '2021-11-24 17:38:09.338954', 1, 3, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (1272, 1, 'Полана', 10, 0, 140, 0, 240, 14, 2, false, '2022-01-27 11:31:06.13151', 1, 2, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (1273, 1, 'Капля', 9, 0, 130, 0, 220, 13, 2, false, '2022-01-27 11:31:07.13151', 1, 2, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (1274, 1, 'Плея', 5, 0, 100, 0, 150, 10, 2, false, '2022-01-27 11:31:08.13151', 1, 3, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (835, 1, 'Мира', 9, 0, 120, 63, 52, 12, 2, true, '2021-11-24 17:38:08.338954', 1, 1, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (1275, 1, 'Белянка', 9, 0, 110, 0, 200, 11, 2, false, '2022-01-27 11:31:09.13151', 1, 0, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (1276, 1, 'Аркада', 7, 0, 140, 0, 210, 14, 2, false, '2022-01-27 11:31:10.13151', 1, 3, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (1277, 1, 'Март', 5, 0, 130, 0, 180, 13, 2, false, '2022-01-27 11:31:11.13151', 1, 0, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (1278, 1, 'Сола', 7, 0, 110, 0, 180, 11, 2, false, '2022-01-27 11:31:12.13151', 1, 2, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (1279, 1, 'Патока', 10, 0, 100, 0, 200, 10, 2, false, '2022-01-27 11:31:13.13151', 1, 0, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (1280, 1, 'Сола', 6, 0, 130, 0, 190, 13, 2, false, '2022-01-27 11:31:14.13151', 1, 1, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (1281, 1, 'Остера', 6, 0, 120, 0, 180, 12, 2, false, '2022-01-27 11:31:15.13151', 1, 0, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (1282, 1, 'Белянка', 7, 0, 110, 0, 180, 11, 2, false, '2022-01-27 11:31:16.13151', 1, 2, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (604, 1, 'Ровер', 14, 0, 160, 477, 309, 16, 2, true, '2021-08-07 10:23:51.924464', 2, 1, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (746, 1, 'Серпок', 7, 0, 140, 337, 529, 14, 2, true, '2021-10-11 12:21:14.968445', 1, 3, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (890, 1, 'Плея', 9, 0, 100, 0, 6, 10, 2, true, '2021-11-30 14:10:35.119111', 1, 0, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (603, 1, 'Мосток', 12, 0, 124, 519, 163, 14, 2, true, '2021-08-07 10:23:48.924464', 2, 2, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (601, 1, 'Карион', 12, 0, 160, 879, 271, 16, 2, true, '2021-08-07 10:23:47.924464', 2, 0, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (839, 1, 'Сарина', 8, 0, 130, 29, 14, 13, 2, true, '2021-11-24 17:38:07.338954', 1, 0, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (861, 1, 'Белянка', 10, 0, 130, 0, 30, 13, 2, true, '2021-11-28 12:38:36.33364', 1, 2, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (838, 1, 'Луна', 10, 0, 120, 29, 9, 12, 2, true, '2021-11-24 17:38:05.338954', 1, 0, 10, 100);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom, mana) VALUES (842, 1, 'Троя', 8, 0, 100, 29, 4, 10, 2, true, '2021-11-25 18:02:01.280163', 1, 1, 10, 100);


--
-- TOC entry 3124 (class 0 OID 16993)
-- Dependencies: 214
-- Data for Name: hero_activity; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) VALUES (890, NULL, '2022-01-13 11:48:02.355293+03', NULL, 0, 'Не при делах');
INSERT INTO public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) VALUES (861, NULL, '2022-01-13 11:48:02.356788+03', NULL, 0, 'Не при делах');
INSERT INTO public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) VALUES (842, NULL, '2022-01-13 11:48:02.3582+03', NULL, 0, 'Не при делах');
INSERT INTO public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) VALUES (839, NULL, '2022-01-13 15:16:09.701135+03', NULL, 0, 'Не при делах');
INSERT INTO public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) VALUES (838, NULL, '2022-01-13 15:16:09.70284+03', NULL, 0, 'Не при делах');
INSERT INTO public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) VALUES (837, NULL, '2022-01-13 19:12:40.513757+03', NULL, 0, 'Не при делах');
INSERT INTO public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) VALUES (835, NULL, '2022-01-13 19:28:07.396214+03', NULL, 0, 'Не при делах');
INSERT INTO public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) VALUES (601, 3, '2022-01-13 19:50:55.195288+03', NULL, 1, 'Выполняет задание Бить и пить');
INSERT INTO public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) VALUES (603, 3, '2022-01-13 19:50:55.196865+03', NULL, 1, 'Выполняет задание Бить и пить');
INSERT INTO public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) VALUES (604, 3, '2022-01-13 19:50:55.198316+03', NULL, 1, 'Выполняет задание Бить и пить');
INSERT INTO public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) VALUES (746, 3, '2022-01-13 19:50:55.199755+03', NULL, 1, 'Выполняет задание Бить и пить');
INSERT INTO public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) VALUES (1239, NULL, '2022-01-16 16:19:59.69734+03', NULL, 0, 'Не при делах');


--
-- TOC entry 3115 (class 0 OID 16854)
-- Dependencies: 205
-- Data for Name: hero_equipment; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (839, 4, 2);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (838, 9, 1);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (842, 7, 2);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1270, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1271, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1272, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1273, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1274, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1239, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1275, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1276, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1277, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1278, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1279, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1280, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1281, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (746, 8, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1282, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (835, 8, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1270, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (746, 7, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1271, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1272, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1273, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1274, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1275, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1276, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1277, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (837, 7, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (839, 9, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1278, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1279, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1280, 2, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1281, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1239, 7, 1);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (603, 9, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (1282, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (603, 1, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (835, 7, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (838, 4, 1);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (604, 8, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (601, 4, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (604, 7, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (837, 8, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (890, 4, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (601, 9, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (842, 8, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (861, 9, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (890, 9, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (861, 1, 3);


--
-- TOC entry 3125 (class 0 OID 17005)
-- Dependencies: 215
-- Data for Name: hero_item; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (604, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (601, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (601, 3, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (601, 4, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (890, 1, 2);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (604, 3, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (746, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (601, 5, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (601, 6, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (835, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (746, 3, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (837, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (842, 1, 2);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (861, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (835, 3, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (837, 3, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (861, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (603, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (601, 1, 0);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (603, 1, 2);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1270, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1271, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1272, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1273, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1274, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1275, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1276, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1277, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1278, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1279, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1280, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1281, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1282, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1270, 3, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1271, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1272, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1273, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1274, 3, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1275, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1276, 3, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1277, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1278, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1279, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1280, 3, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1281, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1282, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1239, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (1239, 3, 3);


--
-- TOC entry 3128 (class 0 OID 17025)
-- Dependencies: 218
-- Data for Name: hero_perk; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (601, 11);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (601, 9);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (601, 3);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (603, 4);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (603, 10);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (603, 9);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (835, 6);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (835, 2);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (604, 3);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (837, 11);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (838, 10);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (838, 9);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (839, 1);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (839, 5);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (839, 2);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (746, 6);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (842, 9);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (842, 1);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (890, 10);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1270, 4);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1271, 2);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1272, 2);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1273, 8);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1273, 1);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1274, 4);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1275, 8);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1275, 9);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (861, 6);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1275, 6);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1276, 10);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1276, 1);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1277, 1);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1277, 11);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1278, 1);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1278, 4);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1278, 6);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1279, 11);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1280, 8);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1281, 1);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1281, 2);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1281, 5);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1282, 7);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1282, 11);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1282, 3);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1239, 2);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1239, 10);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (1239, 1);


--
-- TOC entry 3133 (class 0 OID 17183)
-- Dependencies: 223
-- Data for Name: item; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.item (id, name, description, price, type, subtype, buying_time) VALUES (1, 'Зелье здоровья', 'Восстанавливает 50% HP', 20, 0, 0, 120);
INSERT INTO public.item (id, name, description, price, type, subtype, buying_time) VALUES (2, 'Элексир жизни', 'Восстанавливает 100% HP', 50, 0, 1, 120);
INSERT INTO public.item (id, name, description, price, type, subtype, buying_time) VALUES (3, 'Зелье маны', 'Восстанавливает 50% PSY', 20, 0, 2, 120);
INSERT INTO public.item (id, name, description, price, type, subtype, buying_time) VALUES (4, 'Элексир маны', 'Восстанавливает 100% PSY', 50, 0, 3, 120);
INSERT INTO public.item (id, name, description, price, type, subtype, buying_time) VALUES (5, 'Жезл огня', 'Кастует Огненный шар', 100, 1, 4, 120);
INSERT INTO public.item (id, name, description, price, type, subtype, buying_time) VALUES (6, 'Жезл оглушения', 'Кастует Оглушение', 100, 1, 5, 120);


--
-- TOC entry 3113 (class 0 OID 16807)
-- Dependencies: 203
-- Data for Name: level_exp; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.level_exp (level, experience, cost, duration, definition) VALUES (1, 0, 0, 0, 'Простак');
INSERT INTO public.level_exp (level, experience, cost, duration, definition) VALUES (2, 300, 50, 120, 'Новичок');
INSERT INTO public.level_exp (level, experience, cost, duration, definition) VALUES (3, 900, 100, 300, 'Ученик');
INSERT INTO public.level_exp (level, experience, cost, duration, definition) VALUES (4, 2700, 200, 500, 'Практик');
INSERT INTO public.level_exp (level, experience, cost, duration, definition) VALUES (5, 6500, 300, 800, 'Понимающий');
INSERT INTO public.level_exp (level, experience, cost, duration, definition) VALUES (6, 14000, 450, 1200, 'Знаток');
INSERT INTO public.level_exp (level, experience, cost, duration, definition) VALUES (7, 23000, 700, 1700, 'Умудренный');
INSERT INTO public.level_exp (level, experience, cost, duration, definition) VALUES (8, 34000, 1000, 2300, 'Мастер');
INSERT INTO public.level_exp (level, experience, cost, duration, definition) VALUES (9, 48000, 1400, 3000, 'Великий Мастер');
INSERT INTO public.level_exp (level, experience, cost, duration, definition) VALUES (10, 64000, 1800, 3800, 'Грандмастер');
INSERT INTO public.level_exp (level, experience, cost, duration, definition) VALUES (11, 85000, 2400, 5000, 'Уникум');
INSERT INTO public.level_exp (level, experience, cost, duration, definition) VALUES (12, 100000, 3000, 6000, 'Уникум');
INSERT INTO public.level_exp (level, experience, cost, duration, definition) VALUES (13, 120000, 3800, 7500, 'Уникум');
INSERT INTO public.level_exp (level, experience, cost, duration, definition) VALUES (14, 140000, 4700, 9500, 'Уникум');
INSERT INTO public.level_exp (level, experience, cost, duration, definition) VALUES (15, 165000, 5500, 12000, 'Уникум');
INSERT INTO public.level_exp (level, experience, cost, duration, definition) VALUES (16, 195000, 6500, 15000, 'Уникум');
INSERT INTO public.level_exp (level, experience, cost, duration, definition) VALUES (17, 225000, 7700, 20000, 'Уникум');
INSERT INTO public.level_exp (level, experience, cost, duration, definition) VALUES (18, 265000, 9000, 26000, 'Уникум');
INSERT INTO public.level_exp (level, experience, cost, duration, definition) VALUES (19, 305000, 11000, 34000, 'Уникум');
INSERT INTO public.level_exp (level, experience, cost, duration, definition) VALUES (20, 355000, 13000, 45000, 'Уникум');


--
-- TOC entry 3123 (class 0 OID 16932)
-- Dependencies: 213
-- Data for Name: monster; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.monster (id, level, name, power, health, initiative, defence, experience, loot) VALUES (2, 1, 'snake', 20, 100, 2, 2, 20, '{"gold": 40}');
INSERT INTO public.monster (id, level, name, power, health, initiative, defence, experience, loot) VALUES (1, 1, 'goblin', 26, 120, 4, 3, 40, '{"gold": 50}');
INSERT INTO public.monster (id, level, name, power, health, initiative, defence, experience, loot) VALUES (6, 1, 'moth', 16, 70, 3, 1, 15, '{"gold": 30}');
INSERT INTO public.monster (id, level, name, power, health, initiative, defence, experience, loot) VALUES (8, 1, 'knight', 12, 90, 3, 5, 20, '{"gold": 50}');
INSERT INTO public.monster (id, level, name, power, health, initiative, defence, experience, loot) VALUES (9, 1, 'mechanic_bot', 24, 110, 5, 4, 25, '{"gold": 60}');


--
-- TOC entry 3127 (class 0 OID 17016)
-- Dependencies: 217
-- Data for Name: perk; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.perk (id, name, description) VALUES (2, 'Дружеское плечо', 'Получает бафф если отправляется на задание не в одиночку');
INSERT INTO public.perk (id, name, description) VALUES (1, 'Одинокий волк', 'Получает бафф если отправляется на задание в одиночку, иначе дебафф за каждого члена группы');
INSERT INTO public.perk (id, name, description) VALUES (3, 'Командный игрок', 'Получает бафф за каждого участника группы, чем больше героев отправляется на задание тем больше бафф');
INSERT INTO public.perk (id, name, description) VALUES (7, 'Давитель гоблинов', 'Повышенный урон против гоблинов');
INSERT INTO public.perk (id, name, description) VALUES (8, 'Истребитель вампиров', 'Повышенный урон против вампиров');
INSERT INTO public.perk (id, name, description) VALUES (9, 'Драконоборец', 'Повышенный урон против драконов');
INSERT INTO public.perk (id, name, description) VALUES (10, 'Гонитель нежити', 'Повышенный урон против нежити');
INSERT INTO public.perk (id, name, description) VALUES (11, 'Боится мертвяков', 'Пониженный урон против нежити');
INSERT INTO public.perk (id, name, description) VALUES (4, 'Не любит дуболомов', 'Получает дебафф если в группе присутствует Воин');
INSERT INTO public.perk (id, name, description) VALUES (5, 'Сторонится магов', 'Получает дебафф если в группе присутствует Маг');
INSERT INTO public.perk (id, name, description) VALUES (6, 'Чурается прохвостов', 'Получает дебафф если в группе присутствует Вор');


--
-- TOC entry 3112 (class 0 OID 16793)
-- Dependencies: 202
-- Data for Name: quest; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (2, 2, 'Гоблинский шабаш', 'Орава гоблинов совсем распоясалась, нормальным людям спать не даёт, гоните их в шею, а с меня :tribute монет.', 20, 350, 200, 5);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (4, 5, 'Хочу рыбачить', 'Прибейте кто-нибудь этих утопцев наконец, воду мутят, рыбу жрут, рыбачить невозможно. Готов отдать :tribute монет тому кто избавится от негодных.', 50, 570, 500, 5);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (5, 10, 'Голем', 'Я - Великий хранитель тайн и запретных знаний Астох создал невероятное создание - настоящего мышиного Голема. Так теперь эта сволочь сидит в подвале и пожирает мои харчи. Удавите его поскорее и вынесите куда-нибудь в лес. Сокровища в :tribute монет ждут смельчаков.', 100, 890, 1000, 5);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (3, 1, 'Бить и пить', 'Дам бочку отличного пива и мешочек со :tribute монетами тому кто прогонит с моей винодельни проклятых гарпий.', 10, 150, 100, 5);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (1, 3, 'Охота на ведьмочек', 'Три миловидные ведьмы проводят в нашем сарае свои глупые ритуалы! А как нам картоху копать без лопат? Мешочек на :tribute монет ждёт героев.', 30, 200, 300, 5);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (6, 5, 'Ради науки', 'Мне нужны помет летучих мышей Кролоса один пуд, хвосты игуан Гарула штук 10 и ещё 12 голов кусь-рыбы с Тароса. Знание алхимии приветствуется (те кто не знает где у кусь-рыбы хвост а где башка даже не приходите). Даю :tribute монет.', 50, 1050, 500, 5);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (7, 7, 'Веселые тролли', 'Приходите на праздник в наш город, у нас будут веселые тролли! Они будут плясать, петь песни, устраивать представления. Научат жить не зная зла и бед! Вход бесплатый!', 50, 0, 600, 5);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (9, 8, 'Ходячий валежник', 'Тут в лесу завелись какие-то живые кусты, когда бабы за валежником ходили - одного такого чуть на дрова не порубили, он их поптом до самой деревни гнал. Шаман говорит что это дендрарианы или как-то так. Вобщем отчистите лес от наваждения, награда :tribute монет.', 90, 950, 1020, 5);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (8, 4, 'Наглые гарпии', 'Кучка гарпий поселилась на наших полях! Чего им там нужно, это же не утесы! Пугал ставили, так они из них гнёзда устроили. Короче гоните пернатых, мы для этих целей :tribute монетами скинулись.', 40, 250, 260, 5);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (10, 1, 'Крысы в подвале', 'В моем подвале завелись крысы! Шуршат всю ночь что не уснуть. Запасы подъедают, и ладно бы зерно, так они буженину предпочитают! Зачистите подвал от этих тварей, оплачиваю по хвостам, до :tribute монет.', 15, 80, 220, 5);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (11, 6, 'Зайцы-оборотни', 'Здесь довечи странный зверь завёлся - днём обычный заяц, а как тьма наступит в зубастое чудище превращается! Наши охотники поймали пару таких в силки, домой принесли, а ночью им хаты разнесло. Помогите с напастью и :tribute монет ваши.', 75, 850, 780, 5);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (12, 12, 'Полуночницы', 'Ищутся герои которые помогут с бедствием постигнувшим нашу деревню. В заброшеном доме поселились полуночницы - днем от них проблем нет, а вот ночью вылезают из дому и ходят стучаться к соседям - кто открыл тот пропал! Так вся деревня скоро вымрет, приходите мы собрали :tribute монет.', 120, 1540, 1450, 5);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (13, 15, 'Жуткий замок', 'У нас рядом есть старый замок, и вот неавно там всякая нечисть завелась. Земля вокруг замка стала непладородной, по ночам призраки гуляют вокруг, говорят зомби видели. А ещё говорят тёмный лорд там завелся, ещё чего решит отправится мир завоёвывать а оно нам надо? Вобщем с города :tribute монет, с героев разогнать нежить!', 200, 2400, 2500, 5);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (14, 1, 'Жаба-мутант', 'В нашей деревне за последние пол-года пять девах сгинуло, шаман говорит дух-жаба себе невест ищет, надо бы её изловить и дух вытрясти, заодно авось девах обратно вернуть получится. За жабу дадим хабар :tribute, девок бестолковых можете себе оставить. В нашей деревне за последние пол-года пять девах сгинуло, шаман говорит дух-жаба себе невест ищет, надо бы её изловить и дух вытрясти, заодно авось девах обратно вернуть получится. За жабу дадим хабар :tribute, девок бестолковых можете себе оставить.', 50, 350, 220, 5);


--
-- TOC entry 3121 (class 0 OID 16902)
-- Dependencies: 211
-- Data for Name: quest_checkpoint; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.quest_checkpoint (id, quest_progress_id, type, stage, enemies, passed, treasure, linked) VALUES (5421, 952, 'battle', 2, '[{"id":8,"level":1,"name":"knight","power":12,"health":90,"initiative":3,"defence":5,"experience":20,"loot":{"gold":50},"actorId":0},{"id":9,"level":1,"name":"mechanic_bot","power":24,"health":110,"initiative":5,"defence":4,"experience":25,"loot":{"gold":60},"actorId":1},{"id":1,"level":1,"name":"goblin","power":26,"health":120,"initiative":4,"defence":3,"experience":40,"loot":{"gold":50},"actorId":2}]', true, 0, '5422');
INSERT INTO public.quest_checkpoint (id, quest_progress_id, type, stage, enemies, passed, treasure, linked) VALUES (5422, 952, 'camp', 3, NULL, true, 0, '5423,5424');
INSERT INTO public.quest_checkpoint (id, quest_progress_id, type, stage, enemies, passed, treasure, linked) VALUES (5423, 952, 'battle', 4, '[{"id":8,"level":1,"name":"knight","power":12,"health":90,"initiative":3,"defence":5,"experience":20,"loot":{"gold":50},"actorId":0},{"id":2,"level":1,"name":"snake","power":20,"health":100,"initiative":2,"defence":2,"experience":20,"loot":{"gold":40},"actorId":1},{"id":9,"level":1,"name":"mechanic_bot","power":24,"health":110,"initiative":5,"defence":4,"experience":25,"loot":{"gold":60},"actorId":2}]', true, 0, '5425');
INSERT INTO public.quest_checkpoint (id, quest_progress_id, type, stage, enemies, passed, treasure, linked) VALUES (5429, 952, 'boss', 7, '[{"id":6,"level":1,"name":"moth","power":16,"health":210,"initiative":3,"defence":1,"experience":15,"loot":{"gold":30},"actorId":0}]', false, 0, NULL);
INSERT INTO public.quest_checkpoint (id, quest_progress_id, type, stage, enemies, passed, treasure, linked) VALUES (5418, 952, 'start', 0, NULL, false, 0, '5419,5420');
INSERT INTO public.quest_checkpoint (id, quest_progress_id, type, stage, enemies, passed, treasure, linked) VALUES (5427, 952, 'camp', 6, NULL, false, 0, '5429');
INSERT INTO public.quest_checkpoint (id, quest_progress_id, type, stage, enemies, passed, treasure, linked) VALUES (5428, 952, 'camp', 6, NULL, false, 0, '5429');
INSERT INTO public.quest_checkpoint (id, quest_progress_id, type, stage, enemies, passed, treasure, linked) VALUES (5420, 952, 'battle', 1, '[{"id":6,"level":1,"name":"moth","power":16,"health":70,"initiative":3,"defence":1,"experience":15,"loot":{"gold":30},"actorId":0},{"id":9,"level":1,"name":"mechanic_bot","power":24,"health":110,"initiative":5,"defence":4,"experience":25,"loot":{"gold":60},"actorId":1},{"id":9,"level":1,"name":"mechanic_bot","power":24,"health":110,"initiative":5,"defence":4,"experience":25,"loot":{"gold":60},"actorId":2}]', false, 0, '5421');
INSERT INTO public.quest_checkpoint (id, quest_progress_id, type, stage, enemies, passed, treasure, linked) VALUES (5424, 952, 'battle', 4, '[{"id":8,"level":1,"name":"knight","power":12,"health":90,"initiative":3,"defence":5,"experience":20,"loot":{"gold":50},"actorId":0},{"id":2,"level":1,"name":"snake","power":20,"health":100,"initiative":2,"defence":2,"experience":20,"loot":{"gold":40},"actorId":1},{"id":9,"level":1,"name":"mechanic_bot","power":24,"health":110,"initiative":5,"defence":4,"experience":25,"loot":{"gold":60},"actorId":2},{"id":8,"level":1,"name":"knight","power":12,"health":90,"initiative":3,"defence":5,"experience":20,"loot":{"gold":50},"actorId":3},{"id":9,"level":1,"name":"mechanic_bot","power":24,"health":110,"initiative":5,"defence":4,"experience":25,"loot":{"gold":60},"actorId":4}]', false, 0, '5426');
INSERT INTO public.quest_checkpoint (id, quest_progress_id, type, stage, enemies, passed, treasure, linked) VALUES (5425, 952, 'battle', 5, '[{"id":2,"level":1,"name":"snake","power":20,"health":100,"initiative":2,"defence":2,"experience":20,"loot":{"gold":40},"actorId":0},{"id":6,"level":1,"name":"moth","power":16,"health":70,"initiative":3,"defence":1,"experience":15,"loot":{"gold":30},"actorId":1},{"id":9,"level":1,"name":"mechanic_bot","power":24,"health":110,"initiative":5,"defence":4,"experience":25,"loot":{"gold":60},"actorId":2}]', false, 0, '5427');
INSERT INTO public.quest_checkpoint (id, quest_progress_id, type, stage, enemies, passed, treasure, linked) VALUES (5426, 952, 'battle', 5, '[{"id":1,"level":1,"name":"goblin","power":26,"health":120,"initiative":4,"defence":3,"experience":40,"loot":{"gold":50},"actorId":0},{"id":6,"level":1,"name":"moth","power":16,"health":70,"initiative":3,"defence":1,"experience":15,"loot":{"gold":30},"actorId":1},{"id":6,"level":1,"name":"moth","power":16,"health":70,"initiative":3,"defence":1,"experience":15,"loot":{"gold":30},"actorId":2},{"id":8,"level":1,"name":"knight","power":12,"health":90,"initiative":3,"defence":5,"experience":20,"loot":{"gold":50},"actorId":3}]', false, 0, '5428');
INSERT INTO public.quest_checkpoint (id, quest_progress_id, type, stage, enemies, passed, treasure, linked) VALUES (5419, 952, 'battle', 1, '[{"id":2,"level":1,"name":"snake","power":20,"health":100,"initiative":2,"defence":2,"experience":20,"loot":{"gold":40},"actorId":0},{"id":1,"level":1,"name":"goblin","power":26,"health":120,"initiative":4,"defence":3,"experience":40,"loot":{"gold":50},"actorId":1},{"id":1,"level":1,"name":"goblin","power":26,"health":120,"initiative":4,"defence":3,"experience":40,"loot":{"gold":50},"actorId":2}]', true, 0, '5421');


--
-- TOC entry 3119 (class 0 OID 16891)
-- Dependencies: 209
-- Data for Name: quest_progress; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.quest_progress (id, user_id, quest_id, embarked_time, completed) VALUES (952, 1, 3, '2022-01-13 19:51:00.174159+03', false);


--
-- TOC entry 3130 (class 0 OID 17032)
-- Dependencies: 220
-- Data for Name: skill; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.skill (id, name, description, type, hero_type, mana_cost) VALUES (13, 'Слово лечит', 'Восстанавливает часть здоровья себе или согрупнику', 9, 3, 10);
INSERT INTO public.skill (id, name, description, type, hero_type, mana_cost) VALUES (2, 'Ошеломляющий удар', 'До своего следующего хода противник получает увеличенный урон', 1, 0, 20);
INSERT INTO public.skill (id, name, description, type, hero_type, mana_cost) VALUES (3, 'Сбивание брони', 'Снижает на определенное количество времени защиту противника', 2, 0, 30);
INSERT INTO public.skill (id, name, description, type, hero_type, mana_cost) VALUES (5, 'Заморозка', 'Противник получает урон и может пропустить свой ход', 4, 1, 20);
INSERT INTO public.skill (id, name, description, type, hero_type, mana_cost) VALUES (6, 'Время вперед', 'Шанс получить дополнительный ход герою', 5, 1, 30);
INSERT INTO public.skill (id, name, description, type, hero_type, mana_cost) VALUES (8, 'Отравленный кинжал', 'Наносит урон с течением времени', 7, 2, 20);
INSERT INTO public.skill (id, name, description, type, hero_type, mana_cost) VALUES (9, 'Уворот', 'Шанс полностью избежать урон', 8, 2, 30);
INSERT INTO public.skill (id, name, description, type, hero_type, mana_cost) VALUES (14, 'За общее благо', 'Восстанавливает часть здоровья всей группе', 10, 3, 20);
INSERT INTO public.skill (id, name, description, type, hero_type, mana_cost) VALUES (15, 'Вдохновение', 'Удар героя может задеть несколько противников', 11, 3, 30);
INSERT INTO public.skill (id, name, description, type, hero_type, mana_cost) VALUES (1, 'Круговой удар', 'Наносит физический урон цели и ближайшим противникам', 0, 0, 10);
INSERT INTO public.skill (id, name, description, type, hero_type, mana_cost) VALUES (4, 'Огненный шар', 'Наносит магический урон цели и ближайшим противникам', 3, 1, 10);
INSERT INTO public.skill (id, name, description, type, hero_type, mana_cost) VALUES (7, 'Удар в спину', 'Наносит утроенный урон противнику', 6, 2, 10);


--
-- TOC entry 3110 (class 0 OID 16785)
-- Dependencies: 200
-- Data for Name: stats; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.stats (user_id, gold, fame) VALUES (1, 25472, 810);


--
-- TOC entry 3107 (class 0 OID 16740)
-- Dependencies: 197
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public."user" (id, login, password) VALUES (1, 'aintech', '$2a$12$lyi9qsxa/KsP9Cq0ZbrodOlebEqYg8EXF5g7Iu5aO03cw/.B.ONgS');


--
-- TOC entry 3135 (class 0 OID 17196)
-- Dependencies: 225
-- Data for Name: user_alchemist_assortment; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.user_alchemist_assortment (user_id, item_id) VALUES (1, 1);
INSERT INTO public.user_alchemist_assortment (user_id, item_id) VALUES (1, 2);
INSERT INTO public.user_alchemist_assortment (user_id, item_id) VALUES (1, 3);
INSERT INTO public.user_alchemist_assortment (user_id, item_id) VALUES (1, 4);
INSERT INTO public.user_alchemist_assortment (user_id, item_id) VALUES (1, 5);
INSERT INTO public.user_alchemist_assortment (user_id, item_id) VALUES (1, 6);


--
-- TOC entry 3131 (class 0 OID 17147)
-- Dependencies: 221
-- Data for Name: user_market_assortment; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.user_market_assortment (user_id, equipment_id) VALUES (1, 1);
INSERT INTO public.user_market_assortment (user_id, equipment_id) VALUES (1, 2);
INSERT INTO public.user_market_assortment (user_id, equipment_id) VALUES (1, 3);
INSERT INTO public.user_market_assortment (user_id, equipment_id) VALUES (1, 4);
INSERT INTO public.user_market_assortment (user_id, equipment_id) VALUES (1, 5);
INSERT INTO public.user_market_assortment (user_id, equipment_id) VALUES (1, 6);
INSERT INTO public.user_market_assortment (user_id, equipment_id) VALUES (1, 7);
INSERT INTO public.user_market_assortment (user_id, equipment_id) VALUES (1, 8);
INSERT INTO public.user_market_assortment (user_id, equipment_id) VALUES (1, 9);


--
-- TOC entry 3154 (class 0 OID 0)
-- Dependencies: 226
-- Name: building_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.building_user_id_seq', 1, false);


--
-- TOC entry 3155 (class 0 OID 0)
-- Dependencies: 204
-- Name: equipment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.equipment_id_seq', 9, true);


--
-- TOC entry 3156 (class 0 OID 0)
-- Dependencies: 198
-- Name: hero_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.hero_id_seq', 1282, true);


--
-- TOC entry 3157 (class 0 OID 0)
-- Dependencies: 224
-- Name: item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.item_id_seq', 6, true);


--
-- TOC entry 3158 (class 0 OID 0)
-- Dependencies: 212
-- Name: monster_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.monster_id_seq', 9, true);


--
-- TOC entry 3159 (class 0 OID 0)
-- Dependencies: 216
-- Name: perk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.perk_id_seq', 11, true);


--
-- TOC entry 3160 (class 0 OID 0)
-- Dependencies: 210
-- Name: quest_checkpoints_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.quest_checkpoints_id_seq', 5429, true);


--
-- TOC entry 3161 (class 0 OID 0)
-- Dependencies: 201
-- Name: quest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.quest_id_seq', 14, true);


--
-- TOC entry 3162 (class 0 OID 0)
-- Dependencies: 208
-- Name: quest_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.quest_progress_id_seq', 952, true);


--
-- TOC entry 3163 (class 0 OID 0)
-- Dependencies: 219
-- Name: skill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.skill_id_seq', 15, true);


--
-- TOC entry 3164 (class 0 OID 0)
-- Dependencies: 199
-- Name: stats_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.stats_user_id_seq', 1, false);


--
-- TOC entry 3165 (class 0 OID 0)
-- Dependencies: 196
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.user_id_seq', 19, true);


--
-- TOC entry 2982 (class 2606 OID 17235)
-- Name: building building_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.building
    ADD CONSTRAINT building_pkey PRIMARY KEY (user_id, type);


--
-- TOC entry 2984 (class 2606 OID 17240)
-- Name: building_upgrade building_upgrade_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.building_upgrade
    ADD CONSTRAINT building_upgrade_pkey PRIMARY KEY (type, level);


--
-- TOC entry 2954 (class 2606 OID 16879)
-- Name: equipment equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_pkey PRIMARY KEY (id);


--
-- TOC entry 2976 (class 2606 OID 17177)
-- Name: equipment_tier equipment_tier_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.equipment_tier
    ADD CONSTRAINT equipment_tier_pkey PRIMARY KEY (equipment_id, tier);


--
-- TOC entry 2952 (class 2606 OID 17161)
-- Name: hero_equipment hero_equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.hero_equipment
    ADD CONSTRAINT hero_equipment_pkey PRIMARY KEY (hero_id, equipment_id);


--
-- TOC entry 2966 (class 2606 OID 17195)
-- Name: hero_item hero_item_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.hero_item
    ADD CONSTRAINT hero_item_pkey PRIMARY KEY (hero_id, item_id);


--
-- TOC entry 2950 (class 2606 OID 16811)
-- Name: level_exp hero_level_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.level_exp
    ADD CONSTRAINT hero_level_pkey PRIMARY KEY (level);


--
-- TOC entry 2964 (class 2606 OID 17000)
-- Name: hero_activity hero_occupation_pkey1; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.hero_activity
    ADD CONSTRAINT hero_occupation_pkey1 PRIMARY KEY (hero_id);


--
-- TOC entry 2970 (class 2606 OID 17029)
-- Name: hero_perk hero_perk_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.hero_perk
    ADD CONSTRAINT hero_perk_pkey PRIMARY KEY (hero_id, perk_id);


--
-- TOC entry 2956 (class 2606 OID 16888)
-- Name: hero hero_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.hero
    ADD CONSTRAINT hero_pkey PRIMARY KEY (id);


--
-- TOC entry 2978 (class 2606 OID 17190)
-- Name: item item_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_pkey PRIMARY KEY (id);


--
-- TOC entry 2962 (class 2606 OID 16940)
-- Name: monster monster_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.monster
    ADD CONSTRAINT monster_pkey PRIMARY KEY (id);


--
-- TOC entry 2968 (class 2606 OID 17024)
-- Name: perk perk_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.perk
    ADD CONSTRAINT perk_pkey PRIMARY KEY (id);


--
-- TOC entry 2960 (class 2606 OID 16910)
-- Name: quest_checkpoint quest_checkpoints_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.quest_checkpoint
    ADD CONSTRAINT quest_checkpoints_pkey PRIMARY KEY (id);


--
-- TOC entry 2948 (class 2606 OID 16801)
-- Name: quest quest_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.quest
    ADD CONSTRAINT quest_pkey PRIMARY KEY (id);


--
-- TOC entry 2958 (class 2606 OID 16897)
-- Name: quest_progress quest_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.quest_progress
    ADD CONSTRAINT quest_progress_pkey PRIMARY KEY (id);


--
-- TOC entry 2972 (class 2606 OID 17040)
-- Name: skill skill_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.skill
    ADD CONSTRAINT skill_pkey PRIMARY KEY (id);


--
-- TOC entry 2946 (class 2606 OID 16790)
-- Name: stats stats_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.stats
    ADD CONSTRAINT stats_pkey PRIMARY KEY (user_id);


--
-- TOC entry 2980 (class 2606 OID 17200)
-- Name: user_alchemist_assortment user_alchemist_assortment_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.user_alchemist_assortment
    ADD CONSTRAINT user_alchemist_assortment_pkey PRIMARY KEY (user_id, item_id);


--
-- TOC entry 2974 (class 2606 OID 17151)
-- Name: user_market_assortment user_market_assortment_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.user_market_assortment
    ADD CONSTRAINT user_market_assortment_pkey PRIMARY KEY (user_id, equipment_id);


--
-- TOC entry 2944 (class 2606 OID 16748)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


-- Completed on 2022-01-27 18:51:21 MSK

--
-- PostgreSQL database dump complete
--

