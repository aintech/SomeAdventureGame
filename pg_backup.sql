--
-- PostgreSQL database dump
--

-- Dumped from database version 10.19 (Ubuntu 10.19-1.pgdg18.04+1)
-- Dumped by pg_dump version 14.1 (Ubuntu 14.1-1.pgdg18.04+1)

-- Started on 2022-01-19 21:03:02 MSK

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
    wizdom bigint DEFAULT 0 NOT NULL
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
-- TOC entry 2943 (class 2604 OID 17233)
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
-- TOC entry 3138 (class 0 OID 17230)
-- Dependencies: 227
-- Data for Name: building; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

COPY public.building (user_id, type, level, upgrade_started) FROM stdin;
1	0	1	\N
1	7	1	\N
1	4	1	\N
1	3	1	\N
1	8	1	\N
1	10	1	\N
1	1	1	\N
1	2	1	\N
1	5	2	\N
1	6	2	\N
1	9	2	\N
\.


--
-- TOC entry 3139 (class 0 OID 17236)
-- Dependencies: 228
-- Data for Name: building_upgrade; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

COPY public.building_upgrade (type, level, cost, duration) FROM stdin;
0	1	0	0
1	1	0	0
2	1	0	0
3	1	0	0
4	1	0	0
5	1	0	0
6	1	0	0
7	1	0	0
8	1	0	0
9	1	0	0
10	1	0	0
10	2	1000	180
10	3	3000	360
10	4	7000	600
10	5	12000	900
0	2	1000	180
1	2	1000	180
2	2	1000	180
3	2	1000	180
4	2	1000	180
5	2	1000	180
6	2	1000	180
7	2	1000	180
8	2	1000	180
9	2	1000	180
0	3	3000	360
1	3	3000	360
2	3	3000	360
3	3	3000	360
4	3	3000	360
5	3	3000	360
6	3	3000	360
7	3	3000	360
8	3	3000	360
9	3	3000	360
0	4	7000	600
1	4	7000	600
2	4	7000	600
3	4	7000	600
4	4	7000	600
5	4	7000	600
6	4	7000	600
7	4	7000	600
8	4	7000	600
9	4	7000	600
0	5	12000	900
1	5	12000	900
2	5	12000	900
3	5	12000	900
4	5	12000	900
5	5	12000	900
6	5	12000	900
7	5	12000	900
8	5	12000	900
9	5	12000	900
\.


--
-- TOC entry 3117 (class 0 OID 16869)
-- Dependencies: 206
-- Data for Name: equipment; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

COPY public.equipment (id, name, description, level, price, warrior, mage, thief, healer, type, buying_time) FROM stdin;
1	Старый меч	Просто старый и немного ржавый меч	1	100	t	f	f	f	0	120
2	Кривой посох	Простая палка, найдена валяющейся не так далеко от источника силы	1	100	f	t	f	t	0	120
3	Плотная рубаха	Мало что представляет в плане защиты	1	70	t	t	t	t	1	120
4	Бронзовый меч	Меч из бронзы	2	150	t	f	f	f	0	120
5	Старый кинжал	Похоже этот кинжал провалялся на задворках лет сто, лезвие остротоой не блещет	1	100	f	f	t	f	0	120
6	Стальной меч	Уже можно считать оружием	3	250	t	f	f	f	0	120
7	Деревянный посох	В посохе есть магия, в зачаточном состоянии	2	150	f	t	f	t	0	120
8	Простая роба	Подходит для начинающих магов, чтобы побродить туда-сюда, сражаться в этом не стоит	2	120	f	t	f	t	1	120
9	Кожанная куртка	Защитит от острых веток и колючек, на что-то посерьезнее рассчитывать не стоит	2	120	t	f	t	f	1	120
\.


--
-- TOC entry 3133 (class 0 OID 17169)
-- Dependencies: 222
-- Data for Name: equipment_tier; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

