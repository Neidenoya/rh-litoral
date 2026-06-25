import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface OrgNode {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  shopping: string;
  gestorImediatoId: string | null;
  subordinadosDiretos: number;
  subordinadosTotais: number;
  filhos: OrgNode[];
}

@Injectable()
export class OrganogramaService {
  constructor(private readonly prisma: PrismaService) {}

  // Árvore completa: 1 query enxuta + montagem/contagem em memória.
  async arvore(): Promise<OrgNode | OrgNode[]> {
    const lista = await this.prisma.colaborador.findMany({
      where: { status: { not: 'DESLIGADO' } },
      select: {
        id: true,
        nomeCompleto: true,
        gestorImediatoId: true,
        cargo: { select: { nome: true } },
        departamento: { select: { nome: true } },
        shopping: { select: { nome: true } },
      },
      orderBy: { nomeCompleto: 'asc' },
    });

    const mapa = new Map<string, OrgNode>();
    for (const c of lista) {
      mapa.set(c.id, {
        id: c.id,
        nome: c.nomeCompleto,
        cargo: c.cargo.nome,
        departamento: c.departamento.nome,
        shopping: c.shopping.nome,
        gestorImediatoId: c.gestorImediatoId,
        subordinadosDiretos: 0,
        subordinadosTotais: 0,
        filhos: [],
      });
    }

    const raizes: OrgNode[] = [];
    for (const node of mapa.values()) {
      const pai = node.gestorImediatoId
        ? mapa.get(node.gestorImediatoId)
        : undefined;
      if (pai) pai.filhos.push(node);
      else raizes.push(node);
    }

    const contar = (node: OrgNode): number => {
      node.subordinadosDiretos = node.filhos.length;
      let total = node.filhos.length;
      for (const f of node.filhos) total += contar(f);
      node.subordinadosTotais = total;
      return total;
    };
    raizes.forEach(contar);

    return raizes.length === 1 ? raizes[0] : raizes;
  }

  // Subordinados diretos + indiretos via CTE recursiva (uso para grandes volumes).
  async subordinados(gestorId: string) {
    return this.prisma.$queryRaw<
      { id: string; nome_completo: string; gestor_imediato_id: string; nivel: number }[]
    >`
      WITH RECURSIVE descendentes AS (
        SELECT id, nome_completo, gestor_imediato_id, 1 AS nivel
        FROM colaborador
        WHERE gestor_imediato_id = ${gestorId}
        UNION ALL
        SELECT c.id, c.nome_completo, c.gestor_imediato_id, d.nivel + 1
        FROM colaborador c
        JOIN descendentes d ON c.gestor_imediato_id = d.id
      )
      SELECT id, nome_completo, gestor_imediato_id, nivel
      FROM descendentes
      ORDER BY nivel, nome_completo;
    `;
  }

  // Impede ciclo: o novo gestor não pode ser o próprio colaborador
  // nem estar entre seus subordinados (subindo a cadeia a partir do gestor).
  async criariaCiclo(colaboradorId: string, novoGestorId: string): Promise<boolean> {
    if (colaboradorId === novoGestorId) return true;

    const linhas = await this.prisma.$queryRaw<{ id: string }[]>`
      WITH RECURSIVE cadeia AS (
        SELECT id, gestor_imediato_id
        FROM colaborador
        WHERE id = ${novoGestorId}
        UNION ALL
        SELECT c.id, c.gestor_imediato_id
        FROM colaborador c
        JOIN cadeia ON c.id = cadeia.gestor_imediato_id
      )
      SELECT id FROM cadeia WHERE id = ${colaboradorId} LIMIT 1;
    `;
    return linhas.length > 0;
  }
}
