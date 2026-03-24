import { describe, it, expect } from 'vitest';
import { FileSystemTool } from '../../src/tools/filesystem.js';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('FileSystemTool', () => {
  const workdir = tmpdir();
  const tool = new FileSystemTool(workdir);

  it('should write and read a file', async () => {
    const writeResult = await tool.actions['write'].handler({
      path: 'test-opendev.txt',
      content: 'Hello OpenDev!',
      createDirs: true,
    });
    expect(writeResult.success).toBe(true);

    const readResult = await tool.actions['read'].handler({ path: 'test-opendev.txt' });
    expect(readResult.success).toBe(true);
    expect(readResult.output).toBe('Hello OpenDev!');
  });

  it('should list directory', async () => {
    const result = await tool.actions['list'].handler({ path: '.', recursive: false });
    expect(result.success).toBe(true);
    expect(typeof result.output).toBe('string');
  });

  it('should block path traversal', async () => {
    await expect(
      tool.actions['read'].handler({ path: '../../etc/passwd' })
    ).rejects.toThrow('Path traversal detected');
  });
});
