-- DROP PROCEDURE public.gerenciar_pessoa(in text, in int4, in int4, in text, in text, in date, in text, in text, in text, in text, in int4, in text, in int4, in text, inout refcursor);

CREATE OR REPLACE PROCEDURE public.gerenciar_pessoa(IN acao text, IN p_pessoa_id integer DEFAULT NULL::integer, IN p_tipo_pessoa integer DEFAULT NULL::integer, IN p_cpf_cnpj text DEFAULT NULL::text, IN p_nome text DEFAULT NULL::text, IN p_data_nascimento date DEFAULT NULL::date, IN p_ddd text DEFAULT NULL::text, IN p_fone text DEFAULT NULL::text, IN p_email text DEFAULT NULL::text, IN p_cep text DEFAULT NULL::text, IN p_cod_logradouro integer DEFAULT NULL::integer, IN p_numero text DEFAULT NULL::text, IN p_cod_bairro integer DEFAULT NULL::integer, IN p_complemento text DEFAULT NULL::text, INOUT resultado refcursor DEFAULT 'resultado_cursor'::refcursor)
 LANGUAGE plpgsql
AS $procedure$


begin
case
	acao



WHEN 'INSERT' THEN
  IF EXISTS (SELECT 1 FROM pessoas WHERE cpf_cnpj = p_cpf_cnpj) THEN
    RAISE NOTICE '⚠️ CPF/CNPJ % já cadastrado.', p_cpf_cnpj;
  ELSE
    INSERT INTO pessoas (
      tipo_pessoa, cpf_cnpj, nome, data_nascimento,
      ddd, fone, email, cep, cod_logradouro,
      numero, cod_bairro, complemento
    ) VALUES (
      p_tipo_pessoa, p_cpf_cnpj, p_nome, p_data_nascimento,
      p_ddd, p_fone, p_email, p_cep, p_cod_logradouro,
      p_numero::INTEGER, p_cod_bairro, p_complemento
    );
    RAISE NOTICE '✅ Pessoa % cadastrada com sucesso.', p_nome;
  END IF;


WHEN 'UPDATE' THEN
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
      numero          = COALESCE(p_numero::INTEGER, numero),
      cod_bairro      = COALESCE(p_cod_bairro, cod_bairro),
      complemento     = COALESCE(p_complemento, complemento)
    WHERE pessoa_id = p_pessoa_id;
    RAISE NOTICE '✏️ Pessoa com ID % atualizada com sucesso.', p_pessoa_id;
  ELSE
    RAISE NOTICE '⚠️ Pessoa com ID % não encontrada para atualização.', p_pessoa_id;
  END IF;
	



WHEN 'DELETE' THEN
  IF EXISTS (SELECT 1 FROM pessoas WHERE pessoa_id = p_pessoa_id) THEN
    DELETE FROM pessoas WHERE pessoa_id = p_pessoa_id;
    RAISE NOTICE '✅ Pessoa com ID % deletada com sucesso.', p_pessoa_id;
  ELSE
    RAISE NOTICE '⚠️ Pessoa com ID % não encontrada para exclusão.', p_pessoa_id;
  END IF;


WHEN 'SELECT' THEN
OPEN resultado FOR
  SELECT * FROM pessoas
  WHERE
    (p_pessoa_id IS NULL OR pessoa_id = p_pessoa_id)
    AND (p_nome IS NULL OR nome ILIKE '%' || p_nome || '%')
    AND (p_cpf_cnpj IS NULL OR cpf_cnpj = p_cpf_cnpj)
  ORDER BY pessoa_id
  LIMIT COALESCE(p_limit, 10)
  OFFSET COALESCE(p_offset, 0);
else
raise exception 'Ação inválida: %',
acao;
end case;
end;

$procedure$
;