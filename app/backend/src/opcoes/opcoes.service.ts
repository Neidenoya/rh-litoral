import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Listas de apoio para os formulários (selects) do frontend.
@Injectable()
export class OpcoesService {
  constructor(private readonly prisma: PrismaService) {}

  async listar() {
    const [empresas, shoppings, departamentos, cargos, centrosCusto, colaboradores] =
      await Promise.all([
        this.prisma.empresa.findMany({
          select: { id: true, razaoSocial: true },
          orderBy: { razaoSocial: 'asc' },
        }),
        this.prisma.shopping.findMany({
          select: { id: true, nome: true },
          orderBy: { nome: 'asc' },
        }),
        this.prisma.departamento.findMany({
          select: { id: true, nome: true },
          orderBy: { nome: 'asc' },
        }),
        this.prisma.cargo.findMany({
          select: { id: true, nome: true },
          orderBy: { nome: 'asc' },
        }),
        this.prisma.centroCusto.findMany({
          select: { id: true, codigo: true },
          orderBy: { codigo: 'asc' },
        }),
        this.prisma.colaborador.findMany({
          where: { status: { not: 'DESLIGADO' as const } },
          select: { id: true, nomeCompleto: true },
          orderBy: { nomeCompleto: 'asc' },
        }),
      ]);

    return { empresas, shoppings, departamentos, cargos, centrosCusto, colaboradores };
  }
}
