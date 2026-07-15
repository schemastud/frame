import { ListFilters, useListFilters } from '@schemastud/facets';
import { useFrameInjection } from './context';
import { resolveColumns } from './resolveColumns';
import {
    DefaultCell,
    DefaultEmpty,
    DefaultLoading,
    DefaultPagination,
    DefaultTable,
    DefaultToolbar,
} from './slots/defaults';
import { useResourceList } from './data';
import type { ListShellProps, Row } from './types';

/**
 * The list surface, generalized from the app substrate. Renders any resource from
 * its schema + host-supplied columns with no per-resource UI code: the facets bar
 * is fully schema-driven (rides FilterSchemaController where a filter schema
 * exists), pagination is transport-driven, columns resolve through the columns seam.
 */
export function ListShell({ resource, columns, onOpen, slots }: ListShellProps) {
    const { useUrlState, can } = useFrameInjection();
    const filters = useListFilters(resource);
    const [searchParams, setSearchParams] = useUrlState();

    const query = useResourceList(resource, filters.requestParams);

    const resolvedColumns = resolveColumns(resource, filters.schema, columns);
    const canCreate = can('create', resource);

    const Toolbar = slots?.Toolbar ?? DefaultToolbar;
    const Filters = slots?.Filters ?? (() => <ListFilters {...filters} />);
    const Table = slots?.Table ?? DefaultTable;
    const Cell = slots?.Cell ?? DefaultCell;
    const RowActions = slots?.RowActions;
    const Empty = slots?.Empty ?? DefaultEmpty;
    const Loading = slots?.Loading ?? DefaultLoading;
    const Pagination = slots?.Pagination ?? DefaultPagination;

    const page = Number(searchParams.get('page') ?? '1');
    const onPageChange = (next: number) =>
        setSearchParams((prev) => {
            prev.set('page', String(next));
            return prev;
        });

    const rows: Row[] = query.data?.data ?? [];

    return (
        <div data-frame-shell="list">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <Filters />
                <Toolbar
                    resource={resource}
                    canCreate={canCreate}
                    onNew={onOpen ? () => onOpen({ id: null }) : undefined}
                />
            </div>

            {query.isLoading ? (
                <Loading />
            ) : rows.length === 0 ? (
                <Empty />
            ) : (
                <>
                    <Table
                        columns={resolvedColumns}
                        rows={rows}
                        onOpen={onOpen}
                        Cell={Cell}
                        RowActions={RowActions}
                    />
                    <Pagination
                        page={query.data?.page ?? page}
                        perPage={query.data?.perPage ?? rows.length}
                        total={query.data?.total ?? rows.length}
                        onPageChange={onPageChange}
                    />
                </>
            )}
        </div>
    );
}
