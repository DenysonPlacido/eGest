-- public.perfis definição

-- Drop table

-- DROP TABLE public.perfis;

CREATE TABLE public.perfis (
	id serial4 NOT NULL,
	nome varchar(50) NOT NULL,
	descricao text NULL,
	nivel_acesso int4 NULL,
	CONSTRAINT perfis_nivel_acesso_check CHECK ((((nivel_acesso >= 1) AND (nivel_acesso <= 10)))),
	CONSTRAINT perfis_pkey PRIMARY KEY (id)
);