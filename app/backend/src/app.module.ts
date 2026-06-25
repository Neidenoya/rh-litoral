import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ColaboradoresModule } from './colaboradores/colaboradores.module';
import { OrganogramaModule } from './organograma/organograma.module';
import { IndicadoresModule } from './indicadores/indicadores.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ColaboradoresModule,
    OrganogramaModule,
    IndicadoresModule,
  ],
})
export class AppModule {}
