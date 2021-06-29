/**
 * A Getter method to get the json file
 *
 * @param path where the file is located in public
 * @returns the json object
 */
export const get = async <T>(path: string): Promise<T[]> => {
	const data = await fetch(path, {
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	});
	const json = await data.json();
	return json;
};

/**
 *
 * @param fileName the filename in datafiles
 * @returns the string with the datafiles path
 */
export const dataFilePath = (fileName: string) => `datafiles/${fileName}`;
