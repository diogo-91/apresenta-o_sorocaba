# Sorocaba Motores — Caldeiraria

Apresentação técnica de caldeiraria: capa, esquema do processo, uma tela por operação (corte, dobra, usinagem, montagem, solda, acabamento, pintura), qualidade e contato. Projeto separado da apresentação principal, com dependências e deploy próprios.

- **Desktop (≥1024px):** modo slides em tela cheia. Avança com → ↓ PageDown espaço, roda do mouse ou controles no canto. O esquema do processo tem 9 passos: entrada, uma operação por passo e saída.
- **Mobile:** página contínua com rolagem.

## Rodar

```bash
cd caldeiraria
npm install
npm run dev
npm test
npm run build
```

## Deploy na Vercel

Crie um projeto novo na Vercel apontando para este mesmo repositório e defina **Root Directory = `caldeiraria`**. O framework é detectado como Vite (build `npm run build`, saída `dist`). A apresentação principal continua no projeto atual, sem mudança.

## Onde editar

| Conteúdo | Arquivo |
| --- | --- |
| Operações (nome, textos, entra/sai, processos, capacidades, ponto de conferência, foto) | `src/data/operations.ts` |
| Capa, processo, qualidade e contato | `src/data/content.ts` |
| Empresa e canais de contato | `src/data/company.ts` |
| Ordem das telas e menu | `src/data/screens.ts` e `src/slides.tsx` |

Fotos das operações: salve em `public/images/operacoes/` e preencha `photo.src` da operação (ex.: `src: '/images/operacoes/corte.jpg'`). Enquanto `src` for `null`, aparece o desenho técnico da operação com o aviso **foto a inserir**.

Tudo que é dado da empresa (capacidades, equipamentos, processos disponíveis, normas, contatos) está marcado **[A CONFIRMAR]**. As normas citadas em qualidade são referências a validar e não representam certificação.
