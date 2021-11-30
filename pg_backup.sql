--
-- PostgreSQL database dump
--

-- Dumped from database version 10.19 (Ubuntu 10.19-1.pgdg18.04+1)
-- Dumped by pg_dump version 14.1 (Ubuntu 14.1-1.pgdg18.04+1)

-- Started on 2021-11-29 17:01:31 MSK

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
-- TOC entry 3144 (class 0 OID 0)
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
    avatar character varying NOT NULL,
    thief boolean DEFAULT false NOT NULL,
    paladin boolean DEFAULT false NOT NULL,
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
    upgrading_time bigint DEFAULT 120 NOT NULL
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
    type bigint DEFAULT 0 NOT NULL
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
    avatar character varying NOT NULL,
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
-- TOC entry 3145 (class 0 OID 0)
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
-- TOC entry 3146 (class 0 OID 0)
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
    occured_at bigint NOT NULL,
    enemies character varying,
    passed boolean NOT NULL,
    tribute bigint DEFAULT 0 NOT NULL
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
-- TOC entry 3147 (class 0 OID 0)
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
-- TOC entry 3148 (class 0 OID 0)
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
-- TOC entry 3149 (class 0 OID 0)
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
    hero_type character varying NOT NULL,
    level bigint DEFAULT 1 NOT NULL
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
-- TOC entry 3150 (class 0 OID 0)
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
-- TOC entry 3151 (class 0 OID 0)
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
-- TOC entry 3152 (class 0 OID 0)
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
-- TOC entry 2925 (class 2604 OID 16963)
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

INSERT INTO public.equipment (id, name, description, level, price, warrior, mage, avatar, thief, paladin, healer, type, buying_time) VALUES (1, 'Старый меч', 'Просто старый и немного ржавый меч', 1, 100, true, false, 'rusty_sword', false, true, false, 0, 120);
INSERT INTO public.equipment (id, name, description, level, price, warrior, mage, avatar, thief, paladin, healer, type, buying_time) VALUES (2, 'Кривой посох', 'Простая палка, найдена валяющейся не так далеко от источника силы', 1, 100, false, true, 'bent_staff', false, false, true, 0, 120);
INSERT INTO public.equipment (id, name, description, level, price, warrior, mage, avatar, thief, paladin, healer, type, buying_time) VALUES (3, 'Плотная рубаха', 'Мало что представляет в плане защиты', 1, 70, true, true, 'simple_shirt', true, true, true, 1, 120);
INSERT INTO public.equipment (id, name, description, level, price, warrior, mage, avatar, thief, paladin, healer, type, buying_time) VALUES (4, 'Бронзовый меч', 'Меч из бронзы', 2, 150, true, false, 'no_image', false, true, false, 0, 120);
INSERT INTO public.equipment (id, name, description, level, price, warrior, mage, avatar, thief, paladin, healer, type, buying_time) VALUES (5, 'Старый кинжал', 'Похоже этот кинжал провалялся на задворках лет сто, лезвие остротоой не блещет', 1, 100, false, false, 'no_image', true, false, false, 0, 120);
INSERT INTO public.equipment (id, name, description, level, price, warrior, mage, avatar, thief, paladin, healer, type, buying_time) VALUES (6, 'Стальной меч', 'Уже можно считать оружием', 3, 250, true, false, 'no_image', false, true, false, 0, 120);
INSERT INTO public.equipment (id, name, description, level, price, warrior, mage, avatar, thief, paladin, healer, type, buying_time) VALUES (7, 'Деревянный посох', 'В посохе есть магия, в зачаточном состоянии', 2, 150, false, true, 'no_image', false, false, true, 0, 120);
INSERT INTO public.equipment (id, name, description, level, price, warrior, mage, avatar, thief, paladin, healer, type, buying_time) VALUES (8, 'Простая роба', 'Подходит для начинающих магов, чтобы побродить туда-сюда, сражаться в этом не стоит', 2, 120, false, true, 'no_image', false, false, true, 1, 120);
INSERT INTO public.equipment (id, name, description, level, price, warrior, mage, avatar, thief, paladin, healer, type, buying_time) VALUES (9, 'Кожанная куртка', 'Защитит от острых веток и колючек, на что-то посерьезнее рассчитывать не стоит', 2, 120, true, false, 'no_image', true, true, false, 1, 120);


