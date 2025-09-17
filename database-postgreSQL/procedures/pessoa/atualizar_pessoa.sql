CREATE OR REPLACE PROCEDURE public.atualizar_pessoa(
  IN p_pessoa_id       integer,
  IN p_tipo_pessoa     integer DEFAULT NULL,
  IN p_cpf_cnpj        varchar(15) DEFAULT NULL,
  IN p_nome            varchar(100) DEFAULT NULL,
  IN p_data_nascimento date DEFAULT NULL,
  IN p_ddd             varchar(3) DEFAULT NULL,
  IN p_fone            varchar(9) DEFAULT NULL,
  IN p_email           varchar(50) DEFAULT NULL,
  IN p_cep             varchar(8) DEFAULT NULL,
  IN p_cod_logradouro  integer DEFAULT NULL,
  IN p_numero          integer DEFAULT NULL,
  IN p_cod_bairro      integer DEFAULT NULL,
  IN p_complemento     varchar(50) DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM pessoas WHERE pessoa_id = p_pessoa_id) THEN
    UPDATE pessoas SET
      tipo_pessoa     = COALESCE(p_tipo_pessoa, tipo_pessoa),
      cpf_cnpj        = COALESCE(p_cpf_cnpj, cpf_cnpj),
      nome            = COALESCE(p_nome, nome),
      data_nascimento = COALESCE(p_data_nascimento, data_nascimento),
      ddd             = COALESCE(p_ddd, ddd),
      fone            = COALESCE(p_fone, fone),
      email           = COALESCE(p_email, email),
      cep             = COALESCE(p_cep, cep),
      cod_logradouro  = COALESCE(p_cod_logradouro, cod_logradouro),
      numero          = COALESCE(p_numero, numero),
      cod_bairro      = COALESCE(p_cod_bairro, cod_bairro),
      complemento     = COALESCE(p_complemento, complemento)
    WHERE pessoa_id = p_pessoa_id;
    RAISE NOTICE '✏️ Pessoa com ID % atualizada com sucesso.', p_pessoa_id;
  ELSE
    RAISE EXCEPTION '⚠️ Pessoa com ID % não encontrada para atualização.', p_pessoa_id;
  END IF;
END;
$$;
