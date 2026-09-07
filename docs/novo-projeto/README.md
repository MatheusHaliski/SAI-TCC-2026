# Fashion AI — Reestruturação do projeto (TCC 2026)

Documentos de planejamento para a migração do Fashion AI para um repositório novo em **Java / Spring Boot**, com requisitos e critérios de aceite reorganizados e a interface especificada.

| # | Documento | Etapas do plano | Conteúdo |
|---|---|---|---|
| 00 | [`00-plano-guiado-4h.md`](00-plano-guiado-4h.md) | **9** | Cronograma de 4 horas em 8 blocos, quatro frentes paralelas, riscos e planos B |
| 01 | [`01-bootstrap-repo-java.md`](01-bootstrap-repo-java.md) | **1 e 2** | Inventário de insumos · decisões técnicas · MySQL + Cassandra/Redis/OpenSearch · variáveis de ambiente · segurança · prompt de bootstrap |
| 02 | [`02-rf-reestruturados-e-criterios-aceite.md`](02-rf-reestruturados-e-criterios-aceite.md) | **3 e 5** | Política de não renumerar · mapa de absorção (RF24–RF29) · enunciados corrigidos · ~150 critérios de aceite · matriz RF × RNF |
| 03 | [`03-rf30-ia-e-servicos-externos.md`](03-rf30-ia-e-servicos-externos.md) | **4** | RF30 (motor de IA) com 16 CAs · tabela RF × serviço externo com custo e fallback |
| 04 | [`04-telas-artefatos-e-pranchas.md`](04-telas-artefatos-e-pranchas.md) | **6 e 7** | Ficha das 20 pranchas · assets do Firefly · especificação dos 10 artefatos de interface |
| 05 | [`05-diagramas-atividade.md`](05-diagramas-atividade.md) | **8** | 14 diagramas de atividade em Mermaid, com os CAs anotados nos fluxos |
| — | [`insumos/`](insumos/README.md) | pré-requisito | Onde depositar os anexos do Trello que o conector não lê |

## Decisões que o time precisa fechar antes de aplicar

1. **Não renumerar RFs** — os absorvidos viram CA e o número antigo é aposentado, nunca reciclado (documento 02, §1).
2. **RF26 → RF3** para a gestão de notificações; o *disparo* permanece rastreado em RF19/RF20 (documento 02, §2).
3. **RF21/RF22 (celebridades)** dentro ou fora do escopo do TCC.
4. **Criar RF30** (IA) e **RF31** (favoritar/disponível/indisponível/todos).