COPY public.equipment_tier (equipment_id, tier, power, defence, vitality, initiative, upgrading_time, wizdom) FROM stdin;
1	1	6	0	0	0	120	0
2	1	6	0	0	0	120	0
3	1	0	4	0	0	120	0
4	1	8	0	0	0	120	0
5	1	6	0	0	0	120	0
6	1	11	0	0	0	120	0
7	1	8	0	0	0	120	0
8	1	0	6	0	0	120	0
9	1	0	6	0	0	120	0
1	0	5	0	0	0	0	0
2	0	5	0	0	0	0	0
3	0	0	3	0	0	0	0
4	0	7	0	0	0	0	0
5	0	5	0	0	0	0	0
6	0	10	0	0	0	0	0
7	0	7	0	0	0	0	0
8	0	0	5	0	0	0	0
9	0	0	5	0	0	0	0
1	2	7	0	0	0	240	0
2	2	7	0	0	0	240	0
3	2	0	5	0	0	240	0
4	2	9	0	0	0	240	0
5	2	7	0	0	0	240	0
6	2	12	0	0	0	240	0
7	2	9	0	0	0	240	0
8	2	0	7	0	0	240	0
9	2	0	7	0	0	240	0
1	3	8	0	0	0	500	0
2	3	8	0	0	0	500	0
3	3	0	6	0	0	500	0
4	3	10	0	0	0	500	0
5	3	8	0	0	0	500	0
6	3	13	0	0	0	500	0
7	3	10	0	0	0	500	0
8	3	0	8	0	0	500	0
9	3	0	8	0	0	500	0
\.


--
-- TOC entry 3118 (class 0 OID 16880)
-- Dependencies: 207
-- Data for Name: hero; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

COPY public.hero (id, user_id, name, power, defence, health, experience, gold, vitality, initiative, hired, appear_at, level, type, wizdom) FROM stdin;
1239	1	Каппи	6	0	120	0	0	12	2	t	2022-01-16 15:53:21.185677	1	3	0
1261	1	Остера	5	0	120	0	170	12	2	f	2022-01-18 22:02:27.15056	1	3	0
1262	1	Патока	9	0	110	0	200	11	2	f	2022-01-18 22:02:28.15056	1	2	0
1263	1	Луна	10	0	100	0	200	10	2	f	2022-01-18 22:02:29.15056	1	2	0
1264	1	Луна	6	0	140	0	200	14	2	f	2022-01-18 22:02:30.15056	1	2	0
1266	1	Остера	6	0	120	0	180	12	2	f	2022-01-18 22:02:32.15056	1	1	0
837	1	Клевер	8	0	100	92	68	10	2	t	2021-11-24 17:38:09.338954	1	3	5
1260	1	Капля	7	0	130	0	200	13	2	f	2022-01-18 22:02:26.15056	1	0	0
1265	1	Полана	6	0	100	0	160	10	2	f	2022-01-18 22:02:31.15056	1	0	0
1267	1	Сарина	10	0	130	0	230	13	2	f	2022-01-18 22:02:33.15056	1	0	0
1268	1	Сола	8	0	110	0	190	11	2	f	2022-01-18 22:02:34.15056	1	0	0
1269	1	Патока	10	0	100	0	200	10	2	f	2022-01-18 22:02:35.15056	1	0	0
835	1	Мира	9	0	120	63	52	12	2	t	2021-11-24 17:38:08.338954	1	1	5
604	1	Ровер	14	0	160	477	309	16	2	t	2021-08-07 10:23:51.924464	2	1	5
746	1	Серпок	7	0	140	337	529	14	2	t	2021-10-11 12:21:14.968445	1	3	5
890	1	Плея	9	0	100	0	6	10	2	t	2021-11-30 14:10:35.119111	1	0	5
603	1	Мосток	12	0	124	519	163	14	2	t	2021-08-07 10:23:48.924464	2	2	5
601	1	Карион	12	0	160	879	271	16	2	t	2021-08-07 10:23:47.924464	2	0	5
839	1	Сарина	8	0	130	29	14	13	2	t	2021-11-24 17:38:07.338954	1	0	5
861	1	Белянка	10	0	130	0	30	13	2	t	2021-11-28 12:38:36.33364	1	2	5
838	1	Луна	10	0	120	29	9	12	2	t	2021-11-24 17:38:05.338954	1	0	5
842	1	Троя	8	0	100	29	4	10	2	t	2021-11-25 18:02:01.280163	1	1	5
\.


