-- public.configuracoes definição

-- Drop table

-- DROP TABLE public.configuracoes;

CREATE TABLE public.configuracoes (
	config_id int4 GENERATED ALWAYS AS IDENTITY( MINVALUE 0 NO MAXVALUE START 0 NO CYCLE) NOT NULL,
	nome varchar(20) NOT NULL,
	descricao_breve varchar(50) NULL,
	valor text NOT NULL,
	descricao_completa text NULL,
	categoria varchar(15) NOT NULL,
	CONSTRAINT configuracoes_pkey PRIMARY KEY (config_id)
);