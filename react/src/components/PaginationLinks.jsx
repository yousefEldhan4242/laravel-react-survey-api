export default function PaginationLinks({ meta, onPageClick }) {
    const onLinkClick = (e, url) => {
        e.preventDefault();
        if (!url) return;
        onPageClick(url);
    };
    return (
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 shadow-md sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <a
                    href="#"
                    onClick={(e) => onLinkClick(e, meta.links[0].url)}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Previous
                </a>
                <a
                    href="#"
                    onClick={(e) => onLinkClick(e, meta.links[meta.links.length - 1].url)}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Next
                </a>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{meta.from}</span> to <span className="font-medium">{meta.to}</span> of{' '}
                        <span className="font-medium">{meta.total}</span> results
                    </p>
                </div>
                <div>
                    {meta.total > meta.per_page && (
                        <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-xs">
                            {meta.links &&
                                meta.links.map((link, ind) => (
                                    <a
                                        key={ind}
                                        onClick={(e) => onLinkClick(e, link.url)}
                                        href="#"
                                        aria-current="page"
                                        className={
                                            'relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline-2 ' +
                                            (link.active
                                                ? 'z-10 bg-indigo-600 text-white focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                                : 'text-gray-900 inset-ring inset-ring-gray-300 hover:bg-gray-50 focus:outline-offset-0') +
                                            (ind == 0 ? 'rounded-l-md' : '') +
                                            (ind == (meta.links && meta.links.length - 1) ? 'rounded-r-md' : '') +
                                            (!link.url ? 'opacity-30' : '')
                                        }
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    ></a>
                                ))}
                        </nav>
                    )}
                </div>
            </div>
        </div>
    );
}
