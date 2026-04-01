--
-- PostgreSQL database dump
--

\restrict rTam5pd7Qw26q5suD2GBzBJugw3c1ekn4Od1xLHXCGSOjOWi9r0G17k29zAck4M

-- Dumped from database version 15.17
-- Dumped by pg_dump version 18.1

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

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: contacts_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.contacts_status_enum AS ENUM (
    'new',
    'read',
    'replied'
);


ALTER TYPE public.contacts_status_enum OWNER TO postgres;

--
-- Name: products_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.products_status_enum AS ENUM (
    'draft',
    'published',
    'out_of_stock',
    'archived'
);


ALTER TYPE public.products_status_enum OWNER TO postgres;

--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role_enum AS ENUM (
    'user',
    'admin'
);


ALTER TYPE public.user_role_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "cartId" uuid NOT NULL,
    "productId" uuid NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.carts OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    subcategories jsonb DEFAULT '[]'::jsonb NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contacts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255),
    email character varying(255) NOT NULL,
    reason character varying(100) NOT NULL,
    message text NOT NULL,
    status public.contacts_status_enum DEFAULT 'new'::public.contacts_status_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.contacts OWNER TO postgres;

--
-- Name: order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."order" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" character varying,
    "firstName" character varying NOT NULL,
    "lastName" character varying NOT NULL,
    email character varying NOT NULL,
    phone character varying NOT NULL,
    address character varying NOT NULL,
    city character varying NOT NULL,
    zip character varying,
    "payMethod" character varying DEFAULT 'cash'::character varying NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    shipping numeric(10,2) DEFAULT '8'::numeric NOT NULL,
    total numeric(10,2) NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    items json NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."order" OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    "costPrice" numeric(10,2),
    stock integer DEFAULT 0 NOT NULL,
    sku character varying(100),
    brand character varying(100),
    weight numeric(8,2),
    dimensions jsonb DEFAULT '{}'::jsonb NOT NULL,
    images jsonb DEFAULT '[]'::jsonb NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    status public.products_status_enum DEFAULT 'draft'::public.products_status_enum NOT NULL,
    "viewsCount" integer DEFAULT 0 NOT NULL,
    "categoryId" uuid,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    subcategory character varying(100),
    sizes text
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "firstName" character varying,
    "lastName" character varying,
    name character varying,
    phone character varying,
    role public.user_role_enum DEFAULT 'user'::public.user_role_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (id, "cartId", "productId", quantity, "unitPrice", "createdAt", "updatedAt") FROM stdin;
79d3c83b-d23c-4b7f-8e83-9e4d2ba51f5d	2150e594-8636-452f-a8e7-05b3a272a252	804aa65c-a443-4acf-b630-afd4982f58da	1	95.00	2026-03-16 09:30:47.334146	2026-03-16 09:30:47.334146
79d55be7-ddd3-4630-b62f-92edc853420f	2150e594-8636-452f-a8e7-05b3a272a252	3620c210-ff84-456b-8898-f786b1cde451	1	95.00	2026-03-16 09:30:48.980956	2026-03-16 09:30:48.980956
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts (id, "userId", "createdAt", "updatedAt") FROM stdin;
2150e594-8636-452f-a8e7-05b3a272a252	230c16a5-7864-42fb-8b0f-482540300da8	2026-03-16 09:25:16.611729	2026-03-16 09:25:16.611729
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, slug, subcategories) FROM stdin;
b4daf8d8-f675-4bc3-bd36-ef4076b11fe8	Clothing	clothing	[]
ee1f19d4-99cb-4135-becf-437845c1410b	Scarfs	scarfs	[]
4b4f6e9e-d469-461e-a0df-c62d561d0e2c	Accessories	accessories	[]
\.


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contacts (id, name, email, reason, message, status, "createdAt") FROM stdin;
\.


