-- public.empresas definição

-- Drop table

-- DROP TABLE public.empresas;

CREATE TABLE public.empresas (
	empresa_id int4 GENERATED ALWAYS AS IDENTITY( MINVALUE 0 NO MAXVALUE START 0 NO CYCLE) NOT NULL,
	nome varchar(100) NOT NULL,
	situacao int4 DEFAULT 1 NOT NULL,
	CONSTRAINT empresas_pkey PRIMARY KEY (empresa_id)
);