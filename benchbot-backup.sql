--
-- PostgreSQL database dump
--

\restrict 1CaoLAxMTMrdJhMw8pmddoROnxMcggbyTabkd79OB3XadNyf2PJpgtfinIIasT9

-- Dumped from database version 16.14 (Debian 16.14-1.pgdg13+1)
-- Dumped by pg_dump version 16.14 (Debian 16.14-1.pgdg13+1)

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

SET default_table_access_method = heap;

--
-- Name: bench_people; Type: TABLE; Schema: public; Owner: benchbot
--

CREATE TABLE public.bench_people (
    id text NOT NULL,
    aad_object_id text NOT NULL,
    name text NOT NULL,
    discipline text NOT NULL,
    bench_status text DEFAULT 'On Bench'::text NOT NULL,
    conversation_id text
);


ALTER TABLE public.bench_people OWNER TO benchbot;

--
-- Name: proposal_history; Type: TABLE; Schema: public; Owner: benchbot
--

CREATE TABLE public.proposal_history (
    id integer NOT NULL,
    proposal_id text NOT NULL,
    old_status text,
    new_status text NOT NULL,
    changed_by text,
    changed_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.proposal_history OWNER TO benchbot;

--
-- Name: proposal_history_id_seq; Type: SEQUENCE; Schema: public; Owner: benchbot
--

CREATE SEQUENCE public.proposal_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.proposal_history_id_seq OWNER TO benchbot;

--
-- Name: proposal_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: benchbot
--

ALTER SEQUENCE public.proposal_history_id_seq OWNED BY public.proposal_history.id;


--
-- Name: proposals; Type: TABLE; Schema: public; Owner: benchbot
--

CREATE TABLE public.proposals (
    id text NOT NULL,
    project text NOT NULL,
    role text NOT NULL,
    status text NOT NULL,
    expected_update text NOT NULL,
    owner text NOT NULL,
    acknowledged boolean DEFAULT false,
    aad_object_id text,
    discipline text,
    lead_aad_object_id text,
    employee_name text,
    updated_at timestamp without time zone DEFAULT now(),
    bench_person_id text
);


ALTER TABLE public.proposals OWNER TO benchbot;

--
-- Name: proposal_history id; Type: DEFAULT; Schema: public; Owner: benchbot
--

ALTER TABLE ONLY public.proposal_history ALTER COLUMN id SET DEFAULT nextval('public.proposal_history_id_seq'::regclass);


--
-- Data for Name: bench_people; Type: TABLE DATA; Schema: public; Owner: benchbot
--

COPY public.bench_people (id, aad_object_id, name, discipline, bench_status, conversation_id) FROM stdin;
person-1	00000000-0000-0000-0000-0000000000020	Alex Wilber	Java	On Bench	a23eca17-d1ad-47f7-9de6-77602f2a329b
\.


--
-- Data for Name: proposal_history; Type: TABLE DATA; Schema: public; Owner: benchbot
--

COPY public.proposal_history (id, proposal_id, old_status, new_status, changed_by, changed_at) FROM stdin;
1	1	Interview Requested	Client Reviewing	00000000-0000-0000-0000-0000000000020	2026-05-20 14:13:55.851955
2	1	Client Reviewing	Rejected	00000000-0000-0000-0000-0000000000020	2026-05-20 14:18:54.41268
\.


--
-- Data for Name: proposals; Type: TABLE DATA; Schema: public; Owner: benchbot
--

COPY public.proposals (id, project, role, status, expected_update, owner, acknowledged, aad_object_id, discipline, lead_aad_object_id, employee_name, updated_at, bench_person_id) FROM stdin;
2	Atlas	Tech Lead	Rejected	Tomorrow	Maria Georgieva	t	another-user	Java	00000000-0000-0000-0000-0000000000020	Alex Wilber	2026-05-20 13:55:32.822578	person-1
1	Phoenix	Senior Java Developer	Rejected	Friday	Ivan Petrov	t	00000000-0000-0000-0000-0000000000020	Java	00000000-0000-0000-0000-0000000000020	Alex Wilber	2026-05-20 14:18:54.41037	person-1
33ff6467-68dd-4556-9b1a-f8d276bebfce	Orion	Senior Backend Developer	Proposed	Next Week	Ivan Petrov	f	00000000-0000-0000-0000-0000000000020	\N	00000000-0000-0000-0000-0000000000020	\N	2026-05-20 14:32:01.921184	person-1
9024b3fc-5faa-4330-8316-17069332c917	Orion	Senior Backend Developer	Proposed	Next Week	Ivan Petrov	f	00000000-0000-0000-0000-0000000000020	\N	00000000-0000-0000-0000-0000000000020	\N	2026-05-20 14:44:13.80279	person-1
6d0fbe64-93c0-47ce-a11d-16d7f8c59c83	Orion	Senior Backend Developer	Proposed	Next Week	Ivan Petrov	f	00000000-0000-0000-0000-0000000000020	\N	00000000-0000-0000-0000-0000000000020	\N	2026-05-20 14:58:29.788006	person-1
\.


--
-- Name: proposal_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: benchbot
--

SELECT pg_catalog.setval('public.proposal_history_id_seq', 2, true);


--
-- Name: bench_people bench_people_pkey; Type: CONSTRAINT; Schema: public; Owner: benchbot
--

ALTER TABLE ONLY public.bench_people
    ADD CONSTRAINT bench_people_pkey PRIMARY KEY (id);


--
-- Name: proposal_history proposal_history_pkey; Type: CONSTRAINT; Schema: public; Owner: benchbot
--

ALTER TABLE ONLY public.proposal_history
    ADD CONSTRAINT proposal_history_pkey PRIMARY KEY (id);


--
-- Name: proposals proposals_pkey; Type: CONSTRAINT; Schema: public; Owner: benchbot
--

ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict 1CaoLAxMTMrdJhMw8pmddoROnxMcggbyTabkd79OB3XadNyf2PJpgtfinIIasT9

