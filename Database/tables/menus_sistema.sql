-- public.menus_sistema definição

-- Drop table

-- DROP TABLE public.menus_sistema;

CREATE TABLE public.menus_sistema (
	id int4 GENERATED ALWAYS AS IDENTITY( MINVALUE 0 NO MAXVALUE START 0 NO CYCLE) NOT NULL,
	nome varchar(100) NOT NULL,
	descricao text NULL,
	tipo varchar(20) NULL,
	hierarquia_pai int4 NULL,
	caminho varchar(255) NULL,
	observacao text NULL,
	ordem varchar(10) NULL,
	ativo bool DEFAULT true NULL,
	icone varchar(50) NULL,
	permissao varchar(50) NULL,
	modulo varchar(50) NULL,
	data_criacao timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	data_atualizacao timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT menus_sistema_pkey PRIMARY KEY (id),
	CONSTRAINT menus_sistema_tipo_check CHECK ((((tipo)::text = ANY ((ARRAY['menu'::character varying, 'submenu'::character varying, 'acao'::character varying])::text[])))),
	CONSTRAINT menus_sistema_hierarquia_pai_fkey FOREIGN KEY (hierarquia_pai) REFERENCES public.menus_sistema(id) ON DELETE CASCADE
);