--
-- TOC entry 3125 (class 0 OID 16993)
-- Dependencies: 214
-- Data for Name: hero_activity; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

COPY public.hero_activity (hero_id, activity_id, started_at, duration, activity_type, description) FROM stdin;
890	\N	2022-01-13 11:48:02.355293+03	\N	0	Не при делах
861	\N	2022-01-13 11:48:02.356788+03	\N	0	Не при делах
842	\N	2022-01-13 11:48:02.3582+03	\N	0	Не при делах
839	\N	2022-01-13 15:16:09.701135+03	\N	0	Не при делах
838	\N	2022-01-13 15:16:09.70284+03	\N	0	Не при делах
837	\N	2022-01-13 19:12:40.513757+03	\N	0	Не при делах
835	\N	2022-01-13 19:28:07.396214+03	\N	0	Не при делах
601	3	2022-01-13 19:50:55.195288+03	\N	1	Выполняет задание Бить и пить
603	3	2022-01-13 19:50:55.196865+03	\N	1	Выполняет задание Бить и пить
604	3	2022-01-13 19:50:55.198316+03	\N	1	Выполняет задание Бить и пить
746	3	2022-01-13 19:50:55.199755+03	\N	1	Выполняет задание Бить и пить
1239	\N	2022-01-16 16:19:59.69734+03	\N	0	Не при делах
\.


--
-- TOC entry 3116 (class 0 OID 16854)
-- Dependencies: 205
-- Data for Name: hero_equipment; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

COPY public.hero_equipment (hero_id, equipment_id, tier) FROM stdin;
839	4	2
838	9	1
842	7	2
1239	3	0
746	8	3
835	8	3
746	7	3
837	7	3
839	9	0
1239	7	1
603	9	3
603	1	3
835	7	3
838	4	1
604	8	3
601	4	3
604	7	3
837	8	3
890	4	3
601	9	3
842	8	3
861	9	3
890	9	3
1260	3	0
1261	3	0
1262	3	0
1263	3	0
1264	3	0
861	1	3
1265	3	0
1266	3	0
1267	3	0
1268	3	0
1269	3	0
1260	1	0
1261	1	0
1262	1	0
1263	1	0
1264	1	0
1265	1	0
1266	2	0
1267	1	0
1268	1	0
1269	1	0
\.


--
-- TOC entry 3126 (class 0 OID 17005)
-- Dependencies: 215
-- Data for Name: hero_item; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

COPY public.hero_item (hero_id, item_id, amount) FROM stdin;
604	1	3
601	2	3
601	3	3
601	4	3
890	1	2
604	3	3
746	1	3
601	5	3
601	6	3
835	1	3
746	3	3
837	1	3
842	1	2
861	1	3
835	3	3
837	3	3
861	2	3
603	2	3
601	1	0
603	1	2
1260	1	3
1261	1	3
1262	1	3
1263	1	3
1264	1	3
1265	1	3
1266	1	3
1267	1	3
1268	1	3
1269	1	3
1260	2	3
1261	3	3
1262	2	3
1263	2	3
1264	2	3
1265	2	3
1266	3	3
1267	2	3
1268	2	3
1269	2	3
1239	1	3
1239	3	3
\.


--
-- TOC entry 3129 (class 0 OID 17025)
-- Dependencies: 218
-- Data for Name: hero_perk; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

COPY public.hero_perk (hero_id, perk_id) FROM stdin;
601	11
601	9
601	3
603	4
603	10
603	9
835	6
835	2
604	3
837	11
838	10
838	9
839	1
839	5
839	2
746	6
842	9
842	1
890	10
1260	11
1261	11
1261	6
1262	5
1262	1
1263	3
1264	3
1264	9
1265	8
1265	5
1266	3
1267	4
1267	1
1268	9
1269	2
861	6
1239	2
1239	10
1239	1
\.


