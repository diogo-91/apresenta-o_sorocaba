# Sorocaba Motores — Apresentação técnica

Apresentação web executiva (17 telas, 8 atos). React 19 + Vite + TypeScript + Tailwind 4 + Framer Motion.

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
| Contatos, CNPJ, indicadores, logo, links de agendamento e dossiê | `src/data/company.ts` |
| Headlines e textos de cada tela, vídeo do hero e institucional | `src/data/content.ts` |
| Frentes técnicas (telas 7–10), fotos, normas, mini cases | `src/data/services.ts` |
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
    layout/      Screen (tela com metadados de folha)
    navigation/  TopBar, SideRail, MobileDrawer, MobileCTA, ProgressBar
    motion/      Reveal, WordReveal
    ui/          Button, Headline, Indicator, PhotoSlot, Pending
    technical/   SystemGraph (telas 4→5), HotspotMap, desenhos SVG, VideoPlayer, ART
    cases/       CaseStudyView, BeforeAfter
  sections/      uma seção por tela (TechnicalAreasSection gera as telas 7–10)
  data/          conteúdo
  hooks/         tela ativa, navegação por teclado, diálogo acessível
  lib/           navegação (pura e testada), motion, placeholder
```

## Decisões técnicas

- **Sem Lenis**: smooth scroll por JS conflita com `scroll-snap`. O snap é CSS (`proximity`, só ≥1024px) e a navegação por teclado (↑ ↓ PageUp PageDown) usa `nextScrollTarget`, que rola dentro de telas mais altas que o viewport antes de trocar de tela.
- **Transição 4→5**: as duas telas compartilham um palco `sticky` com o mesmo SVG; nós e linhas são interpolados pelo Framer Motion entre os estados fragmentado e centralizado.
- **Framer Motion com `LazyMotion` + `m`** e `MotionConfig reducedMotion="user"`: com `prefers-reduced-motion`, transformações viram fades.
- **GSAP** instalado para a Fase 2 (timelines com scrub); ainda não importado, portanto fora do bundle.
