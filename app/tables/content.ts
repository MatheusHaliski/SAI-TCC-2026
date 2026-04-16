export type TableRow = {
  codigo: string;
  funcao: string;
  valorScript: string;
  uso: string;
};

export type ReferenceRow = {
  codigoD: string;
  camada: string;
  dominio: string;
  categoria: string;
  elemento: string;
  tipo: string;
  funcaoPrincipal: string;
  aplicacao: string;
};

export const tableAFunctions: TableRow[] = [
  { codigo: 'A01', funcao: 'atribuicao(c, v)', valorScript: 'let c = v;', uso: 'Declara e armazena valor no estado VI' },
  { codigo: 'A02', funcao: 'atribuir_div(c, codr)', valorScript: 'usar_atribuicao[c] = codr', uso: 'Salva bloco renderizado para reaproveitamento' },
  { codigo: 'A03', funcao: 'record(z)', valorScript: '{ z }', uso: 'Cria estrutura de dados (record/object literal)' },
  { codigo: 'A04', funcao: 'linear2(ax + by)', valorScript: 'a*x + b*y', uso: 'Plano sem constante' },
  { codigo: 'A05', funcao: 'linear3(ax + by + c)', valorScript: 'a*x + b*y + c', uso: 'Plano completo com constante' },
  { codigo: 'A06', funcao: 'aplicar(f, x)', valorScript: 'f(x)', uso: 'Aplica função' },
  { codigo: 'A07', funcao: 'compor(f, g, x)', valorScript: 'f(g(x))', uso: 'Composição funcional' },
  { codigo: 'A08', funcao: 'quadratica(a, b, c, x)', valorScript: 'a*x² + b*x + c', uso: 'Curva polinomial de grau 2' },
  { codigo: 'A09', funcao: 'identidade(x)', valorScript: 'x', uso: 'Retorna o mesmo valor' },
  { codigo: 'A10', funcao: 'negacao(x)', valorScript: '-x', uso: 'Inversão de sinal' },
  { codigo: 'A11', funcao: 'normalizacao(x, k)', valorScript: 'x/k', uso: 'Escala por normalização' },
  { codigo: 'A12', funcao: 'distancia(x, y)', valorScript: '√(x² + y²)', uso: 'Norma euclidiana' },
  { codigo: 'A13', funcao: 'angulo(y, x)', valorScript: 'arctan(y/x)', uso: 'Direção angular' },
  { codigo: 'A14', funcao: 'criar_objeto(entries)', valorScript: '{ ... }', uso: 'Cria objeto a partir de pares chave-valor' },
  { codigo: 'A15', funcao: 'linear_afim(a, x, b)', valorScript: 'a*x + b', uso: 'Reta (linear afim)' },
  { codigo: 'A16', funcao: 'acessar(obj, prop)', valorScript: 'obj.prop', uso: 'Acesso a propriedade (member access)' },
];

export const tableDReferenceIdentity: ReferenceRow[] = [
  {
    codigoD: 'D1.1 (A02)',
    camada: 'Referência',
    dominio: 'Data Model',
    categoria: 'Bloco de Dados',
    elemento: 'Data Block',
    tipo: 'Construtor',
    funcaoPrincipal: 'Retorna apenas elementos do escopo de modelagem de dados',
    aplicacao: 'VI(x)=VI[D1,A02] → A02() = { z } ; z ∈ { ElementoVI_A | B01 | B04 } e z ≠ ElementoVI_C e z ≠ B03',
  },
  {
    codigoD: 'D2.1 (B02)',
    camada: 'Referência',
    dominio: 'Função',
    categoria: 'Bloco Funcional',
    elemento: 'Function Block',
    tipo: 'Construtor',
    funcaoPrincipal: 'Retorna elementos do escopo completo de uma função',
    aplicacao: 'VI(x)=VI[D2,B02] → B02() = { z } ; z ∈ { ElementoVI_A | ElementoVI_B | ElementoVI_C | ElementoVI_H }',
  },
  {
    codigoD: 'D3.1 (C02)',
    camada: 'Referência',
    dominio: 'Controle',
    categoria: 'Bloco de Controle',
    elemento: 'Control Block',
    tipo: 'Construtor',
    funcaoPrincipal: 'Retorna apenas elementos do escopo de controle e fluxo',
    aplicacao: 'VI(x)=VI[D3,C02] → C02() = { z } ; z ∈ { ElementoVI_C | ElementoVI_A } e z ≠ ElementoVI_H e z ≠ ElementoVI_B',
  },
  {
    codigoD: 'D4.1 (H02)',
    camada: 'Referência',
    dominio: 'UI',
    categoria: 'Bloco de UI',
    elemento: 'UI Block',
    tipo: 'Construtor',
    funcaoPrincipal: 'Retorna apenas elementos do escopo de interface',
    aplicacao: 'VI(x)=VI[D4,H02,c,codr] → H02(c,codr) = <div className={c}>{ z }</div>; z ∈ { ElementoVI_H | ElementoVI_A }; loops somente via ponte C05(...) (opcional)',
  },
];

export const tableAImageChecklist = [
  'sintaxe-atualizada-tabela-a.png',
  'a1-atribuicao-referencia.png',
  'a2-funcoes-matematicas-lineares.png',
  'a3-composicao-de-funcoes.png',
  'a4-polinomiais-transformacoes.png',
  'a16-acesso-propriedade.png',
];