--
-- TOC entry 3134 (class 0 OID 17183)
-- Dependencies: 223
-- Data for Name: item; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

COPY public.item (id, name, description, price, type, subtype, buying_time) FROM stdin;
1	Зелье здоровья	Восстанавливает 50% HP	20	0	0	120
2	Элексир жизни	Восстанавливает 100% HP	50	0	1	120
3	Зелье маны	Восстанавливает 50% PSY	20	0	2	120
4	Элексир маны	Восстанавливает 100% PSY	50	0	3	120
5	Жезл огня	Кастует Огненный шар	100	1	4	120
6	Жезл оглушения	Кастует Оглушение	100	1	5	120
\.


--
-- TOC entry 3114 (class 0 OID 16807)
-- Dependencies: 203
-- Data for Name: level_exp; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

COPY public.level_exp (level, experience, cost, duration, definition) FROM stdin;
1	0	0	0	Простак
2	300	50	120	Новичок
3	900	100	300	Ученик
4	2700	200	500	Практик
5	6500	300	800	Понимающий
6	14000	450	1200	Знаток
7	23000	700	1700	Умудренный
8	34000	1000	2300	Мастер
9	48000	1400	3000	Великий Мастер
10	64000	1800	3800	Грандмастер
11	85000	2400	5000	Уникум
12	100000	3000	6000	Уникум
13	120000	3800	7500	Уникум
14	140000	4700	9500	Уникум
15	165000	5500	12000	Уникум
16	195000	6500	15000	Уникум
17	225000	7700	20000	Уникум
18	265000	9000	26000	Уникум
19	305000	11000	34000	Уникум
20	355000	13000	45000	Уникум
\.


--
-- TOC entry 3124 (class 0 OID 16932)
-- Dependencies: 213
-- Data for Name: monster; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

COPY public.monster (id, level, name, power, health, initiative, defence, experience, loot) FROM stdin;
2	1	snake	20	100	2	2	20	{"gold": 40}
1	1	goblin	26	120	4	3	40	{"gold": 50}
6	1	moth	16	70	3	1	15	{"gold": 30}
8	1	knight	12	90	3	5	20	{"gold": 50}
9	1	mechanic_bot	24	110	5	4	25	{"gold": 60}
\.


--
-- TOC entry 3128 (class 0 OID 17016)
-- Dependencies: 217
-- Data for Name: perk; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

COPY public.perk (id, name, description) FROM stdin;
2	Дружеское плечо	Получает бафф если отправляется на задание не в одиночку
1	Одинокий волк	Получает бафф если отправляется на задание в одиночку, иначе дебафф за каждого члена группы
3	Командный игрок	Получает бафф за каждого участника группы, чем больше героев отправляется на задание тем больше бафф
7	Давитель гоблинов	Повышенный урон против гоблинов
8	Истребитель вампиров	Повышенный урон против вампиров
9	Драконоборец	Повышенный урон против драконов
10	Гонитель нежити	Повышенный урон против нежити
11	Боится мертвяков	Пониженный урон против нежити
4	Не любит дуболомов	Получает дебафф если в группе присутствует Воин
5	Сторонится магов	Получает дебафф если в группе присутствует Маг
6	Чурается прохвостов	Получает дебафф если в группе присутствует Вор
\.


--
-- TOC entry 3113 (class 0 OID 16793)
-- Dependencies: 202
-- Data for Name: quest; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

