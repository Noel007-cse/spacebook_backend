--
-- PostgreSQL database dump
--

\restrict DXV4CxXIPabEQpaZRdFTSxo0WYTecRu29hd5r9yYN9lctLCL7tY0m43bwkvIU1E

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    user_id integer,
    space_id integer,
    booking_date date NOT NULL,
    time_slot character varying(30),
    status character varying(20) DEFAULT 'FUNCTIONAL'::character varying,
    is_confirmed boolean DEFAULT false,
    total_price integer,
    rejection_reason text,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favorites (
    id integer NOT NULL,
    user_id integer,
    space_id integer,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.favorites_id_seq OWNED BY public.favorites.id;


--
-- Name: ratings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ratings (
    id integer NOT NULL,
    user_id integer,
    space_id integer,
    score integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT ratings_score_check CHECK (((score >= 1) AND (score <= 5)))
);


--
-- Name: ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ratings_id_seq OWNED BY public.ratings.id;


--
-- Name: recommendations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recommendations (
    id integer NOT NULL,
    user_id integer,
    space_id integer,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: recommendations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.recommendations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recommendations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recommendations_id_seq OWNED BY public.recommendations.id;


--
-- Name: spaces; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.spaces (
    id integer NOT NULL,
    owner_id integer,
    title character varying(200) NOT NULL,
    category character varying(50),
    area character varying(200),
    description text,
    distance character varying(20),
    distance_km double precision,
    price_per_hr integer,
    rating double precision DEFAULT 0,
    no_of_rating double precision DEFAULT 0,
    image_url text,
    has_seats boolean DEFAULT false,
    is_active boolean DEFAULT true,
    approval_status character varying(20) DEFAULT 'APPROVED'::character varying,
    admin_rejection_reason text,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: spaces_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.spaces_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: spaces_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.spaces_id_seq OWNED BY public.spaces.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    account_type character varying(20) DEFAULT 'buyer'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: favorites id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites ALTER COLUMN id SET DEFAULT nextval('public.favorites_id_seq'::regclass);


--
-- Name: ratings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings ALTER COLUMN id SET DEFAULT nextval('public.ratings_id_seq'::regclass);


--
-- Name: recommendations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recommendations ALTER COLUMN id SET DEFAULT nextval('public.recommendations_id_seq'::regclass);


--
-- Name: spaces id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.spaces ALTER COLUMN id SET DEFAULT nextval('public.spaces_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.bookings (id, user_id, space_id, booking_date, time_slot, status, is_confirmed, total_price, rejection_reason, created_at) FROM stdin;
1	3	1	2026-05-19	09:00 AM	FUNCTIONAL	f	1200	\N	2026-05-19 11:29:15.202893
2	3	6	2026-05-19	09:00 AM	FUNCTIONAL	f	80	\N	2026-05-19 11:42:35.919206
3	3	1	2026-05-19	10:00 AM	FUNCTIONAL	f	1200	\N	2026-05-19 11:46:05.633196
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.favorites (id, user_id, space_id, created_at) FROM stdin;
\.


--
-- Data for Name: ratings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ratings (id, user_id, space_id, score, created_at) FROM stdin;
1	1	1	5	2026-05-19 11:28:12.304341
2	1	2	5	2026-05-19 11:28:12.307966
3	1	3	5	2026-05-19 11:28:12.309662
4	1	4	5	2026-05-19 11:28:12.311345
5	1	5	5	2026-05-19 11:28:12.312542
6	1	6	5	2026-05-19 11:28:12.313453
7	1	7	5	2026-05-19 11:28:12.314212
8	1	8	5	2026-05-19 11:28:12.314944
9	1	9	5	2026-05-19 11:28:12.31565
10	1	10	5	2026-05-19 11:28:12.316322
11	1	11	5	2026-05-19 11:28:12.316975
12	1	12	5	2026-05-19 11:28:12.317632
13	1	13	5	2026-05-19 11:28:12.318291
14	1	14	5	2026-05-19 11:28:12.319646
15	1	15	5	2026-05-19 11:28:12.324404
16	1	16	5	2026-05-19 11:28:12.326356
\.


--
-- Data for Name: recommendations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recommendations (id, user_id, space_id, created_at) FROM stdin;
1	1	1	2026-05-19 11:28:12.327201
2	1	6	2026-05-19 11:28:12.329128
3	1	10	2026-05-19 11:28:12.329475
4	3	1	2026-05-19 11:29:08.880138
9	3	6	2026-05-19 11:42:28.672089
\.


--
-- Data for Name: spaces; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.spaces (id, owner_id, title, category, area, description, distance, distance_km, price_per_hr, rating, no_of_rating, image_url, has_seats, is_active, approval_status, admin_rejection_reason, created_at) FROM stdin;
1	1	Olympic Green Arena	Sports Turfs	Sports District, Playville	Modern synthetic turfs designed for football and cricket with floodlights and secure fencing.	0.5	0.5	1200	5	1	https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600	f	t	APPROVED	\N	2026-05-19 11:28:12.300964
2	1	Stellar Multi-Sports Park	Sports Turfs	Sports District, Playville	Multi-purpose sports facility with multiple courts and fields.	1.2	1.2	950	5	1	https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600	f	t	APPROVED	\N	2026-05-19 11:28:12.306852
3	1	Champion's Court Indoor	Sports Turfs	Playville Suburbs	Indoor court with premium flooring and climate control.	2.4	2.4	1500	5	1	https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600	f	t	APPROVED	\N	2026-05-19 11:28:12.308567
4	1	Green Kick Football Arena	Sports Turfs	Playville Suburbs	Well-maintained football arena with proper lighting and secure fencing.	3.1	3.1	800	5	1	https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=600	f	t	APPROVED	\N	2026-05-19 11:28:12.3102
5	1	Elite Sports Ground	Sports Turfs	Playville Suburbs	Premium sports ground with excellent facilities and maintenance.	4.0	4	1100	5	1	https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600	f	t	APPROVED	\N	2026-05-19 11:28:12.311905
6	1	City Central Library	Libraries	Central Business District, Education City	Spacious and quiet library with modern amenities and study rooms.	0.3	0.3	80	5	1	https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600	t	t	APPROVED	\N	2026-05-19 11:28:12.312888
7	1	Knowledge Oasis Study Hall	Libraries	Education City	Modern study hall with comfortable seating and high-speed internet.	0.9	0.9	120	5	1	https://images.unsplash.com/photo-1568667256549-094345857637?w=600	t	t	APPROVED	\N	2026-05-19 11:28:12.31377
8	1	The Reading Room	Libraries	Education City	Cozy and quiet reading room with a vast collection of books and comfortable seating.	1.5	1.5	60	5	1	https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&fit=crop	t	t	APPROVED	\N	2026-05-19 11:28:12.314493
9	1	Focus Study Hub	Study Halls	Education City	Quiet study hub with high-speed Wi-Fi and ergonomic seating.	0.8	0.8	150	5	1	https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600	t	t	APPROVED	\N	2026-05-19 11:28:12.315212
10	1	Skyline Study Lounge	Study Halls	Education City	Modern study lounge with comfortable seating, high-speed internet, and a relaxing atmosphere.	1.2	1.2	100	5	1	https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=600&fit=crop	t	t	APPROVED	\N	2026-05-19 11:28:12.31591
11	1	Quiet Corner Study Space	Study Halls	Education City	Quiet and comfortable study space with minimal distractions.	2.0	2	80	5	1	https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&fit=crop	t	t	APPROVED	\N	2026-05-19 11:28:12.316568
12	1	The Grand Ballroom	Event Halls	Historic District, Entertainment City	Elegant ballroom with high ceilings and premium sound systems.	5.1	5.1	8000	5	1	https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600	f	t	APPROVED	\N	2026-05-19 11:28:12.317243
13	1	Prestige Event Centre	Event Halls	Entertainment City	Modern event centre with premium facilities and flexible layouts.	3.4	3.4	5000	5	1	https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&fit=crop	f	t	APPROVED	\N	2026-05-19 11:28:12.317877
14	1	Royal Banquet Hall	Event Halls	Entertainment City	Elegant banquet hall with premium facilities and a grand atmosphere.	6.2	6.2	10000	5	1	https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&fit=crop	f	t	APPROVED	\N	2026-05-19 11:28:12.318537
15	1	Premier Arena Soccer Turf	Sports Turfs	Downtown District, Playville	Modern synthetic turfs designed for football and cricket, featuring floodlights, secure fencing, and well-maintained playing surfaces.	2.4	2.4	1200	5	1	https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600	f	t	APPROVED	\N	2026-05-19 11:28:12.322421
16	1	Focus Hub Study Library	Libraries	Central Business District, Education City	Spacious and quiet study halls with modern amenities, including high-speed internet, comfortable seating, and private study rooms.	0.8	0.8	150	5	1	https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600	t	t	APPROVED	\N	2026-05-19 11:28:12.325713
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, password, account_type, created_at) FROM stdin;
1	Default User	user@spacebook.com	password123	buyer	2026-05-19 11:28:12.233281
2	SpaceBook Admin	admin@spacebook.com	$2b$10$V0tS2qIOvtwygOlvZYHnju1Iu0nkesbP6RrqUnUM1P3eawhJV8Uk2	admin	2026-05-19 11:28:12.29855
3	Jeff J MAthew	jeffjimmymathew@gmail.com	$2b$10$o5ci0tRM1Egu6BwbNRLKDe61.mifLaHlzYFI2/tt10vzEqaUeDcNy	seller	2026-05-19 11:29:06.917781
\.


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bookings_id_seq', 3, true);


--
-- Name: favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.favorites_id_seq', 1, false);


--
-- Name: ratings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ratings_id_seq', 51, true);


--
-- Name: recommendations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.recommendations_id_seq', 13, true);


--
-- Name: spaces_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.spaces_id_seq', 51, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_user_id_space_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_space_id_key UNIQUE (user_id, space_id);


--
-- Name: ratings ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (id);


--
-- Name: ratings ratings_user_id_space_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_id_space_id_key UNIQUE (user_id, space_id);


--
-- Name: recommendations recommendations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_pkey PRIMARY KEY (id);


--
-- Name: recommendations recommendations_user_id_space_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_user_id_space_id_key UNIQUE (user_id, space_id);


--
-- Name: spaces spaces_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.spaces
    ADD CONSTRAINT spaces_pkey PRIMARY KEY (id);


--
-- Name: spaces spaces_title_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.spaces
    ADD CONSTRAINT spaces_title_key UNIQUE (title);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_space_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_space_id_fkey FOREIGN KEY (space_id) REFERENCES public.spaces(id);


--
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: favorites favorites_space_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_space_id_fkey FOREIGN KEY (space_id) REFERENCES public.spaces(id) ON DELETE CASCADE;


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: ratings ratings_space_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_space_id_fkey FOREIGN KEY (space_id) REFERENCES public.spaces(id) ON DELETE CASCADE;


--
-- Name: ratings ratings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: recommendations recommendations_space_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_space_id_fkey FOREIGN KEY (space_id) REFERENCES public.spaces(id) ON DELETE CASCADE;


--
-- Name: recommendations recommendations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: spaces spaces_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.spaces
    ADD CONSTRAINT spaces_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict DXV4CxXIPabEQpaZRdFTSxo0WYTecRu29hd5r9yYN9lctLCL7tY0m43bwkvIU1E

