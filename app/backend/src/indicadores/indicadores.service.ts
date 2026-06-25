import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IndicadoresService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard() {
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);
    const mesAtual = String(agora.getMonth() + 1).padStart(2, '0');
    const em30dias = new Date(agora);
    em30dias.setDate(em30dias.getDate() + 30);

    const ativos = { status: { not: 'DESLIGADO' as const } };

    const [
      totalColaboradores,
      porEmpresa,
      porShopping,
      porDepartamento,
      vagasAbertas,
      admissoesMes,
      desligamentosMes,
      experienciaVencendo,
      aniversariantes,
    ] = await Promise.all([
      this.prisma.colaborador.count({ where: ativos }),
      this.prisma.colaborador.groupBy({
        by: ['empresaId'],
        where: ativos,
        _count: { _all: true },
      }),
      this.prisma.colaborador.groupBy({
        by: ['shoppingId'],
        where: ativos,
        _count: { _all: true },
      }),
      this.prisma.colaborador.groupBy({
        by: ['departamentoId'],
        where: ativos,
        _count: { _all: true },
        orderBy: { _count: { departamentoId: 'desc' } },
      }),
      this.prisma.vaga.count({
        where: { status: { notIn: ['CONTRATADO', 'CANCELADA'] } },
      }),
      this.prisma.colaborador.count({
        where: { dataAdmissao: { gte: inicioMes, lte: fimMes } },
      }),
      this.prisma.colaborador.count({
        where: { dataDesligamento: { gte: inicioMes, lte: fimMes } },
      }),
      this.prisma.colaborador.findMany({
        where: { status: 'EXPERIENCIA', fimExperiencia: { lte: em30dias, gte: agora } },
        select: { id: true, nomeCompleto: true, fimExperiencia: true },
        orderBy: { fimExperiencia: 'asc' },
      }),
      this.prisma.colaborador.findMany({
        where: { ...ativos, dataAniversario: { startsWith: mesAtual } },
        select: { id: true, nomeCompleto: true, dataAniversario: true },
      }),
    ]);

    const [empresas, shoppings, departamentos] = await Promise.all([
      this.prisma.empresa.findMany({ select: { id: true, razaoSocial: true } }),
      this.prisma.shopping.findMany({ select: { id: true, nome: true } }),
      this.prisma.departamento.findMany({ select: { id: true, nome: true } }),
    ]);

    const nome = (lista: { id: string }[], campo: string) =>
      (id: string) => (lista.find((x) => x.id === id) as any)?.[campo] ?? id;

    return {
      totalColaboradores,
      vagasAbertas,
      admissoesMes,
      desligamentosMes,
      experienciaVencendo,
      aniversariantesMes: aniversariantes,
      headcountEmpresa: porEmpresa.map((g) => ({
        nome: nome(empresas, 'razaoSocial')(g.empresaId),
        valor: g._count._all,
      })),
      headcountShopping: porShopping.map((g) => ({
        nome: nome(shoppings, 'nome')(g.shoppingId),
        valor: g._count._all,
      })),
      headcountDepartamento: porDepartamento.map((g) => ({
        nome: nome(departamentos, 'nome')(g.departamentoId),
        valor: g._count._all,
      })),
    };
  }
}
