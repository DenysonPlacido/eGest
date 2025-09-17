CREATE OR REPLACE PROCEDURE inserir_usuario(
    p_pessoa_id INT,
    p_status_usuario INT,
    p_tipo_usuario INT,
    p_senha VARCHAR,
    p_empresa_id INT DEFAULT NULL,
    p_login VARCHAR DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO usuarios (
        pessoa_id, status_usuario, tipo_usuario, senha, empresa_id, login
    ) VALUES (
        p_pessoa_id, p_status_usuario, p_tipo_usuario, p_senha, p_empresa_id, p_login
    );

    RAISE NOTICE '✅ Usuário % cadastrado com sucesso.', p_login;
END;
$$;
