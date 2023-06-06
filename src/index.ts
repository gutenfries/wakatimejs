import axios, { AxiosRequestConfig } from 'axios';

/**
 * Represents the time range options for retrieving WakaTime stats.
 */
export enum WakaTimeTimeRange {
	Last7Days = 'last_7_days',
	Last30Days = 'last_30_days',
	Last6Months = 'last_6_months',
	LastYear = 'last_year',
	AllTime = 'all_time',
}

/**
 * Represents the insight types for retrieving WakaTime insights.
 */
export enum WakaTimeInsightType {
	Languages = 'languages',
	Editors = 'editors',
	Projects = 'projects',
	Categories = 'categories',
}

/**
 * Represents the query parameters for the WakaTime API.
 */
export interface WakaTimeAPIQuery {
	start?: string;
	end?: string;
	date?: string;
}

/**
 * Represents the date range for retrieving WakaTime summaries.
 */
export interface WakaTimeSummaryRange {
	start: string | Date;
	end: string | Date;
}

/**
 * Represents the WakaTime API client.
 */
export class WakaTime {
	private readonly BASE_URL = 'https://wakatime.com/api/v1';
	private apiKey: string | null = null;

	/**
	 * Creates an instance of the WakaTime API client.
	 * @param apiKey The API key to authenticate requests.
	 */
	constructor(apiKey?: string) {
		if (apiKey) this.apiKey = apiKey;
	}
	/**
	 * Sets the API key to authenticate requests.
	 * @param apiKey The API key to authenticate requests.
	 * @returns The WakaTime API client.
	 */
	setAPIKey(apiKey: string): WakaTime {
		this.apiKey = apiKey;
		return this;
	}

	/**
	 * Retrieves the Axios request options for making API requests.
	 * @param path The API path.
	 * @param query The query parameters.
	 * @returns The Axios request options.
	 * @throws An error if no API key is set.
	 */
	private getApiOptions(path: string, query?: WakaTimeAPIQuery): AxiosRequestConfig {
		if (!this.apiKey) {
			throw new Error('No API key set');
		}

		const queryString = query ? this.toURLQuery(query) : '';
		return {
			url: `${this.BASE_URL}${path}${queryString}`,
			headers: {
				Authorization: `Basic ${Buffer.from(this.apiKey).toString('base64')}`,
			},
		};
	}

	/**
	 * Sends a GET request to the specified URL with the provided headers.
	 * @param url The URL to send the request to.
	 * @param headers The headers to include in the request.
	 * @returns A promise that resolves to the JSON response.
	 * @throws An error if the URL or headers are missing.
	 */
	private async get(url: AxiosRequestConfig['url'], headers: AxiosRequestConfig['headers']): Promise<JSON> {
		if (!url || !headers) {
			throw new Error('Missing url or headers');
		}
		const response: JSON = (await axios.get(url, { headers })).data;
		return response;
	}

	/**
	 * Retrieves the current user's information.
	 * @returns A promise that resolves to the user's JSON data.
	 */
	async getCurrentUser(): Promise<JSON> {
		const { url, headers } = this.getApiOptions('/users/current');
		return this.get(url, headers);
	}

	/**
	 * Retrieves the user's statistics for the specified time range.
	 * @param range The time range for the statistics (default: Last7Days).
	 * @returns A promise that resolves to the statistics JSON data.
	 */
	async getStats(range: WakaTimeTimeRange = WakaTimeTimeRange.Last7Days): Promise<JSON> {
		const { url, headers } = this.getApiOptions(`/users/current/stats/${range}`);
		return this.get(url, headers);
	}

	/**
	 * Retrieves the summaries for the specified date range.
	 * @param range The date range for the summaries.
	 * @returns A promise that resolves to the summaries JSON data.
	 */
	async getSummaries(range: WakaTimeSummaryRange): Promise<JSON> {
		let start = '';
		let end = '';

		if ('start' in range && 'end' in range) {
			start = this.getDateString(range.start);
			end = this.getDateString(range.end);
		} else {
			start = this.getDateString(range);
			end = this.getDateString(range);
		}

		const { url, headers } = this.getApiOptions('/users/current/summaries', { start, end });
		return this.get(url, headers);
	}

	/**
	 * Retrieves the duration data for the specified date.
	 * @param date The date for the duration data.
	 * @returns A promise that resolves to the duration JSON data.
	 */
	async getDurations(date: string | Date): Promise<JSON> {
		const { url, headers } = this.getApiOptions('/users/current/durations', {
			date: this.getDateString(date),
		});
		return this.get(url, headers);
	}

	/**
	 * Retrieves the insights data for the specified type and date.
	 * @param type The type of insights to retrieve.
	 * @param date The optional date for the insights.
	 * @returns A promise that resolves to the insights JSON data.
	 */
	async getInsights(type: WakaTimeInsightType, date?: string | Date): Promise<JSON> {
		const path = date
			? `/users/current/insights/${type}?date=${this.getDateString(date)}`
			: `/users/current/insights/${type}`;

		const { url, headers } = this.getApiOptions(path);
		return this.get(url, headers);
	}

	/**
	 * Converts a query object to a URL query string.
	 * @param query The query object.
	 * @returns The URL query string.
	 */
	private toURLQuery(query: WakaTimeAPIQuery): string {
		return (
			'?' +
			Object.entries(query)
				.map(([key, value]) => `${key}=${value}`)
				.join('&')
		);
	}

	/**
	 * Formats a date object to a string in the format "YYYY-MM-DD".
	 * @param date The date object to format.
	 * @returns The formatted date string.
	 */
	private getDateString(date: string | Date): string {
		if (date instanceof Date) {
			return this.formatDate(date);
		}
		return date;
	}

	/**
	 * Formats a date object to a string in the format "YYYY-MM-DD".
	 * @param date The date object to format.
	 * @returns The formatted date string.
	 */
	private formatDate(date: Date): string {
		const year = date.getFullYear().toString();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');
		return `${year}-${month}-${day}`;
	}
}