COPY public.quest (id, level, title, description, fame, tribute, experience, travel_time) FROM stdin;
2	2	Гоблинский шабаш	Орава гоблинов совсем распоясалась, нормальным людям спать не даёт, гоните их в шею, а с меня :tribute монет.	20	350	200	5
4	5	Хочу рыбачить	Прибейте кто-нибудь этих утопцев наконец, воду мутят, рыбу жрут, рыбачить невозможно. Готов отдать :tribute монет тому кто избавится от негодных.	50	570	500	5
5	10	Голем	Я - Великий хранитель тайн и запретных знаний Астох создал невероятное создание - настоящего мышиного Голема. Так теперь эта сволочь сидит в подвале и пожирает мои харчи. Удавите его поскорее и вынесите куда-нибудь в лес. Сокровища в :tribute монет ждут смельчаков.	100	890	1000	5
3	1	Бить и пить	Дам бочку отличного пива и мешочек со :tribute монетами тому кто прогонит с моей винодельни проклятых гарпий.	10	150	100	5
1	3	Охота на ведьмочек	Три миловидные ведьмы проводят в нашем сарае свои глупые ритуалы! А как нам картоху копать без лопат? Мешочек на :tribute монет ждёт героев.	30	200	300	5
6	5	Ради науки	Мне нужны помет летучих мышей Кролоса один пуд, хвосты игуан Гарула штук 10 и ещё 12 голов кусь-рыбы с Тароса. Знание алхимии приветствуется (те кто не знает где у кусь-рыбы хвост а где башка даже не приходите). Даю :tribute монет.	50	1050	500	5
7	7	Веселые тролли	Приходите на праздник в наш город, у нас будут веселые тролли! Они будут плясать, петь песни, устраивать представления. Научат жить не зная зла и бед! Вход бесплатый!	50	0	600	5
9	8	Ходячий валежник	Тут в лесу завелись какие-то живые кусты, когда бабы за валежником ходили - одного такого чуть на дрова не порубили, он их поптом до самой деревни гнал. Шаман говорит что это дендрарианы или как-то так. Вобщем отчистите лес от наваждения, награда :tribute монет.	90	950	1020	5
8	4	Наглые гарпии	Кучка гарпий поселилась на наших полях! Чего им там нужно, это же не утесы! Пугал ставили, так они из них гнёзда устроили. Короче гоните пернатых, мы для этих целей :tribute монетами скинулись.	40	250	260	5
10	1	Крысы в подвале	В моем подвале завелись крысы! Шуршат всю ночь что не уснуть. Запасы подъедают, и ладно бы зерно, так они буженину предпочитают! Зачистите подвал от этих тварей, оплачиваю по хвостам, до :tribute монет.	15	80	220	5
11	6	Зайцы-оборотни	Здесь довечи странный зверь завёлся - днём обычный заяц, а как тьма наступит в зубастое чудище превращается! Наши охотники поймали пару таких в силки, домой принесли, а ночью им хаты разнесло. Помогите с напастью и :tribute монет ваши.	75	850	780	5
12	12	Полуночницы	Ищутся герои которые помогут с бедствием постигнувшим нашу деревню. В заброшеном доме поселились полуночницы - днем от них проблем нет, а вот ночью вылезают из дому и ходят стучаться к соседям - кто открыл тот пропал! Так вся деревня скоро вымрет, приходите мы собрали :tribute монет.	120	1540	1450	5
13	15	Жуткий замок	У нас рядом есть старый замок, и вот неавно там всякая нечисть завелась. Земля вокруг замка стала непладородной, по ночам призраки гуляют вокруг, говорят зомби видели. А ещё говорят тёмный лорд там завелся, ещё чего решит отправится мир завоёвывать а оно нам надо? Вобщем с города :tribute монет, с героев разогнать нежить!	200	2400	2500	5
14	1	Жаба-мутант	В нашей деревне за последние пол-года пять девах сгинуло, шаман говорит дух-жаба себе невест ищет, надо бы её изловить и дух вытрясти, заодно авось девах обратно вернуть получится. За жабу дадим хабар :tribute, девок бестолковых можете себе оставить. В нашей деревне за последние пол-года пять девах сгинуло, шаман говорит дух-жаба себе невест ищет, надо бы её изловить и дух вытрясти, заодно авось девах обратно вернуть получится. За жабу дадим хабар :tribute, девок бестолковых можете себе оставить.	50	350	220	5
\.


