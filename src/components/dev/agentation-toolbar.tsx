import { Agentation } from 'agentation';

/**
 * Dev/staging-only Agentation visual-feedback toolbar.
 *
 * Renders ONLY on staging or localhost (hostname gate) so it can NEVER appear on
 * production (plantathome.in). The toolbar lets you click/annotate elements; with
 * `endpoint` set it syncs annotations to the local `agentation-mcp server`
 * (http://localhost:4747), which exposes them to the coding agent via MCP.
 *
 * Loaded ssr:false from _app, so window/location are always available here.
 */
export default function AgentationToolbar() {
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  const allowed =
    host.includes('staging') || host === 'localhost' || host === '127.0.0.1';

  if (!allowed) return null;

  return <Agentation endpoint="http://localhost:4747" />;
}
