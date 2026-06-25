import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Perfil, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { OrganogramaService } from '../organograma/organograma.service';
import { CreateColaboradorDto } from './dto/create-colaborador.dto';
import { UpdateColaboradorDto } from './dto/update-colaborador.dto';

const PODE_VER_SALARIO: Perfil[] = ['DIRETORIA', 'RH', 'FINANCEIRO'];
const PODE_VER_CPF: Perfil[] = ['DIRETORIA', 'RH', 'JURIDICO'];

export interface FiltroColaborador {
  shoppingId?: string;
  departamentoId?: string;
  status?: any;
  busca?: string;
}

@Injectable()
export class ColaboradoresService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organograma: OrganogramaService,
  ) {}

  async findAll(filtro: FiltroColaborador, perfil?: Perfil) {
    const where: Prisma.ColaboradorWhereInput = {};
    if (filtro.shoppingId) where.shoppingId = filtro.shoppingId;
    if (filtro.departamentoId) where.departamentoId = filtro.departamentoId;
    if (filtro.status) where.status = filtro.status;
    if (filtro.busca) {
      where.OR = [
        { nomeCompleto: { contains: filtro.busca, mode: 'insensitive' } },
        { matricula: { contains: filtro.busca, mode: 'insensitive' } },
        { cargo: { nome: { contains: filtro.busca, mode: 'insensitive' } } },
      ];
    }

    const lista = await this.prisma.colaborador.findMany({
      where,
      include: {
        cargo: true,
        departamento: true,
        shopping: true,
        empresa: true,
      },
      orderBy: { nomeCompleto: 'asc' },
    });

    return lista.map((c) => this.mascarar(c, perfil));
  }

  async findOne(id: string, perfil?: Perfil) {
    const colaborador = await this.prisma.colaborador.findUnique({
      where: { id },
      include: {
        cargo: true,
        departamento: true,
        shopping: true,
        empresa: true,
        centroCusto: true,
        gestorImediato: { select: { id: true, nomeCompleto: true, cargo: true } },
        documentos: true,
        treinamentos: { include: { treinamento: true } },
      },
    });
    if (!colaborador) throw new NotFoundException('Colaborador não encontrado');
    return this.mascarar(colaborador, perfil);
  }

  async create(dto: CreateColaboradorDto) {
    if (dto.gestorImediatoId) {
      const gestor = await this.prisma.colaborador.findUnique({
        where: { id: dto.gestorImediatoId },
      });
      if (!gestor) throw new BadRequestException('Gestor imediato inexistente');
    }
    const { dataAdmissao, salario, ...resto } = dto;
    return this.prisma.colaborador.create({
      data: {
        ...resto,
        dataAdmissao: new Date(dataAdmissao),
        salario: new Prisma.Decimal(salario),
      },
    });
  }

  async update(id: string, dto: UpdateColaboradorDto, usuarioId?: string) {
    const atual = await this.prisma.colaborador.findUnique({ where: { id } });
    if (!atual) throw new NotFoundException('Colaborador não encontrado');

    if (dto.gestorImediatoId && dto.gestorImediatoId !== atual.gestorImediatoId) {
      const ciclo = await this.organograma.criariaCiclo(id, dto.gestorImediatoId);
      if (ciclo) {
        throw new BadRequestException(
          'Alteração de gestor criaria um ciclo hierárquico',
        );
      }
    }

    const data: Prisma.ColaboradorUpdateInput = { ...dto } as any;
    if (dto.dataAdmissao) data.dataAdmissao = new Date(dto.dataAdmissao);
    if (dto.salario !== undefined) data.salario = new Prisma.Decimal(dto.salario);

    const atualizado = await this.prisma.colaborador.update({ where: { id }, data });

    await this.auditarSensiveis(usuarioId, id, atual, dto);
    return atualizado;
  }

  async desligar(id: string, motivo: string, data: string, usuarioId?: string) {
    const atual = await this.prisma.colaborador.findUnique({ where: { id } });
    if (!atual) throw new NotFoundException('Colaborador não encontrado');

    const atualizado = await this.prisma.colaborador.update({
      where: { id },
      data: {
        status: 'DESLIGADO',
        dataDesligamento: new Date(data),
        motivoDesligamento: motivo,
      },
    });

    await this.registrarLog(usuarioId, id, 'status', atual.status, 'DESLIGADO');
    return atualizado;
  }

  // ─────────── helpers ───────────

  private async auditarSensiveis(
    usuarioId: string | undefined,
    id: string,
    atual: any,
    dto: UpdateColaboradorDto,
  ) {
    if (dto.salario !== undefined && Number(atual.salario) !== dto.salario) {
      await this.registrarLog(
        usuarioId, id, 'salario', String(atual.salario), String(dto.salario),
      );
    }
    if (dto.gestorImediatoId && dto.gestorImediatoId !== atual.gestorImediatoId) {
      await this.registrarLog(
        usuarioId, id, 'gestorImediatoId',
        atual.gestorImediatoId, dto.gestorImediatoId,
      );
    }
  }

  private registrarLog(
    usuarioId: string | undefined,
    entidadeId: string,
    campo: string,
    anterior: string | null,
    novo: string | null,
  ) {
    return this.prisma.logAuditoria.create({
      data: {
        usuarioId,
        entidade: 'colaborador',
        entidadeId,
        campoAlterado: campo,
        valorAnterior: anterior,
        valorNovo: novo,
      },
    });
  }

  private mascarar(colaborador: any, perfil?: Perfil) {
    const c = { ...colaborador };
    if (c.salario != null) c.salario = Number(c.salario);
    if (perfil && !PODE_VER_SALARIO.includes(perfil)) c.salario = null;
    if (perfil && !PODE_VER_CPF.includes(perfil) && c.cpf) {
      c.cpf = '***.***.***-**';
    }
    return c;
  }
}
