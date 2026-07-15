import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { FacetsProvider } from '@schemastud/facets';
import { WidgetRegistryContext } from '@schemastud/seam';
import type { FrameInjection } from './types';

const FrameContext = createContext<FrameInjection | null>(null);

/**
 * One provider at the app root carrying the whole FrameInjection bundle. It also
 * wires the sub-contexts frame's shells lean on: facets' provider (transport +
 * primitives + URL-state, which useListFilters reads) and seam's WidgetRegistry
 * context (which SchemaForm resolves widgets through). A host sets this up once.
 */
export function FrameProvider({ value, children }: { value: FrameInjection; children: ReactNode }) {
    const facetsValue = useMemo(
        () => ({
            transport: value.transport,
            primitives: value.primitives,
            useUrlState: value.useUrlState,
        }),
        [value.transport, value.primitives, value.useUrlState],
    );

    return (
        <FrameContext.Provider value={value}>
            <FacetsProvider value={facetsValue}>
                <WidgetRegistryContext.Provider value={value.registry}>
                    {children}
                </WidgetRegistryContext.Provider>
            </FacetsProvider>
        </FrameContext.Provider>
    );
}

/** Read the injection bundle; throws if a frame shell renders outside a provider. */
export function useFrameInjection(): FrameInjection {
    const injection = useContext(FrameContext);
    if (!injection) {
        throw new Error(
            '@schemastud/frame: no FrameProvider found. Wrap your app in <FrameProvider value={{ transport, primitives, useUrlState, registry, schemaFetcher, can }}>.',
        );
    }
    return injection;
}
