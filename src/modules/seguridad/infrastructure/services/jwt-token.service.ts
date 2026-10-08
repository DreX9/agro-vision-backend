import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  ITokenServicio,
  TokenPayload,
  TokensGenerados,
} from '../../domain/ports/token-servicio.port.js';

/**
 * @description Servicio para generación y verificación de tokens JWT y Refresh Tokens.
 */
@Injectable()
export class JwtTokenService implements ITokenServicio {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * @description Genera el Access Token y Refresh Token para el usuario.
   */
  async generarTokens(payload: TokenPayload): Promise<TokensGenerados> {
    const jwtSecret = this.configService.get<string>(
      'JWT_SECRET',
      'agro-vision-super-secret-key-change-in-production',
    );
    const jwtExpiration = this.configService.get<string>(
      'JWT_EXPIRATION',
      '24h',
    );
    const refreshExpiration = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRATION',
      '7d',
    );

    const expiraEnSegundos = this.convertirCadenaASegundos(jwtExpiration);
    const refreshExpiraEnSegundos =
      this.convertirCadenaASegundos(refreshExpiration);

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: jwtSecret,
      expiresIn: expiraEnSegundos,
    });

    const refreshToken = await this.jwtService.signAsync(
      { sub: payload.sub },
      {
        secret: jwtSecret,
        expiresIn: refreshExpiraEnSegundos,
      },
    );

    return {
      accessToken,
      refreshToken,
      expiraEn: expiraEnSegundos,
    };
  }

  /**
   * @description Convierte una cadena de tiempo (ej. 24h, 15m, 7d) a segundos numéricos.
   */
  private convertirCadenaASegundos(tiempo: string): number {
    const unidad = tiempo.slice(-1).toLowerCase();
    const valor = parseInt(tiempo.slice(0, -1), 10);

    if (isNaN(valor)) {
      return 86400; // Por defecto 24 horas
    }

    switch (unidad) {
      case 's':
        return valor;
      case 'm':
        return valor * 60;
      case 'h':
        return valor * 3600;
      case 'd':
        return valor * 86400;
      default:
        return 86400;
    }
  }

  /**
   * @description Verifica la validez de un token JWT recibido.
   */
  async verificarToken(token: string): Promise<TokenPayload | null> {
    try {
      const jwtSecret = this.configService.get<string>(
        'JWT_SECRET',
        'agro-vision-super-secret-key-change-in-production',
      );
      return await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: jwtSecret,
      });
    } catch {
      return null;
    }
  }
}
