import { Injectable } from '@nestjs/common';
import { Perfil } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const PODE_VER_SALARIO: Perfil[] = ['DIRETORIA', 'RH', 'FINANCEIRO'];

@Injectable()
export class RelatoriosService {
  constructor(private readonly prisma: PrismaService) {}

  async quadro(perfil?: Perfil) {
    const ativos = { status: { not: 'DESLIGADO' as const } };

    const [
      porDepartamento,
      porShopping,
      porContrato,
      porStatus,
      custoFolha,
      departamentos,
      shoppings,
    ] = await Promise.all([
      this.prisma.colaborador.groupBy({
        by: ['departamentoId'],
        where: ativos,
        _count: { _all: true },
      }),
      this.prisma.colaborador.groupBy({
        by: ['shoppingId'],
        where: ativos,
        _count: { _all: true },
      }),
      this.prisma.colaborador.groupBy({
        by: ['tipoContrato'],
        where: ativos,
        _count: { _all: true },
      }),
      this.prisma.colaborador.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      this.prisma.colaborador.groupBy({
        by: ['departamentoId'],
        where: ativos,
        _sum: { salario: true },
      }),
      this.prisma.departamento.findMany({ select: { id: true, nome: true } }),
      this.prisma.shopping.findMany({ select: { id: true, nome: true } }),
    ]);

    const nomeDep = (id: string) =>
      departamentos.find((d) => d.id === id)?.nome ?? id;
    const nomeShop = (id: string) =>
      shoppings.find((s) => s.id === id)?.nome ?? id;

    const podeSalario = perfil ? PODE_VER_SALARIO.includes(perfil) : false;

    return {
      headcountDepartamento: porDepartamento
        .map((g) => ({ nome: nomeDep(g.departamentoId), valor: g._count._all }))
        .sort((a, b) => b.valor - a.valor),
      headcountShopping: porShopping
        .map((g) => ({ nome: nomeShop(g.shoppingId), valor: g._count._all }))
        .sort((a, b) => b.valor - a.valor),
      porContrato: porContrato.map((g) => ({
        nome: g.tipoContrato,
        valor: g._count._all,
      })),
      porStatus: porStatus.map((g) => ({
        nome: g.status,
        valor: g._count._all,
      })),
      custoFolhaDepartamento: podeSalario
        ? custoFolha
            .map((g) => ({
              nome: nomeDep(g.departamentoId),
              valor: Number(g._sum.salario ?? 0),
            }))
            .sort((a, b) => b.valor - a.valor)
        : null,
    };
  }
}
