# Sorocaba Motores — Apresentação técnica

Apresentação executiva em slides (20 slides, 8 atos). React 19 + Vite + TypeScript + Tailwind 4 + Framer Motion.

- **Desktop (≥1024px):** modo slides. Palco 16:9 de 1600×900 escalado para a tela. Avança com → ↓ PageDown espaço, roda do mouse, swipe ou controles no canto; Home/End; índice; tela cheia. Cada slide tem endereço próprio (`#metodo`).
- **Mobile:** os mesmos slides empilhados em rolagem vertical, com menu e CTA fixo.

```bash
npm install
npm run dev      # desenvolvimento
npm test         # testes de comportamento (vitest)
npm run build    # typecheck + build de produção em dist/
```

Deploy: importar o repositório na Vercel (preset Vite, sem configuração extra). O `vercel.json` só adiciona o cabeçalho `X-Robots-Tag: noindex, nofollow`.

## Onde trocar o conteúdo

Todo texto e dado variável está em `src/data/`. Valor não confirmado aparece como `[A CONFIRMAR]` (`TBC` em `src/lib/placeholder.ts`) e a interface o renderiza com borda tracejada.

| Conteúdo | Arquivo |
| --- | --- |
| Contatos, CNPJ, indicadores, links de agendamento e dossiê | `src/data/company.ts` |
| Capa, headlines e textos de cada slide, vídeos | `src/data/content.ts` |
| Ordem dos slides | `src/slides.tsx` (deve seguir `src/data/screens.ts`; há teste) |
| Logo | `src/assets/logo-srcb.png` (branca; escurecida via CSS no fundo claro) |
| Frentes técnicas (slides 8–11), fotos, normas, mini cases | `src/data/services.ts` |
| Zonas do mapa da operação | `src/data/facility.ts` |
| Segurança e referências a NRs (`validated: false` até validação) | `src/data/safety.ts` |
| ARTs (slots `placeholder: true`) | `src/data/arts.ts` |
| Cases e fotos antes/depois | `src/data/cases.ts` |
| Sistemas do ambiente aeroportuário | `src/data/airport.ts` |

Mídia: colocar arquivos em `public/media/` e apontar o caminho (ex.: `video.src = '/media/institucional.mp4'`). Enquanto `src` for `null`, o placeholder técnico é exibido.

## Estrutura

```
src/
  components/
    deck/        Deck (palco, navegação), DeckControls, DeckIndex, GraphLayer
    layout/      Screen (slide com cabeçalho e rodapé de folha)
    navigation/  TopBar, MobileDrawer, MobileCTA, ProgressBar (modo mobile)
    motion/      Reveal, WordReveal
    ui/          Button, Headline, Indicator, PhotoSlot, Pending
    technical/   SystemGraph (slides 5→6), HotspotMap, desenhos SVG, VideoPlayer, ART
    cases/       CaseStudyView, BeforeAfter
  sections/      um componente por slide (FrontScreen gera as quatro frentes)
  data/          conteúdo
  hooks/         slide ativo, modo de apresentação, diálogo acessível
  lib/           navegação do deck (pura e testada), motion, placeholder
```

## Decisões técnicas

- **Slides em palco fixo**: cada slide é desenhado em 1600×900 e escalado, como um arquivo de apresentação; o layout não muda entre monitores. Ao mudar conteúdo, confira no navegador se o slide continua cabendo no palco.
- **Transição 5→6**: o grafo fica numa camada acima dos slides 5 e 6 e se reorganiza do estado fragmentado para o núcleo único, sem trocar de componente.
- **Framer Motion com `LazyMotion` + `m`** e `MotionConfig reducedMotion="user"`: com `prefers-reduced-motion`, transformações viram fades.
- **GSAP** instalado para a Fase 2 (timelines com scrub); ainda não importado, portanto fora do bundle.