--
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."order" (id, "userId", "firstName", "lastName", email, phone, address, city, zip, "payMethod", subtotal, shipping, total, status, items, "createdAt") FROM stdin;
a3296f97-fe77-4b84-a1ec-c96a38177834	\N	Yassmine	Ben achour	yassmine.benachour@jass.com	50499970	tunis	Tunis		cash	70.00	8.00	78.00	pending	[{"id":"aa85d75b-6027-4c40-8344-b967332626da","name":"Collier Fleur","price":25,"image":"/images/accessoires/collierfleur.jpeg","qty":1},{"id":"a69c0fd9-2733-4e18-949f-46b9f98d7eb7","name":"Chemise Rayée","price":45,"image":"/images/clothing/chemiserayé.png","qty":1}]	2026-03-16 09:27:02.498908
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, description, price, "costPrice", stock, sku, brand, weight, dimensions, images, metadata, "isActive", status, "viewsCount", "categoryId", "createdAt", "updatedAt", subcategory, sizes) FROM stdin;
d03eba7d-472d-4430-8cc1-d43de2816d06	Écharpe Bleu Marine	Écharpe Bleu marine en Melloton Gratté.	40.00	\N	15	\N	\N	\N	{}	["/images/scarfs/bleumarine.jpeg", "/images/scarfs/bleumarine1.jpeg", "/images/scarfs/bleumarine2.jpeg"]	{}	t	published	0	ee1f19d4-99cb-4135-becf-437845c1410b	2026-03-16 08:50:09.025095	2026-03-16 09:42:48.39302	\N	\N
6eee573f-8bb5-4e17-89ce-f79f2824e847	Écharpe Vert Kiwi	Écharpe en cachemire Vert Kiwi.	40.00	\N	15	\N	\N	\N	{}	["/images/scarfs/green.jpeg", "/images/scarfs/green1.jpeg", "/images/scarfs/green2.jpeg", "/images/scarfs/green3.jpeg"]	{}	t	published	0	ee1f19d4-99cb-4135-becf-437845c1410b	2026-03-16 08:50:09.034526	2026-03-16 09:42:48.405562	\N	\N
81fabaf9-44d0-418b-91c0-6dab610c828a	Écharpe Violette	Écharpe en cachemire violette.	40.00	\N	15	\N	\N	\N	{}	["/images/scarfs/violet.jpeg", "/images/scarfs/violet1.jpeg", "/images/scarfs/violet2.jpeg"]	{}	t	published	0	ee1f19d4-99cb-4135-becf-437845c1410b	2026-03-16 08:50:09.041571	2026-03-16 09:42:48.414575	\N	\N
5ad132f1-e543-4390-a55d-abf1ec168e78	Écharpe Bordeaux	Écharpe bordeaux en laine fine.	40.00	\N	10	\N	\N	\N	{}	["/images/scarfs/burgundy.jpeg", "/images/scarfs/burgundy.jpeg", "/images/scarfs/burgundy.jpeg"]	{}	t	published	0	ee1f19d4-99cb-4135-becf-437845c1410b	2026-03-16 08:50:09.049109	2026-03-16 09:42:48.425452	\N	\N
36e3bdd2-0221-427f-a9fb-f7cbac23e9ac	Écharpe Zébra	Écharpe motif zébré.	40.00	\N	8	\N	\N	\N	{}	["/images/scarfs/zebra.jpeg", "/images/scarfs/zebra1.jpeg", "/images/scarfs/zebra2.jpeg"]	{}	t	published	0	ee1f19d4-99cb-4135-becf-437845c1410b	2026-03-16 08:50:09.057488	2026-03-16 09:42:48.436605	\N	\N
88f622bf-b953-4549-86eb-e4fa78a7f2a8	Écharpe Tigrée	Écharpe tigré en Bouclette.	40.00	\N	6	\N	\N	\N	{}	["/images/scarfs/tigre.jpeg", "/images/scarfs/tigre1.jpeg", "/images/scarfs/tigre.jpeg"]	{}	t	published	0	ee1f19d4-99cb-4135-becf-437845c1410b	2026-03-16 08:50:09.065617	2026-03-16 09:42:48.445826	\N	\N
2df2f723-84d2-4cf3-8243-8838f8a09c3d	Écharpe Rouge	Écharpe rouge vif.	40.00	\N	20	\N	\N	\N	{}	["/images/scarfs/red.jpeg", "/images/scarfs/rouge1.jpeg", "/images/scarfs/red2.jpeg", "/images/scarfs/red3.jpeg"]	{}	t	published	0	ee1f19d4-99cb-4135-becf-437845c1410b	2026-03-16 08:50:09.079629	2026-03-16 09:42:48.456732	\N	\N
4d48afa6-6686-4cc2-9cf9-d54373c44318	Écharpe Noire	Écharpe noire élégante en Cachemire.	40.00	\N	16	\N	\N	\N	{}	["/images/scarfs/noir.jpeg", "/images/scarfs/black1.jpeg", "/images/scarfs/black.jpeg"]	{}	t	published	0	ee1f19d4-99cb-4135-becf-437845c1410b	2026-03-16 08:50:09.088202	2026-03-16 09:42:48.465533	\N	\N
2f43c317-d4e9-4b15-8ce3-651e80cf7276	Écharpe Blanche	Écharpe blanche légère.	40.00	\N	12	\N	\N	\N	{}	["/images/scarfs/white.jpeg", "/images/scarfs/white1.jpeg", "/images/scarfs/white2.jpeg"]	{}	t	published	0	ee1f19d4-99cb-4135-becf-437845c1410b	2026-03-16 08:50:09.094253	2026-03-16 09:42:48.47555	\N	\N
2e218dee-2bf7-4576-97fa-24602ca3d93d	Écharpe Marron Bouclette	Écharpe Marron en Bouclette.	40.00	\N	9	\N	\N	\N	{}	["/images/scarfs/brown.jpeg", "/images/scarfs/marrose.jpeg", "/images/scarfs/brown1.jpeg"]	{}	t	published	0	ee1f19d4-99cb-4135-becf-437845c1410b	2026-03-16 08:50:09.10127	2026-03-16 09:42:48.483873	\N	\N
55b5d872-b0e3-4024-93a6-cdbbe3bc0f3b	Écharpe Gris & Blanc	Écharpe Gris & Blanc en Bouclette.	40.00	\N	9	\N	\N	\N	{}	["/images/scarfs/grey.jpeg", "/images/scarfs/grey1.jpeg", "/images/scarfs/grey2.jpeg"]	{}	t	published	0	ee1f19d4-99cb-4135-becf-437845c1410b	2026-03-16 08:50:09.108221	2026-03-16 09:42:48.493485	\N	\N
cb4fe538-5c22-449e-b2c1-dd24d97927a7	Écharpe Bleue	Écharpe bleue en Melloton Gratté.	40.00	\N	14	\N	\N	\N	{}	["/images/scarfs/bleu.jpeg", "/images/scarfs/bley.jpeg", "/images/scarfs/bleu.jpeg"]	{}	t	published	0	ee1f19d4-99cb-4135-becf-437845c1410b	2026-03-16 08:50:09.121062	2026-03-16 09:42:48.511071	\N	\N
0d230459-fa92-44dd-a082-ba2911a292d6	Écharpe Noir & Blanc	Écharpe motif vache originale.	40.00	\N	7	\N	\N	\N	{}	["/images/scarfs/cow.jpeg", "/images/scarfs/cow1.jpeg", "/images/scarfs/cow.jpeg"]	{}	t	published	0	ee1f19d4-99cb-4135-becf-437845c1410b	2026-03-16 08:50:09.127359	2026-03-16 09:42:48.518968	\N	\N
cf9756ea-1ad1-43bb-9f35-16a2144e3571	Écharpe Jaune	Écharpe jaune ensoleillée.	40.00	\N	11	\N	\N	\N	{}	["/images/scarfs/jaune2.jpeg", "/images/scarfs/jaune1.jpeg", "/images/scarfs/jaune.jpeg"]	{}	t	published	0	ee1f19d4-99cb-4135-becf-437845c1410b	2026-03-16 08:50:09.135475	2026-03-16 09:42:48.525764	\N	\N
6efb1172-6e7b-456c-b2ba-76e5506be291	Accessoire Cerise	Bijou cerise artisanal.	15.00	\N	25	\N	\N	\N	{}	["/images/accessoires/cerise.jpeg", "/images/accessoires/cerise1.jpeg", "/images/accessoires/cerise.jpeg"]	{}	t	published	0	4b4f6e9e-d469-461e-a0df-c62d561d0e2c	2026-03-16 08:50:09.140812	2026-03-16 09:42:48.533684	boucles-doreilles	\N
9dfe8a59-0715-401a-9ca6-408311edfa6f	Bracelet Élégant	Bracelet acier inoxydable.	25.00	\N	30	\N	\N	\N	{}	["/images/accessoires/braclet.jpeg", "/images/accessoires/braclet.jpeg", "/images/accessoires/braclet.jpeg"]	{}	t	published	0	4b4f6e9e-d469-461e-a0df-c62d561d0e2c	2026-03-16 08:50:09.145098	2026-03-16 09:42:48.542243	bracelets	\N
4db3a990-dd40-4d13-a87d-67f208f1e1cc	Collier Tunisie	Collier fin et élégant.	20.00	\N	20	\N	\N	\N	{}	["/images/accessoires/collier1.jpeg", "/images/accessoires/collier.jpeg", "/images/accessoires/felfel.jpeg"]	{}	t	published	0	4b4f6e9e-d469-461e-a0df-c62d561d0e2c	2026-03-16 08:50:09.155411	2026-03-16 09:42:48.559342	colliers	\N
1f2327cc-9c62-48e7-900e-8ab13f80d085	Écharpe Bleu Ciel	Écharpe en cachemire bleu ciel.	40.00	\N	15	\N	\N	\N	{}	["/images/scarfs/bleu ciel.jpeg", "/images/scarfs/bleuciel2.jpeg", "/images/scarfs/bleuciel3.jpeg"]	{}	t	published	0	ee1f19d4-99cb-4135-becf-437845c1410b	2026-03-16 08:50:09.015071	2026-03-16 09:42:48.37627	\N	\N
fa3cf596-61e1-42ff-90a6-d66feb6c1b46	Boucles Coeur	Boucles d'oreilles en forme de coeur.	20.00	\N	35	\N	\N	\N	{}	["/images/accessoires/coeur.jpeg", "/images/accessoires/coeur1.jpeg", "/images/accessoires/coeur2.jpeg"]	{}	t	published	0	4b4f6e9e-d469-461e-a0df-c62d561d0e2c	2026-03-16 08:50:09.162231	2026-03-16 09:42:48.567998	boucles-doreilles	\N
18961fbc-b959-4716-838b-33bfa004d7c4	Coquettes	Accessoires coquettes assortis.	20.00	\N	35	\N	\N	\N	{}	["/images/accessoires/coquettes.jpeg", "/images/accessoires/coquettes.jpeg", "/images/accessoires/coquettes.jpeg"]	{}	t	published	0	4b4f6e9e-d469-461e-a0df-c62d561d0e2c	2026-03-16 08:50:09.17166	2026-03-16 09:42:48.575788	boucles-doreilles	\N
ef509ea8-414b-44c5-84d7-e02f41e3f648	Papillon Décoratif	Accessoire papillon Dorée en acier inoxydable.	20.00	\N	22	\N	\N	\N	{}	["/images/accessoires/papillon1.jpeg", "/images/accessoires/papillon2.jpeg", "/images/accessoires/papillon3.jpeg"]	{}	t	published	0	4b4f6e9e-d469-461e-a0df-c62d561d0e2c	2026-03-16 08:50:09.178873	2026-03-16 09:42:48.583269	boucles-doreilles	\N
beadcfed-8063-42ef-9746-1dd9620b0326	Bracelet Coeur	Bracelet Coeur chic en acier inoxydable.	20.00	\N	22	\N	\N	\N	{}	["/images/accessoires/bracletcoeur.jpeg", "/images/accessoires/bracletcoeur.jpeg", "/images/accessoires/bracletcoeur.jpeg"]	{}	t	published	0	4b4f6e9e-d469-461e-a0df-c62d561d0e2c	2026-03-16 08:50:09.186733	2026-03-16 09:42:48.591261	bracelets	\N
6d17dcfd-245d-486e-8558-0517de2fdbc1	Boucles Multicolores	Boucles multicolores dorée en acier inoxydable.	20.00	\N	22	\N	\N	\N	{}	["/images/accessoires/bouclecouleurs.jpeg", "/images/accessoires/bouclecouleurs1.jpeg", "/images/accessoires/bouclecouleurs.jpeg"]	{}	t	published	0	4b4f6e9e-d469-461e-a0df-c62d561d0e2c	2026-03-16 08:50:09.191817	2026-03-16 09:42:48.600158	boucles-doreilles	\N
e9143745-3344-4d09-ab02-af7beeb38d45	Boucles Fleurs	Boucles Blanc et Noir en acier inoxydable.	20.00	\N	22	\N	\N	\N	{}	["/images/accessoires/bouclefleur.jpeg", "/images/accessoires/bouclefleur.jpeg"]	{}	t	published	0	4b4f6e9e-d469-461e-a0df-c62d561d0e2c	2026-03-16 08:50:09.196016	2026-03-16 09:42:48.609567	boucles-doreilles	\N
b4d81f67-d7ee-4b4f-bb2c-a6e5e140d03f	Des Bagues dorée	Bagues en acier inoxydable.	10.00	\N	22	\N	\N	\N	{}	["/images/accessoires/bagues.jpeg"]	{}	t	published	0	4b4f6e9e-d469-461e-a0df-c62d561d0e2c	2026-03-16 08:50:09.201862	2026-03-16 09:42:48.617872	bagues	\N
1d608e45-47da-41d3-b9c0-dea153116d50	Deux Bagues dorée et argentée	Deux Bagues coeur en acier inoxydable.	10.00	\N	22	\N	\N	\N	{}	["/images/accessoires/baguecoeur.jpeg"]	{}	t	published	0	4b4f6e9e-d469-461e-a0df-c62d561d0e2c	2026-03-16 08:50:09.205887	2026-03-16 09:42:48.625461	bagues	\N
725be0b7-3425-4f43-8a95-6f3a6f95be6b	Trench Coat Noir long	Trench coat Noir élégant.	120.00	\N	22	\N	\N	\N	{}	["/images/clothing/blanc1.jpeg", "/images/clothing/blanc.jpeg", "/images/clothing/blanc1.jpeg"]	{}	t	published	0	b4daf8d8-f675-4bc3-bd36-ef4076b11fe8	2026-03-16 08:50:09.21041	2026-03-16 09:42:48.634251	coats	\N
8396a243-1a5e-4873-9e3c-29984bd7e60c	Blazer Beige	Blazer beige raffiné.	100.00	\N	22	\N	\N	\N	{}	["/images/clothing/blazerbeige.png", "/images/clothing/blazerbeige1.png"]	{}	t	published	0	b4daf8d8-f675-4bc3-bd36-ef4076b11fe8	2026-03-16 08:50:09.227188	2026-03-16 09:42:48.660653	vestes	\N
d8848d11-b8a5-4ccc-bf60-bc767410cd56	Burgundy Blazer	Lapel collar blazer. Double-breasted front fastening. Side flap pockets. Interior lining. Loose fit.	100.00	\N	22	\N	\N	\N	{}	["/images/clothing/burgundy.png", "/images/clothing/burgundy1.png"]	{}	t	published	0	b4daf8d8-f675-4bc3-bd36-ef4076b11fe8	2026-03-16 08:50:09.23308	2026-03-16 09:42:48.667956	vestes	\N
1ea9b502-5fe3-47fe-af00-c6652dd3bd24	 Chemise Jaune ample décontracté à manches évasées	Chemise jaune ample décontracté à manches évasées et nœud devant pour femmes, couleur unie.	45.00	\N	22	\N	\N	\N	{}	["/images/clothing/chemisejaune.png", "/images/clothing/chemisejaune1.png", "/images/clothing/chemisejaune2.png"]	{}	t	published	0	b4daf8d8-f675-4bc3-bd36-ef4076b11fe8	2026-03-16 08:50:09.263998	2026-03-16 09:42:48.703312	chemises	\N
b0df982e-ebfa-4bee-9434-31196ba3b59d	 Chemise Rose Basic	Chemise décontractée mode polyvalente pour femmes, style minimaliste/casual chic.	45.00	\N	22	\N	\N	\N	{}	["/images/clothing/chemiserose.png", "/images/clothing/chemiserose1.png", "/images/clothing/chemiserose2.png"]	{}	t	published	0	b4daf8d8-f675-4bc3-bd36-ef4076b11fe8	2026-03-16 08:50:09.270342	2026-03-16 09:42:48.710895	chemises	\N
7cb3a741-3c69-4afa-894a-ae20dc99e17c	 Radiana Pantalon large oversize	Radiana Pantalon large oversize mode minimaliste café foncé pour femmes.	65.00	\N	22	\N	\N	\N	{}	["/images/clothing/radiana.png", "/images/clothing/radiana1.png", "/images/clothing/radiana2.png"]	{}	t	published	0	b4daf8d8-f675-4bc3-bd36-ef4076b11fe8	2026-03-16 08:50:09.275243	2026-03-16 09:42:48.718896	pantalons	\N
1aed1e59-2228-404e-948c-e08c2a73ef93	 Baggy wide-leg jeans	Long five-pocket jeans with a metal zip and button fastening at the front. Mid-waist with wide-legs. Made from 100% cotton denim fabric..	100.00	\N	22	\N	\N	\N	{}	["/images/clothing/baggy1.png", "/images/clothing/baggy.png", "/images/clothing/baggy2.png"]	{}	t	published	0	b4daf8d8-f675-4bc3-bd36-ef4076b11fe8	2026-03-16 08:50:09.281469	2026-03-16 09:42:48.725327	pantalons	\N
804aa65c-a443-4acf-b630-afd4982f58da	 Straight jeans	Long five-pocket jeans with a metal zip fly and button fastening. Straight-leg and mid-waist. Made of stretch cotton denim fabric	95.00	\N	22	\N	\N	\N	{}	["/images/clothing/straight.png", "/images/clothing/straight1.png", "/images/clothing/straight2.png"]	{}	t	published	0	b4daf8d8-f675-4bc3-bd36-ef4076b11fe8	2026-03-16 08:50:09.28709	2026-03-16 09:42:48.731632	pantalons	\N
3620c210-ff84-456b-8898-f786b1cde451	Slim fit wide jeans	Denim jeans. High-waist. Straight leg. Button and metal zip fastening. 100% cotton denim fabric.	95.00	\N	22	\N	\N	\N	{}	["/images/clothing/slim.png", "/images/clothing/slim1.png", "/images/clothing/slim2.png", "/images/clothing/slim3.png"]	{}	t	published	0	b4daf8d8-f675-4bc3-bd36-ef4076b11fe8	2026-03-16 08:50:09.292147	2026-03-16 09:42:48.738078	pantalons	\N
6ef6cf46-c5b6-4e48-92b9-4aced00c590b	 Basic wide-leg trousers	High-waist trousers with belt loops. Zip and metal hook fastening. Side pockets.	90.00	\N	22	\N	\N	\N	{}	["/images/clothing/basicbeige.png", "/images/clothing/basicbeige1.png", "/images/clothing/basicbeige2.png"]	{}	t	published	1	b4daf8d8-f675-4bc3-bd36-ef4076b11fe8	2026-03-16 08:50:09.297085	2026-03-16 10:16:24.013107	pantalons	\N
95079575-46e6-467e-8254-68b4e15f0726	Écharpe Rose	Écharpe en cachemire rose.	40.00	\N	15	\N	\N	\N	{}	["/images/scarfs/pink.jpeg", "/images/scarfs/pink1.jpeg", "/images/scarfs/pink2.jpeg"]	{}	t	published	0	ee1f19d4-99cb-4135-becf-437845c1410b	2026-03-16 08:50:09.003548	2026-03-16 09:42:48.356568	\N	\N
6894182e-75a6-45c8-abe1-a01881e30af4	Écharpe Marron	Écharpe Marron en Cachemire.	40.00	\N	9	\N	\N	\N	{}	["/images/scarfs/marron.jpeg", "/images/scarfs/marron1.jpeg", "/images/scarfs/marron2.jpeg", "/images/scarfs/marron3.jpeg"]	{}	t	published	0	ee1f19d4-99cb-4135-becf-437845c1410b	2026-03-16 08:50:09.113096	2026-03-16 09:42:48.50324	\N	\N
8ed4a4c5-ce7e-4f4a-a436-2137ed9efc81	Collier Fleur	Collier floral en acier inoxydable.	25.00	\N	18	\N	\N	\N	{}	["/images/accessoires/collierfleur.jpeg", "/images/accessoires/collierfleur.jpeg", "/images/accessoires/collierfleur.jpeg"]	{}	t	published	1	4b4f6e9e-d469-461e-a0df-c62d561d0e2c	2026-03-16 08:50:09.150366	2026-03-16 09:42:48.550726	colliers	\N
4144a15d-8711-4adf-aad0-21064c95b637	Burgundy Coat	Manteau bordeaux élégant.	180.00	\N	22	\N	\N	\N	{}	["/images/clothing/redcoat.jpeg", "/images/clothing/redcoat1.jpeg", "/images/clothing/redcoat.jpeg"]	{}	t	published	0	b4daf8d8-f675-4bc3-bd36-ef4076b11fe8	2026-03-16 08:50:09.216158	2026-03-16 09:42:48.646764	coats	\N
93a12afa-2dc7-41a2-bc1f-31611e55943b	Trench Coat Beige	Trench coat beige classique.	180.00	\N	22	\N	\N	\N	{}	["/images/clothing/trenchbeige.png", "/images/clothing/trenchbeige1.png"]	{}	t	published	0	b4daf8d8-f675-4bc3-bd36-ef4076b11fe8	2026-03-16 08:50:09.222882	2026-03-16 09:42:48.653697	coats	\N
2f82e7d8-adc7-4da5-93d6-9c2e5d7b52b1	Short faux suede trench coat	Short long sleeve trench coat with a lapel collar and a double-breasted button fastening. Featuring two side pockets.	150.00	\N	22	\N	\N	\N	{}	["/images/clothing/trench.png", "/images/clothing/trench1.png", "/images/clothing/trench2.png"]	{}	t	published	0	b4daf8d8-f675-4bc3-bd36-ef4076b11fe8	2026-03-16 08:50:09.23745	2026-03-16 09:42:48.675556	vestes	\N
c02edba1-ec9a-4965-9f49-cb52ab997a5f	Chemise Rayée	Chemise en rayures élégante.	45.00	\N	22	\N	\N	\N	{}	["/images/clothing/chemiserayé.png", "/images/clothing/chemiserayé1.png"]	{}	t	published	0	b4daf8d8-f675-4bc3-bd36-ef4076b11fe8	2026-03-16 08:50:09.243579	2026-03-16 09:42:48.68351	Chemises	\N
7e33bf70-f5f9-4160-b6fc-01f1ad7b92ab	Chemise Blanche 	Chemise Blanche Courte .	45.00	\N	22	\N	\N	\N	{}	["/images/clothing/chemiseblanche.jpeg", "/images/clothing/chemiseblanche1.jpeg"]	{}	t	published	0	b4daf8d8-f675-4bc3-bd36-ef4076b11fe8	2026-03-16 08:50:09.250343	2026-03-16 09:42:48.690149	Chemises	\N
b35fe3ea-adac-4bee-a780-6f2fb03a4f64	 Set Denim & Denim	Set en denim foncée.	115.00	\N	22	\N	\N	\N	{}	["/images/clothing/denim.jpeg", "/images/clothing/denim1.jpeg"]	{}	t	published	0	b4daf8d8-f675-4bc3-bd36-ef4076b11fe8	2026-03-16 08:50:09.256929	2026-03-16 09:42:48.696111	sets	\N
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, email, password, "firstName", "lastName", name, phone, role, "createdAt") FROM stdin;
69ee2fac-9fa9-4c7f-a3b4-7deda7ca3cf0	yassmine.benachour@gmail.com	$2b$10$CdoAIRXQzgq2BxXN23uhkeK.2noYw0ZsKmpbJXW8JBeyMxcqbzV2q	\N	\N	undefined undefined	\N	user	2026-03-16 09:14:24.003717
230c16a5-7864-42fb-8b0f-482540300da8	yassmine.benachour@jass.com	$2b$10$MCXwVVzFwyZGNn2aZbWJ1eZuhtmmK7b3qW5B0dLXH7coZt2JXwtqi	\N	\N	Yassmine Ben achour	\N	user	2026-03-16 09:25:01.018787
d23ece61-ebd5-4942-9d83-dcdc3b452211	ghofrane26@jass.tn	$2b$10$sYuX3Q0DZg7EuQz6Y5jykOn.4HrY32jBg9e0D7iXLER.cuS.c01zC	\N	\N	Admin JASS	\N	admin	2026-03-16 08:50:09.370353
\.


