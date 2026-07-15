import type { ResolveColumns } from './types';

/**
 * The columns seam (DECISION A). v1 strategy: host-supplied FrameColumn[] IS the
 * columns — there is nothing to default from yet (columns are not backend-derivable
 * until the x-column reflection strategy graduates, out of scope). Choosing this
 * seam now fixes where that future derivation slots in without changing the shell
 * contract: a graduated strategy would derive columns from the schema and let the
 * host-supplied array override.
 */
export const resolveColumns: ResolveColumns = (_resource, _schema, hostColumns): ReturnType<ResolveColumns> =>
    hostColumns;
