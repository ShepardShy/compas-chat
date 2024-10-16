export const useMyFetch = (request, opts) => {
	return useFetch(`https://opt6.compas.pro/${request}`, {
		...opts,
		headers: {
			Authorization: "Bearer " + "0vNsh0NrXyQjo75HSNzZJIkZYn6ss1dCh8BXx9boBBQVSDaeu1UgbZYPoZcA",
		},
	});
};
