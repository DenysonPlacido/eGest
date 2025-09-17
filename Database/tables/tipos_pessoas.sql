-- public.tipos_pessoas definição

-- Drop table

-- DROP TABLE public.tipos_pessoas;

CREATE TABLE public.tipos_pessoas (
	tipo_pessoa int4 GENERATED ALWAYS AS IDENTITY( MINVALUE 0 NO MAXVALUE START 0 NO CYCLE) NOT NULL,
	descricao varchar(20) NOT NULL,
	CONSTRAINT tipos_pessoas_pkey PRIMARY KEY (tipo_pessoa)
);