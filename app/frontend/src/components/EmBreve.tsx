export function EmBreve({ titulo }: { titulo: string }) {
  return (
    <div>
      <h1 className="content-h1">{titulo}</h1>
      <p className="content-sub">
        Módulo previsto para a Fase 2 — especificado em ARQUITETURA.md. Em breve.
      </p>
      <div className="panel" style={{ marginTop: 22, textAlign: 'center', padding: 60 }}>
        <span style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>
          🚧 Tela em construção
        </span>
      </div>
    </div>
  );
}
