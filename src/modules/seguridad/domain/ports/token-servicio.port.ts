export interface TokenPayload {
  sub: string;
  correo: string;
  rol: string;
}

export interface TokensGenerados {
  accessToken: string;
  refreshToken: string;
  expiraEn: number;
}

export const TOKEN_SERVICIO_PORT = Symbol('TOKEN_SERVICIO_PORT');

/**
 * @description Puerto para servicios de generación y verificación de tokens de autenticación (JWT).
 */
export interface ITokenServicio {
  generarTokens(payload: TokenPayload): Promise<TokensGenerados>;
  verificarToken(token: string): Promise<TokenPayload | null>;
}
