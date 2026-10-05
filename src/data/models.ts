// Caminhos opcionais de modelos GLB em public/models/. Enquanto forem null, a versão procedural é usada.
// O GLB deve conter grupos nomeados: structure, roof, skylights, electrical, mechanical, utilities, reservoir, confined.
export const models = {
  facility: null as string | null,
  airport: null as string | null,
}
