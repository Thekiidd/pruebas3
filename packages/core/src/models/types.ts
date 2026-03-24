import type { BaseModelAdapter } from './base.js';

export interface ModelRegistration {
  provider: string;
  adapter: BaseModelAdapter;
}

export interface ResolvedModel {
  provider: string;
  model: string;
  adapter: BaseModelAdapter;
}
