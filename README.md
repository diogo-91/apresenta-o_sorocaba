# Sorocaba Motores — Apresentação técnica

Apresentação executiva em slides (20 slides, 8 atos). React 19 + Vite + TypeScript + Tailwind 4 + Framer Motion.

- **Desktop (≥1024px):** modo slides. Palco 16:9 de 1600×900 escalado para a tela. Avança com → ↓ PageDown espaço, roda do mouse, swipe ou controles no canto; Home/End; índice; tela cheia. Cada slide tem endereço próprio (`#metodo`). Alguns slides têm **passos internos** (quem somos, fragmentação, modelo, mapa, método, ARTs, cases, grandes operações): cada avanço move a cena antes de trocar de slide.
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

## Camada 3D (WebGL)

Three.js + React Three Fiber + drei, carregados só depois que a página fica ociosa (chunk próprio).

- **Abertura:** sem 3D. Vídeo real em tela cheia (`public/videos/hero.mp4`, pôster `hero-poster.jpg`, apontados em `hero.media` de `content.ts`), mudo, em loop, sem controles; um único `<video>`, que só baixa depois que a página fica ociosa e pausa fora da tela. Entrada em GSAP; no deck, um avanço já troca de slide; no mobile, os primeiros 30% de rolagem da seção aproximam o vídeo (escala 1,04), escurecem e esmaecem o texto. Com movimento reduzido, só fades e nenhum movimento ligado ao scroll.
- **Mapa da operação:** a mesma instalação em vista isométrica, 7 etapas (estrutura → cobertura → claraboias → elétrica → mecânica → reservatórios → espaços confinados). Grupos inativos esmaecem; o ativo recebe luz, hotspot com linha e rótulo. Clique/toque nos hotspots destaca a área.
- **Mapa no deck e no mobile:** no deck, o mapa usa um canvas sobre o palco (`Stage3DLayer`). No mobile, cada cena é embutida na seção e as etapas do mapa acompanham o scroll (cena fixa por sticky, sem sequestrar a rolagem).
- **Grupos nomeados:** `structure`, `roof`, `skylights`, `electrical`, `mechanical`, `utilities`, `reservoir`, `confined`.
- **Modelos GLB:** opcionais em `public/models/` (`industrial-facility.glb`, `airport-terminal.glb`), ativados em `src/data/models.ts`. O GLB precisa ter os mesmos nomes de grupo. Para Draco, copie `node_modules/three/examples/jsm/libs/draco/gltf/` para `public/draco/`; Meshopt já funciona.
- **Proteções:** sem WebGL acelerado (renderização por software) a apresentação usa a versão 2D; se o aparelho não sustentar ~22 FPS, a cena congela num quadro estático; com movimento reduzido, nada reage ao ponteiro e a câmera não viaja. `?force3d` força o 3D para testes.
- **Orçamento atual:** ~2,4 mil triângulos e 27 draw calls (peças estáticas fundidas por grupo e material); DPR máx. 1,75 no desktop e 1,25 no mobile; sem sombras e spot no mobile.

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
    technical/   SystemGraph, AirportStage, desenhos e cenas SVG, VideoPlayer, ART
    three/       SceneCanvas, IndustrialSystem3D, IndustrialScene, ReactiveCamera, ReactiveLighting, TechnicalHotspot, Stage3DLayer (deck), InlineScene (mobile),
                 FrameGuard, WebGLFallback
    cases/       CaseStudyView, BeforeAfter
  sections/      um componente por slide (FrontScreen gera as quatro frentes)
  data/          conteúdo
  hooks/         slide ativo, passo, modo de apresentação, cenas (GSAP), diálogo acessível
  lib/           lógica pura e testada: navegação do deck, grafo quadro a quadro, câmera,
                 roteiro de câmera 3D por slide/etapa e limites de inclinação (lib/three)
```

## Decisões técnicas

- **Slides em palco fixo**: cada slide é desenhado em 1600×900 e escalado; o layout não muda entre monitores. Ao mudar conteúdo, confira no navegador se o slide continua cabendo no palco.
- **Uma linha do tempo, duas entradas**: as cenas são funções puras do progresso (0–1). No deck, o GSAP interpola o progresso entre passos; no mobile, o ScrollTrigger liga o progresso ao scroll.
- **Grafo 5→6**: camada persistente acima dos slides; os nós surgem, as conexões crescem, a câmera aproxima e tudo converge para o núcleo (`lib/systemGraph.ts`).
- **Tema escuro por seção** via variáveis CSS (`.theme-dark`); a logo se adapta sozinha.
- **Fontes servidas pelo projeto** (`public/fonts`, licença OFL incluída), com preload no HTML.
- **Divisão de código**: cada seção é um chunk; o deck pré-carrega os slides vizinhos.
- **Movimento reduzido**: transformações viram fades, a cortina vira fade e o cursor customizado não aparece.
