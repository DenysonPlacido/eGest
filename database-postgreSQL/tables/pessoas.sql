-- public.pessoas definição

-- Drop table

-- DROP TABLE public.pessoas;

CREATE TABLE public.pessoas (
	pessoa_id int4 GENERATED ALWAYS AS IDENTITY( MINVALUE 0 NO MAXVALUE START 0 NO CYCLE) NOT NULL,
	tipo_pessoa int4 NULL,
	cpf_cnpj varchar(15) NOT NULL,
	nome varchar(100) NOT NULL,
	data_nascimento date NULL,
	ddd varchar(3) NULL,
	fone varchar(9) NULL,
	email varchar(50) NULL,
	cep varchar(8) NULL,
	cod_logradouro int4 NULL,
	numero int4 NULL,
	cod_bairro int4 NULL,
	complemento varchar(50) NULL,
	CONSTRAINT pessoas_cpf_cnpj_key UNIQUE (cpf_cnpj),
	CONSTRAINT pessoas_pkey PRIMARY KEY (pessoa_id)
);


-- public.pessoas chaves estrangeiras

ALTER TABLE public.pessoas ADD CONSTRAINT pessoas_tipo_pessoa_fkey FOREIGN KEY (tipo_pessoa) REFERENCES public.tipos_pessoas(tipo_pessoa);