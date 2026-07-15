import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    // Peers stay external; seam + facets are bundled deps but resolved at runtime.
    external: [
        'react',
        'react-dom',
        '@tanstack/react-query',
        'lucide-react',
        '@rjsf/core',
        '@rjsf/shadcn',
        '@rjsf/utils',
        '@rjsf/validator-ajv8',
        '@schemastud/seam',
        '@schemastud/facets',
    ],
});
