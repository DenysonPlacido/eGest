CREATE OR REPLACE PROCEDURE listar_usuarios(
    p_id INT DEFAULT NULL,
    p_login VARCHAR DEFAULT NULL,
    p_limit INT DEFAULT 10,
    p_offset INT DEFAULT 0,
    INOUT resultado REFCURSOR DEFAULT 'resultado_cursor'
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN resultado FOR
    SELECT id, pessoa_id, status_usuario, tipo_usuario, login, empresa_id, data_cadastro
    FROM usuarios
    WHERE (p_id IS NULL OR id = p_id)
      AND (p_login IS NULL OR login ILIKE '%' || p_login || '%')
    ORDER BY id
    LIMIT p_limit OFFSET p_offset;
END;
$$;
