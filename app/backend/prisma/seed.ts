import { PrismaClient } from '@prisma/client';
import { popularBase } from '../src/seed/dados.seed';

const prisma = new PrismaClient();

// CLI de desenvolvimento: limpa e recria a base (force).
// No Render o seed roda no boot da aplicação (SeedService, idempotente).
popularBase(prisma, { force: true })
  .then((r) =>
    console.log(`Seed concluído: ${r.colaboradores} colaboradores, ${r.usuarios} usuários.`),
  )
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
