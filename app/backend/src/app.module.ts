import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ColaboradoresModule } from './colaboradores/colaboradores.module';
import { OrganogramaModule } from './organograma/organograma.module';
import { IndicadoresModule } from './indicadores/indicadores.module';
import { OpcoesModule } from './opcoes/opcoes.module';
import { VagasModule } from './vagas/vagas.module';
import { FeriasModule } from './ferias/ferias.module';
import { TreinamentosModule } from './treinamentos/treinamentos.module';
import { DocumentosModule } from './documentos/documentos.module';
import { AvaliacoesModule } from './avaliacoes/avaliacoes.module';
import { RelatoriosModule } from './relatorios/relatorios.module';
import { SeedModule } from './seed/seed.module';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Serve o build do frontend (app/frontend/dist) no mesmo serviço.
    // Em produção (Render) é a SPA; /api/* fica reservado para a API.
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'dist'),
      exclude: ['/api/(.*)'],
    }),
    PrismaModule,
    AuthModule,
    ColaboradoresModule,
    OrganogramaModule,
    IndicadoresModule,
    OpcoesModule,
    VagasModule,
    FeriasModule,
    TreinamentosModule,
    DocumentosModule,
    AvaliacoesModule,
    RelatoriosModule,
    SeedModule,
  ],
})
export class AppModule {}
