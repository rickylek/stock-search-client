export interface News {
    source: string;
    publishedAt: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
}

export const EMPTY_NEWS: News = {
    source: '',
    publishedAt: '',
    title: '',
    description: '',
    url: '',
    urlToImage: '',
};
