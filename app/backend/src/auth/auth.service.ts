import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, senha: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { email } });
    if (!usuario || !usuario.ativo) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const ok = await bcrypt.compare(senha, usuario.senhaHash);
    if (!ok) throw new UnauthorizedException('Credenciais inválidas');

    const payload: JwtPayload = {
      sub: usuario.id,
      email: usuario.email,
      perfil: usuario.perfil,
      colaboradorId: usuario.colaboradorId,
    };

    return {
      access_token: await this.jwt.signAsync(payload),
      usuario: {
        id: usuario.id,
        email: usuario.email,
        perfil: usuario.perfil,
      },
    };
  }
}
