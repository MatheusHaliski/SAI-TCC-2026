import { tableAFunctions, tableAImageChecklist, tableDReferenceIdentity } from './content';
import Image from 'next/image';

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-300 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-semibold uppercase tracking-wide">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${row[0]}-${rowIndex}`} className="border-t border-slate-200 align-top">
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className="px-4 py-3 whitespace-pre-wrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TablesPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-10 px-6 py-8 text-slate-900">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">Tabelas VI (corrigidas)</h1>
        <p className="text-slate-600">
          Atualização solicitada: Tabela A agora inclui todas as funções de A08 até A16 e Tabela D mostra o conteúdo
          de elementos de Referência/Identidade.
        </p>
      </section>

      <section className="space-y-4" id="tabela-a">
        <h2 className="text-2xl font-semibold">Tabela A — Atribuição e Estado</h2>
        <DataTable
          headers={['Código', 'Função VI', 'Valor-Script Relacionado', 'Uso']}
          rows={tableAFunctions.map((item) => [item.codigo, item.funcao, item.valorScript, item.uso])}
        />
      </section>

      <section className="space-y-4" id="tabela-d">
        <h2 className="text-2xl font-semibold">Tabela D — Elementos de Referência & Escopo</h2>
        <DataTable
          headers={[
            'Código D',
            'Camada',
            'Domínio',
            'Categoria',
            'Elemento',
            'Tipo',
            'Função Principal',
            'Aplicação da Função VI (Tabela D)',
          ]}
          rows={tableDReferenceIdentity.map((item) => [
            item.codigoD,
            item.camada,
            item.dominio,
            item.categoria,
            item.elemento,
            item.tipo,
            item.funcaoPrincipal,
            item.aplicacao,
          ])}
        />
      </section>

      <section className="space-y-2" id="tables-content">
        <h2 className="text-2xl font-semibold">/tables content — imagens da Tabela A</h2>
        <p className="text-slate-600">Anexar em <code>/public/tables</code> usando os nomes abaixo:</p>
        <ul className="list-disc space-y-1 pl-6 text-slate-700">
          {tableAImageChecklist.map((imageName) => (
            <li key={imageName}>
              <code>{imageName}</code>
            </li>
          ))}
        </ul>
        <div className="grid gap-4 md:grid-cols-2">
          {tableAImageChecklist.map((imageName) => (
            <figure key={`preview-${imageName}`} className="rounded-xl border border-slate-300 bg-white p-3">
              <Image src={`/tables/${imageName}`} alt={imageName} width={1200} height={700} className="h-auto w-full rounded-md" />
              <figcaption className="mt-2 text-xs text-slate-600">{imageName}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}
