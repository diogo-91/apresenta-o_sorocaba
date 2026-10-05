# Sorocaba Motores — Apresentação técnica

Apresentação executiva em slides (20 slides, 8 atos). React 19 + Vite + TypeScript + Tailwind 4 + Framer Motion.

- **Desktop (≥1024px):** modo slides. Palco 16:9 de 1600×900 escalado para a tela. Avança com → ↓ PageDown espaço, roda do mouse, swipe ou controles no canto; Home/End; índice; tela cheia. Cada slide tem endereço próprio (`#metodo`). Alguns slides têm **passos internos** (fragmentação, modelo, mapa, método, ARTs, cases, grandes operações): cada avanço move a cena antes de trocar de slide.
- **Mobile:** os mesmos slides empilhados em rolagem vertical; as cenas com passos acompanham o scroll (GSAP ScrollTrigger). Cada slide só é montado quando se aproxima da tela.

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

Mídia: colocar arquivos em `public/media/` e apontar o caminho (ex.: `video.src = '/media/institucional.mp4'`, `hero.media.videoSrc`, `photo.src` de cada frente, `photo` de cada EPI em `safety.ts`). Enquanto `src` for `null`, aparece uma cena técnica desenhada com o aviso **foto a inserir**. Áudio ambiente: `ambient.audioSrc` em `content.ts` (o botão de som só aparece quando houver arquivo).

## Estrutura

```
src/
  components/
    deck/        Deck (palco, passos, navegação), DeckControls, DeckIndex, GraphLayer, SoundToggle
    flow/        Flow (modo mobile com montagem sob demanda)
    layout/      Screen (slide com cabeçalho e rodapé de folha)
    navigation/  TopBar, MobileDrawer, MobileCTA, ProgressBar (modo mobile)
    motion/      Reveal, WordReveal, StepReveal, Preloader, CustomCursor
    ui/          Headline, MediaFrame, Logo, Pending, PhotoSlot
    technical/   HeroScene, SystemGraph, AirportStage, desenhos e cenas SVG, VideoPlayer, ART
    cases/       CaseStudyView, BeforeAfter
  sections/      um componente por slide (FrontScreen gera as quatro frentes)
  data/          conteúdo
  hooks/         slide ativo, passo, modo de apresentação, cenas (GSAP), diálogo acessível
  lib/           lógica pura e testada: navegação do deck, grafo quadro a quadro, câmera
```

## Decisões técnicas

- **Slides em palco fixo**: cada slide é desenhado em 1600×900 e escalado; o layout não muda entre monitores. Ao mudar conteúdo, confira no navegador se o slide continua cabendo no palco.
- **Uma linha do tempo, duas entradas**: as cenas são funções puras do progresso (0–1). No deck, o GSAP interpola o progresso entre passos; no mobile, o ScrollTrigger liga o progresso ao scroll.
- **Grafo 5→6**: camada persistente acima dos slides; os nós surgem, as conexões crescem, a câmera aproxima e tudo converge para o núcleo (`lib/systemGraph.ts`).
- **Tema escuro por seção** via variáveis CSS (`.theme-dark`); a logo se adapta sozinha.
- **Fontes servidas pelo projeto** (`public/fonts`, licença OFL incluída), com preload no HTML.
- **Divisão de código**: cada seção é um chunk; o deck pré-carrega os slides vizinhos.
- **Movimento reduzido**: transformações viram fades, a cortina vira fade e o cursor customizado não aparece.