--
-- TOC entry 3132 (class 0 OID 17169)
-- Dependencies: 222
-- Data for Name: equipment_tier; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (1, 1, 6, 0, 0, 0, 120);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (2, 1, 6, 0, 0, 0, 120);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (3, 1, 0, 4, 0, 0, 120);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (4, 1, 8, 0, 0, 0, 120);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (5, 1, 6, 0, 0, 0, 120);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (6, 1, 11, 0, 0, 0, 120);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (7, 1, 8, 0, 0, 0, 120);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (8, 1, 0, 6, 0, 0, 120);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (9, 1, 0, 6, 0, 0, 120);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (1, 0, 5, 0, 0, 0, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (2, 0, 5, 0, 0, 0, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (3, 0, 0, 3, 0, 0, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (4, 0, 7, 0, 0, 0, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (5, 0, 5, 0, 0, 0, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (6, 0, 10, 0, 0, 0, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (7, 0, 7, 0, 0, 0, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (8, 0, 0, 5, 0, 0, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (9, 0, 0, 5, 0, 0, 0);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (1, 2, 7, 0, 0, 0, 240);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (2, 2, 7, 0, 0, 0, 240);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (3, 2, 0, 5, 0, 0, 240);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (4, 2, 9, 0, 0, 0, 240);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (5, 2, 7, 0, 0, 0, 240);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (6, 2, 12, 0, 0, 0, 240);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (7, 2, 9, 0, 0, 0, 240);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (8, 2, 0, 7, 0, 0, 240);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (9, 2, 0, 7, 0, 0, 240);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (1, 3, 8, 0, 0, 0, 500);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (2, 3, 8, 0, 0, 0, 500);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (3, 3, 0, 6, 0, 0, 500);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (4, 3, 10, 0, 0, 0, 500);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (5, 3, 8, 0, 0, 0, 500);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (6, 3, 13, 0, 0, 0, 500);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (7, 3, 10, 0, 0, 0, 500);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (8, 3, 0, 8, 0, 0, 500);
INSERT INTO public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time) VALUES (9, 3, 0, 8, 0, 0, 500);


--
-- TOC entry 3117 (class 0 OID 16880)
-- Dependencies: 207
-- Data for Name: hero; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (842, 1, 'Троя', 8, 0, 100, 0, 0, 10, 2, true, '2021-11-25 18:02:01.280163', 1, 1);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (837, 1, 'Клевер', 8, 0, 100, 0, 0, 10, 2, true, '2021-11-24 17:38:09.338954', 1, 3);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (746, 1, 'Серпок', 7, 0, 140, 0, 12, 14, 2, true, '2021-10-11 12:21:14.968445', 1, 3);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (839, 1, 'Сарина', 8, 0, 130, 0, 0, 13, 2, true, '2021-11-24 17:38:07.338954', 1, 4);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (835, 1, 'Мира', 9, 0, 120, 0, 2, 12, 2, true, '2021-11-24 17:38:08.338954', 1, 1);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (873, 1, 'Цветик', 6, 0, 140, 0, 200, 14, 2, false, '2021-11-29 13:58:46.694015', 1, 4);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (838, 1, 'Луна', 10, 0, 120, 0, 12, 12, 2, true, '2021-11-24 17:38:05.338954', 1, 0);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (874, 1, 'Сола', 10, 0, 130, 0, 230, 13, 2, false, '2021-11-29 13:58:38.694015', 1, 3);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (875, 1, 'Белянка', 6, 0, 100, 0, 160, 10, 2, false, '2021-11-29 13:58:44.694015', 1, 1);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (876, 1, 'Аркада', 10, 0, 130, 0, 230, 13, 2, false, '2021-11-29 13:58:41.694015', 1, 2);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (877, 1, 'Мира', 5, 0, 130, 0, 180, 13, 2, false, '2021-11-29 13:58:49.694015', 1, 0);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (878, 1, 'Каппи', 10, 0, 130, 0, 230, 13, 2, false, '2021-11-29 13:58:48.694015', 1, 4);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (879, 1, 'Сарина', 5, 0, 140, 0, 190, 14, 2, false, '2021-11-29 13:58:42.694015', 1, 2);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (880, 1, 'Луна', 7, 0, 140, 0, 210, 14, 2, false, '2021-11-29 13:58:40.694015', 1, 0);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (881, 1, 'Патока', 9, 0, 100, 0, 190, 10, 2, false, '2021-11-29 13:58:50.694015', 1, 2);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (882, 1, 'Саргона', 5, 0, 100, 0, 150, 10, 2, false, '2021-11-29 13:58:43.694015', 1, 4);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (883, 1, 'Тэрра', 6, 0, 140, 0, 200, 14, 2, false, '2021-11-29 13:58:45.694015', 1, 0);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (884, 1, 'Патока', 6, 0, 120, 0, 180, 12, 2, false, '2021-11-29 13:58:47.694015', 1, 2);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (885, 1, 'Тэрра', 6, 0, 140, 0, 200, 14, 2, false, '2021-11-29 13:58:39.694015', 1, 2);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (861, 1, 'Белянка', 10, 0, 130, 0, 18, 13, 2, true, '2021-11-28 12:38:36.33364', 1, 2);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (603, 1, 'Мосток', 7, 0, 110, 205, 60, 11, 2, true, '2021-08-07 10:23:48.924464', 1, 2);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (604, 1, 'Ровер', 7, 0, 120, 163, 120, 12, 2, true, '2021-08-07 10:23:51.924464', 1, 1);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (606, 1, 'Карион', 8, 0, 120, 163, 120, 12, 2, true, '2021-08-07 10:23:50.924464', 1, 3);
INSERT INTO public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type) VALUES (601, 1, 'Карион', 12, 0, 160, 565, 30, 16, 2, true, '2021-08-07 10:23:47.924464', 2, 4);


--
-- TOC entry 3124 (class 0 OID 16993)
-- Dependencies: 214
-- Data for Name: hero_activity; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) VALUES (861, 1, '2021-11-29 14:39:47.984837+03', 120, 6, 'Улучшает Старый меч в кузнице');
INSERT INTO public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) VALUES (606, NULL, '2021-11-19 19:21:10.509452+03', NULL, 0, 'Не при делах');
INSERT INTO public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) VALUES (601, NULL, '2021-11-22 12:37:33.990453+03', NULL, 0, 'Не при делах');
INSERT INTO public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) VALUES (604, NULL, '2021-11-22 18:47:27.550195+03', NULL, 0, 'Не при делах');
INSERT INTO public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) VALUES (603, 3, '2021-11-22 18:47:32.515033+03', NULL, 1, 'Выполняет задание Бить и пить');
INSERT INTO public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) VALUES (837, NULL, '2021-11-24 20:44:11.01868+03', NULL, 0, 'Не при делах');
INSERT INTO public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) VALUES (839, NULL, '2021-11-24 20:46:11.855399+03', NULL, 0, 'Не при делах');
INSERT INTO public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) VALUES (835, NULL, '2021-11-24 20:48:14.864312+03', NULL, 0, 'Не при делах');
INSERT INTO public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) VALUES (838, NULL, '2021-11-24 21:43:11.921993+03', NULL, 0, 'Не при делах');
INSERT INTO public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) VALUES (746, NULL, '2021-10-29 00:06:48.067495+03', NULL, 0, 'Не при делах');
INSERT INTO public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) VALUES (842, NULL, '2021-11-25 22:30:29.163857+03', NULL, 0, 'Не при делах');