--
-- TOC entry 3122 (class 0 OID 16902)
-- Dependencies: 211
-- Data for Name: quest_checkpoint; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

COPY public.quest_checkpoint (id, quest_progress_id, type, stage, enemies, passed, treasure, linked) FROM stdin;
5421	952	battle	2	[{"id":8,"level":1,"name":"knight","power":12,"health":90,"initiative":3,"defence":5,"experience":20,"loot":{"gold":50},"actorId":0},{"id":9,"level":1,"name":"mechanic_bot","power":24,"health":110,"initiative":5,"defence":4,"experience":25,"loot":{"gold":60},"actorId":1},{"id":1,"level":1,"name":"goblin","power":26,"health":120,"initiative":4,"defence":3,"experience":40,"loot":{"gold":50},"actorId":2}]	t	0	5422
5422	952	camp	3	\N	t	0	5423,5424
5423	952	battle	4	[{"id":8,"level":1,"name":"knight","power":12,"health":90,"initiative":3,"defence":5,"experience":20,"loot":{"gold":50},"actorId":0},{"id":2,"level":1,"name":"snake","power":20,"health":100,"initiative":2,"defence":2,"experience":20,"loot":{"gold":40},"actorId":1},{"id":9,"level":1,"name":"mechanic_bot","power":24,"health":110,"initiative":5,"defence":4,"experience":25,"loot":{"gold":60},"actorId":2}]	t	0	5425
5429	952	boss	7	[{"id":6,"level":1,"name":"moth","power":16,"health":210,"initiative":3,"defence":1,"experience":15,"loot":{"gold":30},"actorId":0}]	f	0	\N
5418	952	start	0	\N	f	0	5419,5420
5427	952	camp	6	\N	f	0	5429
5428	952	camp	6	\N	f	0	5429
5420	952	battle	1	[{"id":6,"level":1,"name":"moth","power":16,"health":70,"initiative":3,"defence":1,"experience":15,"loot":{"gold":30},"actorId":0},{"id":9,"level":1,"name":"mechanic_bot","power":24,"health":110,"initiative":5,"defence":4,"experience":25,"loot":{"gold":60},"actorId":1},{"id":9,"level":1,"name":"mechanic_bot","power":24,"health":110,"initiative":5,"defence":4,"experience":25,"loot":{"gold":60},"actorId":2}]	f	0	5421
5424	952	battle	4	[{"id":8,"level":1,"name":"knight","power":12,"health":90,"initiative":3,"defence":5,"experience":20,"loot":{"gold":50},"actorId":0},{"id":2,"level":1,"name":"snake","power":20,"health":100,"initiative":2,"defence":2,"experience":20,"loot":{"gold":40},"actorId":1},{"id":9,"level":1,"name":"mechanic_bot","power":24,"health":110,"initiative":5,"defence":4,"experience":25,"loot":{"gold":60},"actorId":2},{"id":8,"level":1,"name":"knight","power":12,"health":90,"initiative":3,"defence":5,"experience":20,"loot":{"gold":50},"actorId":3},{"id":9,"level":1,"name":"mechanic_bot","power":24,"health":110,"initiative":5,"defence":4,"experience":25,"loot":{"gold":60},"actorId":4}]	f	0	5426
5425	952	battle	5	[{"id":2,"level":1,"name":"snake","power":20,"health":100,"initiative":2,"defence":2,"experience":20,"loot":{"gold":40},"actorId":0},{"id":6,"level":1,"name":"moth","power":16,"health":70,"initiative":3,"defence":1,"experience":15,"loot":{"gold":30},"actorId":1},{"id":9,"level":1,"name":"mechanic_bot","power":24,"health":110,"initiative":5,"defence":4,"experience":25,"loot":{"gold":60},"actorId":2}]	f	0	5427
5426	952	battle	5	[{"id":1,"level":1,"name":"goblin","power":26,"health":120,"initiative":4,"defence":3,"experience":40,"loot":{"gold":50},"actorId":0},{"id":6,"level":1,"name":"moth","power":16,"health":70,"initiative":3,"defence":1,"experience":15,"loot":{"gold":30},"actorId":1},{"id":6,"level":1,"name":"moth","power":16,"health":70,"initiative":3,"defence":1,"experience":15,"loot":{"gold":30},"actorId":2},{"id":8,"level":1,"name":"knight","power":12,"health":90,"initiative":3,"defence":5,"experience":20,"loot":{"gold":50},"actorId":3}]	f	0	5428
5419	952	battle	1	[{"id":2,"level":1,"name":"snake","power":20,"health":100,"initiative":2,"defence":2,"experience":20,"loot":{"gold":40},"actorId":0},{"id":1,"level":1,"name":"goblin","power":26,"health":120,"initiative":4,"defence":3,"experience":40,"loot":{"gold":50},"actorId":1},{"id":1,"level":1,"name":"goblin","power":26,"health":120,"initiative":4,"defence":3,"experience":40,"loot":{"gold":50},"actorId":2}]	t	0	5421
\.


