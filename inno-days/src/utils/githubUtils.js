export const extractNextLink = (linkHeader) => {
    const nextLinkMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
    return  nextLinkMatch ? nextLinkMatch[1] : null;
};