--
-- TOC entry 3115 (class 0 OID 16854)
-- Dependencies: 205
-- Data for Name: hero_equipment; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (837, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (839, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (873, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (874, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (875, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (876, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (877, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (878, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (879, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (837, 7, 1);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (835, 7, 1);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (839, 4, 2);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (601, 4, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (880, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (835, 3, 2);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (746, 7, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (838, 4, 1);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (881, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (838, 3, 2);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (882, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (842, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (883, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (884, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (885, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (873, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (842, 7, 1);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (874, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (875, 2, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (603, 9, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (876, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (877, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (603, 1, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (878, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (606, 7, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (879, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (880, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (881, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (882, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (604, 8, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (606, 8, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (604, 7, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (883, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (884, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (885, 1, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (601, 9, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (861, 9, 3);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (746, 3, 0);
INSERT INTO public.hero_equipment (hero_id, equipment_id, tier) VALUES (861, 1, 0);


--
-- TOC entry 3125 (class 0 OID 17005)
-- Dependencies: 215
-- Data for Name: hero_item; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (861, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (603, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (604, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (606, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (601, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (603, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (861, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (604, 3, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (606, 3, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (746, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (601, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (746, 3, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (873, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (874, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (875, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (876, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (877, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (878, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (879, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (880, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (835, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (881, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (837, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (838, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (839, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (882, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (835, 3, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (883, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (837, 3, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (838, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (839, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (884, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (885, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (842, 1, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (873, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (874, 3, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (875, 3, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (876, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (877, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (878, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (879, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (880, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (881, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (882, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (883, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (842, 3, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (884, 2, 3);
INSERT INTO public.hero_item (hero_id, item_id, amount) VALUES (885, 2, 3);


--
-- TOC entry 3128 (class 0 OID 17025)
-- Dependencies: 218
-- Data for Name: hero_perk; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (601, 11);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (601, 9);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (601, 3);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (606, 11);
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
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (861, 6);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (873, 9);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (874, 6);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (874, 10);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (875, 6);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (876, 4);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (876, 1);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (877, 8);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (878, 1);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (879, 5);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (880, 8);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (881, 1);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (881, 3);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (882, 9);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (883, 1);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (883, 3);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (883, 9);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (884, 8);
INSERT INTO public.hero_perk (hero_id, perk_id) VALUES (885, 7);


--
-- TOC entry 3133 (class 0 OID 17183)
-- Dependencies: 223
-- Data for Name: item; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.item (id, name, description, price, avatar, type, subtype, buying_time) VALUES (1, 'Зелье здоровья', 'Зелье восстанавливает 50% HP', 20, 'no_image', 0, 0, 120);
INSERT INTO public.item (id, name, description, price, avatar, type, subtype, buying_time) VALUES (2, 'Эликсир здоровья', 'Эликсир восстанавливает 100% HP', 50, 'no_image', 0, 1, 120);
INSERT INTO public.item (id, name, description, price, avatar, type, subtype, buying_time) VALUES (3, 'Зелье маны', 'Зелье восстанавливает 50% MP', 20, 'no_image', 0, 2, 120);


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

INSERT INTO public.monster (id, level, name, power, health, initiative, defence, experience, loot) VALUES (2, 1, 'snake', 10, 500, 2, 2, 20, '{"gold": 40}');
INSERT INTO public.monster (id, level, name, power, health, initiative, defence, experience, loot) VALUES (1, 1, 'goblin', 12, 600, 4, 3, 40, '{"gold": 50}');
INSERT INTO public.monster (id, level, name, power, health, initiative, defence, experience, loot) VALUES (6, 1, 'moth', 9, 300, 3, 1, 15, '{"gold": 30}');


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

INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (2, 2, 'Гоблинский шабаш', 'Орава гоблинов совсем распоясалась, нормальным людям спать не даёт, гоните их в шею, а с меня :tribute монет.', 20, 350, 200, 120);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (4, 5, 'Хочу рыбачить', 'Прибейте кто-нибудь этих утопцев наконец, воду мутят, рыбу жрут, рыбачить невозможно. Готов отдать :tribute монет тому кто избавится от негодных.', 50, 570, 500, 120);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (5, 10, 'Голем', 'Я - Великий хранитель тайн и запретных знаний Астох создал невероятное создание - настоящего мышиного Голема. Так теперь эта сволочь сидит в подвале и пожирает мои харчи. Удавите его поскорее и вынесите куда-нибудь в лес. Сокровища в :tribute монет ждут смельчаков.', 100, 890, 1000, 120);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (3, 1, 'Бить и пить', 'Дам бочку отличного пива и мешочек со :tribute монетами тому кто прогонит с моей винодельни проклятых гарпий.', 10, 150, 100, 3);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (1, 3, 'Охота на ведьмочек', 'Три миловидные ведьмы проводят в нашем сарае свои глупые ритуалы! А как нам картоху копать без лопат? Мешочек на :tribute монет ждёт героев.', 30, 200, 300, 120);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (6, 5, 'Ради науки', 'Мне нужны помет летучих мышей Кролоса один пуд, хвосты игуан Гарула штук 10 и ещё 12 голов кусь-рыбы с Тароса. Знание алхимии приветствуется (те кто не знает где у кусь-рыбы хвост а где башка даже не приходите). Даю :tribute монет.', 50, 1050, 500, 120);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (7, 7, 'Веселые тролли', 'Приходите на праздник в наш город, у нас будут веселые тролли! Они будут плясать, петь песни, устраивать представления. Научат жить не зная зла и бед! Вход бесплатый!', 50, 0, 600, 120);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (9, 8, 'Ходячий валежник', 'Тут в лесу завелись какие-то живые кусты, когда бабы за валежником ходили - одного такого чуть на дрова не порубили, он их поптом до самой деревни гнал. Шаман говорит что это дендрарианы или как-то так. Вобщем отчистите лес от наваждения, награда :tribute монет.', 90, 950, 1020, 120);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (8, 4, 'Наглые гарпии', 'Кучка гарпий поселилась на наших полях! Чего им там нужно, это же не утесы! Пугал ставили, так они из них гнёзда устроили. Короче гоните пернатых, мы для этих целей :tribute монетами скинулись.', 40, 250, 260, 120);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (10, 1, 'Крысы в подвале', 'В моем подвале завелись крысы! Шуршат всю ночь что не уснуть. Запасы подъедают, и ладно бы зерно, так они буженину предпочитают! Зачистите подвал от этих тварей, оплачиваю по хвостам, до :tribute монет.', 15, 80, 220, 120);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (11, 6, 'Зайцы-оборотни', 'Здесь довечи странный зверь завёлся - днём обычный заяц, а как тьма наступит в зубастое чудище превращается! Наши охотники поймали пару таких в силки, домой принесли, а ночью им хаты разнесло. Помогите с напастью и :tribute монет ваши.', 75, 850, 780, 120);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (12, 12, 'Полуночницы', 'Ищутся герои которые помогут с бедствием постигнувшим нашу деревню. В заброшеном доме поселились полуночницы - днем от них проблем нет, а вот ночью вылезают из дому и ходят стучаться к соседям - кто открыл тот пропал! Так вся деревня скоро вымрет, приходите мы собрали :tribute монет.', 120, 1540, 1450, 120);
INSERT INTO public.quest (id, level, title, description, fame, tribute, experience, travel_time) VALUES (13, 15, 'Жуткий замок', 'У нас рядом есть старый замок, и вот неавно там всякая нечисть завелась. Земля вокруг замка стала непладородной, по ночам призраки гуляют вокруг, говорят зомби видели. А ещё говорят тёмный лорд там завелся, ещё чего решит отправится мир завоёвывать а оно нам надо? Вобщем с города :tribute монет, с героев разогнать нежить!', 200, 2400, 2500, 120);


--
-- TOC entry 3121 (class 0 OID 16902)
-- Dependencies: 211
-- Data for Name: quest_checkpoint; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.quest_checkpoint (id, quest_progress_id, type, occured_at, enemies, passed, tribute) VALUES (4101, 831, 'treasure', 15, NULL, false, 29);
INSERT INTO public.quest_checkpoint (id, quest_progress_id, type, occured_at, enemies, passed, tribute) VALUES (4102, 831, 'battle', 25, '[{"id":2,"level":1,"name":"snake","power":10,"health":500,"initiative":2,"defence":2,"experience":20,"actorId":0,"drop":[{"fraction":258,"gold":1},{"fraction":447,"gold":1},{"fraction":386,"gold":1},{"fraction":111,"gold":1},{"fraction":114,"gold":1},{"fraction":115,"gold":1},{"fraction":78,"gold":1},{"fraction":336,"gold":1},{"fraction":187,"gold":1},{"fraction":278,"gold":1},{"fraction":124,"gold":1},{"fraction":129,"gold":1},{"fraction":439,"gold":1},{"fraction":186,"gold":1},{"fraction":149,"gold":1},{"fraction":190,"gold":1},{"fraction":250,"gold":1},{"fraction":345,"gold":1},{"fraction":104,"gold":1},{"fraction":154,"gold":1},{"fraction":191,"gold":1},{"fraction":304,"gold":1},{"fraction":175,"gold":1},{"fraction":133,"gold":1},{"fraction":293,"gold":1},{"fraction":325,"gold":1},{"fraction":401,"gold":1},{"fraction":148,"gold":1},{"fraction":170,"gold":1},{"fraction":141,"gold":1},{"fraction":108,"gold":1},{"fraction":340,"gold":1},{"fraction":328,"gold":1},{"fraction":144,"gold":1},{"fraction":98,"gold":1},{"fraction":139,"gold":1},{"fraction":145,"gold":1},{"fraction":368,"gold":1},{"fraction":329,"gold":1},{"fraction":53,"gold":1},{"fraction":183,"gold":1},{"fraction":318,"gold":1}]},{"id":2,"level":1,"name":"snake","power":10,"health":500,"initiative":2,"defence":2,"experience":20,"actorId":1,"drop":[{"fraction":427,"gold":1},{"fraction":189,"gold":1},{"fraction":282,"gold":1},{"fraction":438,"gold":1},{"fraction":59,"gold":1},{"fraction":104,"gold":1},{"fraction":198,"gold":1},{"fraction":371,"gold":1},{"fraction":359,"gold":1},{"fraction":338,"gold":1},{"fraction":338,"gold":1},{"fraction":81,"gold":1},{"fraction":246,"gold":1},{"fraction":213,"gold":1},{"fraction":121,"gold":1},{"fraction":175,"gold":1},{"fraction":361,"gold":1},{"fraction":432,"gold":1},{"fraction":135,"gold":1},{"fraction":131,"gold":1},{"fraction":180,"gold":1},{"fraction":277,"gold":1},{"fraction":340,"gold":1},{"fraction":315,"gold":1},{"fraction":214,"gold":1},{"fraction":272,"gold":1},{"fraction":150,"gold":1},{"fraction":158,"gold":1},{"fraction":399,"gold":1},{"fraction":190,"gold":1},{"fraction":127,"gold":1},{"fraction":302,"gold":1},{"fraction":281,"gold":1},{"fraction":432,"gold":1},{"fraction":222,"gold":1},{"fraction":372,"gold":1},{"fraction":347,"gold":1},{"fraction":99,"gold":1},{"fraction":413,"gold":1},{"fraction":199,"gold":1},{"fraction":92,"gold":1},{"fraction":86,"gold":1},{"fraction":110,"gold":1},{"fraction":72,"gold":1},{"fraction":81,"gold":1},{"fraction":198,"gold":1},{"fraction":364,"gold":1},{"fraction":62,"gold":1}]},{"id":2,"level":1,"name":"snake","power":10,"health":500,"initiative":2,"defence":2,"experience":20,"actorId":2,"drop":[{"fraction":272,"gold":1},{"fraction":67,"gold":1},{"fraction":82,"gold":1},{"fraction":170,"gold":1},{"fraction":356,"gold":1},{"fraction":332,"gold":1},{"fraction":186,"gold":1},{"fraction":429,"gold":1},{"fraction":418,"gold":1},{"fraction":190,"gold":1},{"fraction":387,"gold":1},{"fraction":154,"gold":1},{"fraction":107,"gold":1},{"fraction":208,"gold":1},{"fraction":184,"gold":1},{"fraction":226,"gold":1},{"fraction":372,"gold":1},{"fraction":102,"gold":1},{"fraction":165,"gold":1},{"fraction":92,"gold":1},{"fraction":214,"gold":1},{"fraction":54,"gold":1},{"fraction":179,"gold":1},{"fraction":229,"gold":1},{"fraction":58,"gold":1},{"fraction":136,"gold":1},{"fraction":97,"gold":1},{"fraction":173,"gold":1},{"fraction":87,"gold":1},{"fraction":395,"gold":1},{"fraction":399,"gold":1},{"fraction":83,"gold":1}]}]', false, 53);
INSERT INTO public.quest_checkpoint (id, quest_progress_id, type, occured_at, enemies, passed, tribute) VALUES (4103, 831, 'battle', 5, '[{"id":2,"level":1,"name":"snake","power":10,"health":500,"initiative":2,"defence":2,"experience":20,"actorId":0,"drop":[{"fraction":303,"gold":1},{"fraction":179,"gold":1},{"fraction":188,"gold":1},{"fraction":334,"gold":1},{"fraction":323,"gold":1},{"fraction":123,"gold":1},{"fraction":305,"gold":1},{"fraction":346,"gold":1},{"fraction":329,"gold":1},{"fraction":437,"gold":1},{"fraction":52,"gold":1},{"fraction":191,"gold":1},{"fraction":76,"gold":1},{"fraction":257,"gold":1},{"fraction":209,"gold":1},{"fraction":208,"gold":1},{"fraction":281,"gold":1},{"fraction":238,"gold":1},{"fraction":239,"gold":1},{"fraction":89,"gold":1},{"fraction":428,"gold":1},{"fraction":279,"gold":1},{"fraction":379,"gold":1},{"fraction":58,"gold":1},{"fraction":373,"gold":1},{"fraction":103,"gold":1},{"fraction":335,"gold":1},{"fraction":200,"gold":1},{"fraction":413,"gold":1},{"fraction":160,"gold":1},{"fraction":288,"gold":1},{"fraction":316,"gold":1},{"fraction":76,"gold":1},{"fraction":245,"gold":1},{"fraction":220,"gold":1},{"fraction":75,"gold":1},{"fraction":417,"gold":1}]},{"id":2,"level":1,"name":"snake","power":10,"health":500,"initiative":2,"defence":2,"experience":20,"actorId":1,"drop":[{"fraction":215,"gold":1},{"fraction":394,"gold":1},{"fraction":163,"gold":1},{"fraction":247,"gold":1},{"fraction":277,"gold":1},{"fraction":212,"gold":1},{"fraction":84,"gold":1},{"fraction":322,"gold":1},{"fraction":389,"gold":1},{"fraction":204,"gold":1},{"fraction":202,"gold":1},{"fraction":333,"gold":1},{"fraction":143,"gold":1},{"fraction":301,"gold":1},{"fraction":425,"gold":1},{"fraction":241,"gold":1},{"fraction":177,"gold":1},{"fraction":363,"gold":1},{"fraction":171,"gold":1},{"fraction":439,"gold":1},{"fraction":52,"gold":1},{"fraction":329,"gold":1},{"fraction":270,"gold":1},{"fraction":337,"gold":1},{"fraction":96,"gold":1},{"fraction":163,"gold":1},{"fraction":303,"gold":1},{"fraction":201,"gold":1},{"fraction":56,"gold":1},{"fraction":236,"gold":1},{"fraction":389,"gold":1},{"fraction":338,"gold":1},{"fraction":70,"gold":1},{"fraction":180,"gold":1},{"fraction":400,"gold":1},{"fraction":115,"gold":1},{"fraction":400,"gold":1},{"fraction":180,"gold":1},{"fraction":157,"gold":1},{"fraction":327,"gold":1},{"fraction":212,"gold":1},{"fraction":291,"gold":1},{"fraction":429,"gold":1},{"fraction":216,"gold":1},{"fraction":354,"gold":1}]},{"id":1,"level":1,"name":"goblin","power":12,"health":600,"initiative":4,"defence":3,"experience":40,"actorId":2,"drop":[{"fraction":175,"gold":1},{"fraction":212,"gold":1},{"fraction":469,"gold":1},{"fraction":409,"gold":1},{"fraction":286,"gold":1},{"fraction":289,"gold":1},{"fraction":160,"gold":1},{"fraction":491,"gold":1},{"fraction":299,"gold":1},{"fraction":97,"gold":1},{"fraction":484,"gold":1},{"fraction":272,"gold":1},{"fraction":423,"gold":1},{"fraction":386,"gold":1},{"fraction":324,"gold":1},{"fraction":426,"gold":1},{"fraction":400,"gold":1},{"fraction":489,"gold":1},{"fraction":228,"gold":1},{"fraction":396,"gold":1},{"fraction":465,"gold":1},{"fraction":155,"gold":1},{"fraction":476,"gold":1},{"fraction":82,"gold":1},{"fraction":266,"gold":1},{"fraction":539,"gold":1},{"fraction":489,"gold":1},{"fraction":322,"gold":1},{"fraction":389,"gold":1},{"fraction":435,"gold":1},{"fraction":399,"gold":1},{"fraction":321,"gold":1},{"fraction":200,"gold":1},{"fraction":291,"gold":1},{"fraction":288,"gold":1},{"fraction":460,"gold":1},{"fraction":537,"gold":1},{"fraction":304,"gold":1},{"fraction":337,"gold":1},{"fraction":472,"gold":1}]}]', false, 50);


--
-- TOC entry 3119 (class 0 OID 16891)
-- Dependencies: 209
-- Data for Name: quest_progress; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.quest_progress (id, user_id, quest_id, embarked_time, completed) VALUES (831, 1, 3, '2021-11-22 18:47:35.501946+03', false);


--
-- TOC entry 3130 (class 0 OID 17032)
-- Dependencies: 220
-- Data for Name: skill; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.skill (id, name, description, hero_type, level) VALUES (1, 'Круговой удар', 'Наносит физический урон всем противникам', 'warrior', 1);
INSERT INTO public.skill (id, name, description, hero_type, level) VALUES (4, 'Огненный шар', 'Наносит магический урон всем противникам', 'mage', 1);
INSERT INTO public.skill (id, name, description, hero_type, level) VALUES (7, 'Удар в спину', 'Наносит утроенный урон противнику', 'thief', 1);
INSERT INTO public.skill (id, name, description, hero_type, level) VALUES (10, 'Святой щит', 'Уменьшает урон от противника, если противник нежить - ему возвращается часть урона', 'paladin', 1);
INSERT INTO public.skill (id, name, description, hero_type, level) VALUES (13, 'Слово лекаря', 'Восстанавливает часть здоровья себе или согрупнику', 'healer', 1);
INSERT INTO public.skill (id, name, description, hero_type, level) VALUES (2, 'Ошеломляющий удар', 'До своего следующего хода противник получает увеличенный урон', 'warrior', 2);
INSERT INTO public.skill (id, name, description, hero_type, level) VALUES (5, 'Заморозка', 'Противник пропускает несколько ходов', 'mage', 2);
INSERT INTO public.skill (id, name, description, hero_type, level) VALUES (8, 'Отравленный кинжал', 'Наносит урон с течением времени', 'thief', 2);
INSERT INTO public.skill (id, name, description, hero_type, level) VALUES (11, 'Вдохновение', 'Согрупник готов немедленно действовать', 'paladin', 2);
INSERT INTO public.skill (id, name, description, hero_type, level) VALUES (14, 'Мольба во спасение', 'Восстанавливает часть здоровья всей группе', 'healer', 2);
INSERT INTO public.skill (id, name, description, hero_type, level) VALUES (3, 'Проламывающий удар', 'Снижает на определенное количество времени защиту противника', 'warrior', 3);
INSERT INTO public.skill (id, name, description, hero_type, level) VALUES (6, 'Время вперед', 'Перерыв в действиях героев становится меньше на несколько секунд', 'mage', 3);
INSERT INTO public.skill (id, name, description, hero_type, level) VALUES (9, 'Уворот', 'Шанс полностью избежать урон', 'thief', 3);
INSERT INTO public.skill (id, name, description, hero_type, level) VALUES (12, 'Святая вспышка', 'Вся нежить уровнем ниже героя замирает на несколько ходов', 'paladin', 3);
INSERT INTO public.skill (id, name, description, hero_type, level) VALUES (15, 'Туманный взор', 'Следующий удар противника приходится по другому противнику', 'healer', 3);


--
-- TOC entry 3110 (class 0 OID 16785)
-- Dependencies: 200
-- Data for Name: stats; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

INSERT INTO public.stats (user_id, gold, fame) VALUES (2, 1000, 0);
INSERT INTO public.stats (user_id, gold, fame) VALUES (3, 1000, 0);
INSERT INTO public.stats (user_id, gold, fame) VALUES (4, 1000, 0);
INSERT INTO public.stats (user_id, gold, fame) VALUES (5, 1000, 0);
INSERT INTO public.stats (user_id, gold, fame) VALUES (6, 1000, 0);
INSERT INTO public.stats (user_id, gold, fame) VALUES (1, 20167, 780);


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
-- TOC entry 3153 (class 0 OID 0)
-- Dependencies: 226
-- Name: building_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.building_user_id_seq', 1, false);


--
-- TOC entry 3154 (class 0 OID 0)
-- Dependencies: 204
-- Name: equipment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.equipment_id_seq', 9, true);


--
-- TOC entry 3155 (class 0 OID 0)
-- Dependencies: 198
-- Name: hero_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.hero_id_seq', 885, true);


--
-- TOC entry 3156 (class 0 OID 0)
-- Dependencies: 224
-- Name: item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.item_id_seq', 3, true);


--
-- TOC entry 3157 (class 0 OID 0)
-- Dependencies: 212
-- Name: monster_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.monster_id_seq', 7, true);


--
-- TOC entry 3158 (class 0 OID 0)
-- Dependencies: 216
-- Name: perk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.perk_id_seq', 11, true);


--
-- TOC entry 3159 (class 0 OID 0)
-- Dependencies: 210
-- Name: quest_checkpoints_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.quest_checkpoints_id_seq', 4103, true);


--
-- TOC entry 3160 (class 0 OID 0)
-- Dependencies: 201
-- Name: quest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.quest_id_seq', 13, true);


--
-- TOC entry 3161 (class 0 OID 0)
-- Dependencies: 208
-- Name: quest_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.quest_progress_id_seq', 831, true);


--
-- TOC entry 3162 (class 0 OID 0)
-- Dependencies: 219
-- Name: skill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.skill_id_seq', 15, true);


--
-- TOC entry 3163 (class 0 OID 0)
-- Dependencies: 199
-- Name: stats_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.stats_user_id_seq', 1, false);


--
-- TOC entry 3164 (class 0 OID 0)
-- Dependencies: 196
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yaremchuken
--

SELECT pg_catalog.setval('public.user_id_seq', 6, true);


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


-- Completed on 2021-11-29 17:01:31 MSK

--
-- PostgreSQL database dump complete
--
