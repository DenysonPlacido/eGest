CREATE OR REPLACE PROCEDURE public.inserir_pessoa(
  IN p_tipo_pessoa     integer,
  IN p_cpf_cnpj        varchar(15),
  IN p_nome            varchar(100),
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
  IF EXISTS (SELECT 1 FROM pessoas WHERE cpf_cnpj = p_cpf_cnpj) THEN
    RAISE EXCEPTION '⚠️ CPF/CNPJ % já cadastrado.', p_cpf_cnpj;
  ELSE
    INSERT INTO pessoas (
      tipo_pessoa, cpf_cnpj, nome, data_nascimento,
      ddd, fone, email, cep, cod_logradouro,
      numero, cod_bairro, complemento
    ) VALUES (
      p_tipo_pessoa, p_cpf_cnpj, p_nome, p_data_nascimento,
      p_ddd, p_fone, p_email, p_cep, p_cod_logradouro,
      p_numero, p_cod_bairro, p_complemento
    );
    RAISE NOTICE '✅ Pessoa % cadastrada com sucesso.', p_nome;
  END IF;
END;
$$;
