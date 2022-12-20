import Head from 'next/head';
import styles from '../styles/Home.module.css';

import { useStoryblokState, getStoryblokApi, StoryblokComponent } from '@storyblok/react';
import { StoryProp } from '../types';
import { GetStaticPropsContext } from 'next';
import { gql } from '@apollo/client';
import { draftClient, publishedClient } from '../utils/apollo-client';

export default function Home({ story, preview }: StoryProp) {
	story = useStoryblokState(story, {}, preview); // enables live visual editing and preview mode

	return (
		<div className={styles.container}>
			<Head>
				<title>Create Next App</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<header className="u-mb-2 u-border-b-2 u-border-sky-500">
				<h1>{story?.name ? story.name : 'My Site'}</h1>
			</header>

			<StoryblokComponent blok={story.content} />
		</div>
	);
}

export async function getStaticProps(context: GetStaticPropsContext) {
	// slug should match SB slug otherwise you have to use SB real path field
	let slug = 'storyblok-sample-page';

	const queryParams = {
		query: gql`
			query PageData($id: ID!) {
				PageItem(id: $id) {
					id
					slug
					name
					content {
						_uid
						component
						body
					}
				}
			}
		`,
		variables: {
			id: slug,
		},
	};

	const { data, loading, error } = context.preview
		? await draftClient.query(queryParams)
		: await publishedClient.query(queryParams);

	return {
		props: {
			story: data ? data?.PageItem : false,
			key: data ? data?.PageItem.id : false,
			preview: context.preview || false,
		},
		revalidate: 3600, // revalidate every hour
	};
}
