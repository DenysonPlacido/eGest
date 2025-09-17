-- public.tipos_usuarios definição

-- Drop table

-- DROP TABLE public.tipos_usuarios;

CREATE TABLE public.tipos_usuarios (
	tipo_usuario int4 GENERATED ALWAYS AS IDENTITY( MINVALUE 0 NO MAXVALUE START 0 NO CYCLE) NOT NULL,
	descricao varchar(50) NOT NULL,
	CONSTRAINT tipos_usuarios_pkey PRIMARY KEY (tipo_usuario)
);