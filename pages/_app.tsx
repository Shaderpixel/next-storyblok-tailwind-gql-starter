import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { storyblokInit, apiPlugin } from '@storyblok/react';
import { Feature, Grid, Teaser, Page } from '../components';
import { Inter } from '@next/font/google';
import { ApolloProvider } from '@apollo/client';
import { draftClient } from './../utils/apollo-client';

export const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter-vf',
	axes: ['slnt'],
});

const components = {
	feature: Feature,
	grid: Grid,
	teaser: Teaser,
	page: Page,
};

storyblokInit({
	accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
	use: [apiPlugin], // describe what Storyblok features to use
	apiOptions: { region: 'us' }, // region is needed if space is created in US
	components,
});

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ApolloProvider client={draftClient}>
			<main className={`${inter.variable} u-font-sans`}>
				<Component {...pageProps} />
			</main>
		</ApolloProvider>
	);
}
