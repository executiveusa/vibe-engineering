export type ConsequenceLevel = 'low' | 'medium' | 'high';
export type ProjectMode = 'greenfield' | 'brownfield' | 'discovery' | 'recovery' | 'public-release';

export interface ContextRequest {
  agent?: Record<string, unknown>;
  project?: { repository?: string; mode?: ProjectMode };
  task?: {
    type?: string;
    requestedAction?: 'inspect' | 'software-change' | 'public-release' | 'destructive-change' | 'content-change' | 'security-review';
    consequenceLevel?: ConsequenceLevel;
  };
  scope?: { allowed?: string[]; prohibited?: string[] };
}

export interface ArtifactSummary {
  id: string;
  kind: string;
  version: string;
  status: 'approved';
  precedence: number;
  title: string;
  sourcePath: string;
  summary: string;
  contentHash: string;
}

export interface Manifest {
  schemaVersion: string;
  compilerVersion: string;
  sourceCommit: string;
  bundleHash: string;
  artifacts: ArtifactSummary[];
}

export class VibeTruthClient {
  constructor(options: { baseUrl: string; fetchImpl?: typeof fetch });
  manifest(): Promise<Manifest>;
  truth(id: string): Promise<{ bundleHash: string; artifact: Record<string, unknown> }>;
  workflow(id: string): Promise<{ bundleHash: string; workflow: Record<string, unknown> }>;
  resolveContext(input: ContextRequest): Promise<Record<string, unknown>>;
}
