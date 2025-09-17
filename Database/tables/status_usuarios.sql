-- public.status_usuarios definição

-- Drop table

-- DROP TABLE public.status_usuarios;

CREATE TABLE public.status_usuarios (
	status_usuario int4 GENERATED ALWAYS AS IDENTITY( MINVALUE 0 NO MAXVALUE START 0 NO CYCLE) NOT NULL,
	descricao varchar(20) NOT NULL,
	CONSTRAINT status_usuarios_pkey PRIMARY KEY (status_usuario)
);