--
-- Name: products PK_0806c755e0aca124e67c0cf6d7d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY (id);


--
-- Name: order PK_1031171c13130102495201e3e20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY (id);


--
-- Name: categories PK_24dbc6126a28ff948da33e97d3b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id);


--
-- Name: cart_items PK_6fccf5ec03c172d27a28a82928b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "PK_6fccf5ec03c172d27a28a82928b" PRIMARY KEY (id);


--
-- Name: carts PK_b5f695a59f5ebb50af3c8160816; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY (id);


--
-- Name: contacts PK_b99cd40cfd66a99f1571f4f72e6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: categories UQ_420d9f679d41281f282f5bc7d09; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE (slug);


--
-- Name: products UQ_c44ac33a05b144dd0d9ddcf9327; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327" UNIQUE (sku);


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: carts FK_69828a178f152f157dcf2f70a89; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT "FK_69828a178f152f157dcf2f70a89" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: cart_items FK_72679d98b31c737937b8932ebe6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "FK_72679d98b31c737937b8932ebe6" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: cart_items FK_edd714311619a5ad09525045838; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "FK_edd714311619a5ad09525045838" FOREIGN KEY ("cartId") REFERENCES public.carts(id) ON DELETE CASCADE;


--
-- Name: products FK_ff56834e735fa78a15d0cf21926; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES public.categories(id);


--
-- PostgreSQL database dump complete
--

\unrestrict rTam5pd7Qw26q5suD2GBzBJugw3c1ekn4Od1xLHXCGSOjOWi9r0G17k29zAck4M

