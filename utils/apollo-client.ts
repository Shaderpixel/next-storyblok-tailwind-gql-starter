import { ApolloClient, ApolloLink, concat, HttpLink, InMemoryCache } from '@apollo/client';

const httpLink = new HttpLink({ uri: 'https://gapi-us.storyblok.com/v1/api' });

const authMiddleware = (sbParam: 'draft' | 'published') =>
	new ApolloLink((operation, forward) => {
		operation.setContext(({ headers = {} }) => ({
			headers: {
				...headers,
				token: process.env.STORYBLOK_ACCESS_TOKEN,
				version: sbParam,
			},
		}));
		return forward(operation);
	});

export const draftClient = new ApolloClient({
	cache: new InMemoryCache(),
	link: concat(authMiddleware('draft'), httpLink),
});

export const publishedClient = new ApolloClient({
	cache: new InMemoryCache(),
	link: concat(authMiddleware('published'), httpLink),
});