--
-- TOC entry 3120 (class 0 OID 16891)
-- Dependencies: 209
-- Data for Name: quest_progress; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

COPY public.quest_progress (id, user_id, quest_id, embarked_time, completed) FROM stdin;
952	1	3	2022-01-13 19:51:00.174159+03	f
\.


--
-- TOC entry 3131 (class 0 OID 17032)
-- Dependencies: 220
-- Data for Name: skill; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

COPY public.skill (id, name, description, hero_type, level) FROM stdin;
1	Круговой удар	Наносит физический урон всем противникам	warrior	1
4	Огненный шар	Наносит магический урон всем противникам	mage	1
7	Удар в спину	Наносит утроенный урон противнику	thief	1
13	Слово лекаря	Восстанавливает часть здоровья себе или согрупнику	healer	1
2	Ошеломляющий удар	До своего следующего хода противник получает увеличенный урон	warrior	2
5	Заморозка	Противник пропускает несколько ходов	mage	2
8	Отравленный кинжал	Наносит урон с течением времени	thief	2
14	Мольба во спасение	Восстанавливает часть здоровья всей группе	healer	2
3	Проламывающий удар	Снижает на определенное количество времени защиту противника	warrior	3
6	Время вперед	Перерыв в действиях героев становится меньше на несколько секунд	mage	3
9	Уворот	Шанс полностью избежать урон	thief	3
15	Туманный взор	Следующий удар противника приходится по другому противнику	healer	3
\.


--
-- TOC entry 3111 (class 0 OID 16785)
-- Dependencies: 200
-- Data for Name: stats; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

COPY public.stats (user_id, gold, fame) FROM stdin;
1	25472	810
\.


--
-- TOC entry 3108 (class 0 OID 16740)
-- Dependencies: 197
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

COPY public."user" (id, login, password) FROM stdin;
1	aintech	$2a$12$lyi9qsxa/KsP9Cq0ZbrodOlebEqYg8EXF5g7Iu5aO03cw/.B.ONgS
\.


--
-- TOC entry 3136 (class 0 OID 17196)
-- Dependencies: 225
-- Data for Name: user_alchemist_assortment; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

COPY public.user_alchemist_assortment (user_id, item_id) FROM stdin;
1	1
1	2
1	3
1	4
1	5
1	6
\.


--
-- TOC entry 3132 (class 0 OID 17147)
-- Dependencies: 221
-- Data for Name: user_market_assortment; Type: TABLE DATA; Schema: public; Owner: yaremchuken
--

COPY public.user_market_assortment (user_id, equipment_id) FROM stdin;
1	1
1	2
1	3
1	4
1	5
1	6
1	7
1	8
1	9
\.


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

SELECT pg_catalog.setval('public.hero_id_seq', 1269, true);


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
-- TOC entry 2983 (class 2606 OID 17235)
-- Name: building building_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.building
    ADD CONSTRAINT building_pkey PRIMARY KEY (user_id, type);


--
-- TOC entry 2985 (class 2606 OID 17240)
-- Name: building_upgrade building_upgrade_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.building_upgrade
    ADD CONSTRAINT building_upgrade_pkey PRIMARY KEY (type, level);


