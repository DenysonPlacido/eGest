-- public.usuarios definição

-- Drop table

-- DROP TABLE public.usuarios;

CREATE TABLE public.usuarios (
	id int4 GENERATED ALWAYS AS IDENTITY( MINVALUE 0 NO MAXVALUE START 0 NO CYCLE) NOT NULL,
	pessoa_id int4 NOT NULL,
	status_usuario int4 NOT NULL,
	tipo_usuario int4 NOT NULL,
	senha varchar(255) NOT NULL,
	data_cadastro timestamp DEFAULT now() NOT NULL,
	empresa_id int4 NULL,
	login varchar(50) NULL,
	CONSTRAINT usuarios_login_key UNIQUE (login),
	CONSTRAINT usuarios_pkey PRIMARY KEY (id)
);


-- public.usuarios chaves estrangeiras

ALTER TABLE public.usuarios ADD CONSTRAINT usuarios_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(empresa_id);
ALTER TABLE public.usuarios ADD CONSTRAINT usuarios_pessoa_id_fkey FOREIGN KEY (pessoa_id) REFERENCES public.pessoas(pessoa_id);
ALTER TABLE public.usuarios ADD CONSTRAINT usuarios_status_usuario_fkey FOREIGN KEY (status_usuario) REFERENCES public.status_usuarios(status_usuario);
ALTER TABLE public.usuarios ADD CONSTRAINT usuarios_tipo_usuario_fkey FOREIGN KEY (tipo_usuario) REFERENCES public.tipos_usuarios(tipo_usuario);