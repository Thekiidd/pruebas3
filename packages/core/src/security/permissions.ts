/**
 * Permission system for controlling what actions the agent can perform.
 */
export type Permission =
  | 'filesystem:read'
  | 'filesystem:write'
  | 'shell:exec'
  | 'web:search'
  | 'git:read'
  | 'git:write'
  | 'browser:navigate';

export interface PermissionPolicy {
  allowed: Permission[];
  requireConfirmation?: Permission[];
}

export const DEFAULT_POLICY: PermissionPolicy = {
  allowed: [
    'filesystem:read',
    'filesystem:write',
    'shell:exec',
    'web:search',
    'git:read',
    'git:write',
    'browser:navigate',
  ],
  requireConfirmation: ['shell:exec', 'filesystem:write'],
};

export const SAFE_POLICY: PermissionPolicy = {
  allowed: ['filesystem:read', 'web:search', 'git:read'],
  requireConfirmation: [],
};

export class PermissionManager {
  private policy: PermissionPolicy;

  constructor(policy: PermissionPolicy = DEFAULT_POLICY) {
    this.policy = policy;
  }

  isAllowed(permission: Permission): boolean {
    return this.policy.allowed.includes(permission);
  }

  requiresConfirmation(permission: Permission): boolean {
    return this.policy.requireConfirmation?.includes(permission) ?? false;
  }

  getPolicy(): PermissionPolicy {
    return { ...this.policy };
  }
}
