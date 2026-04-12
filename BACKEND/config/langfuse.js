import { Langfuse } from 'langfuse';

// Langfuse — observabilidad de agentes POLARIS, AURORA, NAVIGATOR
// Variables en .env:
//   LANGFUSE_SECRET_KEY=sk-lf-...
//   LANGFUSE_PUBLIC_KEY=pk-lf-...
//   LANGFUSE_HOST=https://cloud.langfuse.com  (o self-hosted)

let langfuse = null;

export function getLangfuse() {
  if (!langfuse) {
    langfuse = new Langfuse({
      secretKey: process.env.LANGFUSE_SECRET_KEY,
      publicKey: process.env.LANGFUSE_PUBLIC_KEY,
      baseUrl: process.env.LANGFUSE_HOST || 'https://cloud.langfuse.com',
    });
  }
  return langfuse;
}

/**
 * Crea una traza para un ciclo completo de generación.
 * Uso: const trace = createTrace('generate-pbip', { userId, projectId })
 */
export function createTrace(name, metadata = {}) {
  return getLangfuse().trace({ name, metadata });
}

/**
 * Registra una generación de agente dentro de una traza.
 * Uso: const span = createGeneration(trace, 'POLARIS', { input, model })
 */
export function createGeneration(trace, agentName, { input, model, output } = {}) {
  return trace.generation({
    name: agentName,
    model: model || process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
    input,
    output,
  });
}
