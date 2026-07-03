import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { popularBase } from './dados.seed';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    // SEED_ON_BOOT=false desativa (ex.: produção já populada manualmente)
    if (process.env.SEED_ON_BOOT === 'false') return;
    try {
      const r = await popularBase(this.prisma, { force: false });
      if (r.populou) {
        this.logger.log(
          `Base populada no boot: ${r.colaboradores} colaboradores, ${r.usuarios} usuários.`,
        );
      } else {
        this.logger.log(
          `Base já populada (${r.colaboradores} colaboradores) — seed ignorado.`,
        );
      }
    } catch (err) {
      this.logger.error('Falha no seed automático', err as Error);
    }
  }
}
