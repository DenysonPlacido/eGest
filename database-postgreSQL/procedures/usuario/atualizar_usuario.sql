CREATE OR REPLACE PROCEDURE atualizar_usuario(
    p_id INT,
    p_pessoa_id INT DEFAULT NULL,
    p_status_usuario INT DEFAULT NULL,
    p_tipo_usuario INT DEFAULT NULL,
    p_senha VARCHAR DEFAULT NULL,
    p_empresa_id INT DEFAULT NULL,
    p_login VARCHAR DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM usuarios WHERE id = p_id) THEN
        UPDATE usuarios
        SET pessoa_id      = COALESCE(p_pessoa_id, pessoa_id),
            status_usuario  = COALESCE(p_status_usuario, status_usuario),
            tipo_usuario    = COALESCE(p_tipo_usuario, tipo_usuario),
            senha           = COALESCE(p_senha, senha),
            empresa_id      = COALESCE(p_empresa_id, empresa_id),
            login           = COALESCE(p_login, login)
        WHERE id = p_id;

        RAISE NOTICE '✏️ Usuário ID % atualizado com sucesso.', p_id;
    ELSE
        RAISE NOTICE '⚠️ Usuário ID % não encontrado.', p_id;
    END IF;
END;
$$;