--
-- TOC entry 2955 (class 2606 OID 16879)
-- Name: equipment equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_pkey PRIMARY KEY (id);


--
-- TOC entry 2977 (class 2606 OID 17177)
-- Name: equipment_tier equipment_tier_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.equipment_tier
    ADD CONSTRAINT equipment_tier_pkey PRIMARY KEY (equipment_id, tier);


--
-- TOC entry 2953 (class 2606 OID 17161)
-- Name: hero_equipment hero_equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.hero_equipment
    ADD CONSTRAINT hero_equipment_pkey PRIMARY KEY (hero_id, equipment_id);


--
-- TOC entry 2967 (class 2606 OID 17195)
-- Name: hero_item hero_item_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.hero_item
    ADD CONSTRAINT hero_item_pkey PRIMARY KEY (hero_id, item_id);


--
-- TOC entry 2951 (class 2606 OID 16811)
-- Name: level_exp hero_level_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.level_exp
    ADD CONSTRAINT hero_level_pkey PRIMARY KEY (level);


--
-- TOC entry 2965 (class 2606 OID 17000)
-- Name: hero_activity hero_occupation_pkey1; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.hero_activity
    ADD CONSTRAINT hero_occupation_pkey1 PRIMARY KEY (hero_id);


--
-- TOC entry 2971 (class 2606 OID 17029)
-- Name: hero_perk hero_perk_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.hero_perk
    ADD CONSTRAINT hero_perk_pkey PRIMARY KEY (hero_id, perk_id);


--
-- TOC entry 2957 (class 2606 OID 16888)
-- Name: hero hero_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.hero
    ADD CONSTRAINT hero_pkey PRIMARY KEY (id);


--
-- TOC entry 2979 (class 2606 OID 17190)
-- Name: item item_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_pkey PRIMARY KEY (id);


--
-- TOC entry 2963 (class 2606 OID 16940)
-- Name: monster monster_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.monster
    ADD CONSTRAINT monster_pkey PRIMARY KEY (id);


--
-- TOC entry 2969 (class 2606 OID 17024)
-- Name: perk perk_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.perk
    ADD CONSTRAINT perk_pkey PRIMARY KEY (id);


--
-- TOC entry 2961 (class 2606 OID 16910)
-- Name: quest_checkpoint quest_checkpoints_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.quest_checkpoint
    ADD CONSTRAINT quest_checkpoints_pkey PRIMARY KEY (id);


--
-- TOC entry 2949 (class 2606 OID 16801)
-- Name: quest quest_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.quest
    ADD CONSTRAINT quest_pkey PRIMARY KEY (id);


--
-- TOC entry 2959 (class 2606 OID 16897)
-- Name: quest_progress quest_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.quest_progress
    ADD CONSTRAINT quest_progress_pkey PRIMARY KEY (id);


--
-- TOC entry 2973 (class 2606 OID 17040)
-- Name: skill skill_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.skill
    ADD CONSTRAINT skill_pkey PRIMARY KEY (id);


--
-- TOC entry 2947 (class 2606 OID 16790)
-- Name: stats stats_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.stats
    ADD CONSTRAINT stats_pkey PRIMARY KEY (user_id);


--
-- TOC entry 2981 (class 2606 OID 17200)
-- Name: user_alchemist_assortment user_alchemist_assortment_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.user_alchemist_assortment
    ADD CONSTRAINT user_alchemist_assortment_pkey PRIMARY KEY (user_id, item_id);


--
-- TOC entry 2975 (class 2606 OID 17151)
-- Name: user_market_assortment user_market_assortment_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public.user_market_assortment
    ADD CONSTRAINT user_market_assortment_pkey PRIMARY KEY (user_id, equipment_id);


--
-- TOC entry 2945 (class 2606 OID 16748)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: yaremchuken
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


-- Completed on 2022-01-19 21:03:02 MSK

--
-- PostgreSQL database dump complete
--

