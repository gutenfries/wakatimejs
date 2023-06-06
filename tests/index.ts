import axios from 'axios';

import { WakaTime, WakaTimeAPIQuery, WakaTimeInsightType, WakaTimeSummaryRange, WakaTimeTimeRange } from '../src/index';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const BASE_URL = 'https://wakatime.com/api/v1';

describe('WakaTime', () => {
	let wakaTime: WakaTime;
	const apiKey = 'YOUR_API_KEY';

	beforeEach(() => {
		wakaTime = new WakaTime(apiKey);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('setAPIKey', () => {
		it('should set the API key', () => {
			const newApiKey = 'NEW_API_KEY';
			wakaTime.setAPIKey(newApiKey);
			expect(wakaTime['apiKey']).toBe(newApiKey);
		});
	});

	describe('getApiOptions', () => {
		it('should return the API options with query', () => {
			const path = '/test';
			const query: WakaTimeAPIQuery = {
				start: '2023-01-01',
				end: '2023-01-07',
			};

			const expectedOptions = {
				url: `${BASE_URL}${path}?start=${query.start}&end=${query.end}`,
				headers: {
					Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
				},
			};

			expect(wakaTime['getApiOptions'](path, query)).toEqual(expectedOptions);
		});

		it('should return the API options without query', () => {
			const path = '/test';

			const expectedOptions = {
				url: `${BASE_URL}${path}`,
				headers: {
					Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
				},
			};

			expect(wakaTime['getApiOptions'](path)).toEqual(expectedOptions);
		});

		it('should throw an error if no API key is set', () => {
			wakaTime = new WakaTime();

			expect(() => wakaTime['getApiOptions']('/test')).toThrowError('No API key set');
		});
	});

	describe('get', () => {
		const url = 'https://example.com/api';
		const headers = { Authorization: 'Bearer TOKEN' };
		const response = { data: { key: 'value' } };

		it('should send a GET request and return the JSON response', async () => {
			mockedAxios.get.mockResolvedValue(response);

			const result = await wakaTime['get'](url, headers);

			expect(mockedAxios.get).toHaveBeenCalledWith(url, { headers });
			expect(result).toEqual(response.data);
		});

		it('should throw an error if the URL or headers are missing', async () => {
			await expect(wakaTime['get'](undefined, headers)).rejects.toThrowError('Missing url or headers');
			await expect(wakaTime['get'](url, undefined)).rejects.toThrowError('Missing url or headers');
			await expect(wakaTime['get'](undefined, undefined)).rejects.toThrowError('Missing url or headers');
		});
	});

	describe('getCurrentUser', () => {
		it("should retrieve the current user's information", async () => {
			const expectedResponse = { user: { name: 'John Doe' } };

			mockedAxios.get.mockResolvedValue({ data: expectedResponse });

			const result = await wakaTime.getCurrentUser();

			expect(mockedAxios.get).toHaveBeenCalledWith('${BASE_URL}/users/current', {
				headers: {
					Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
				},
			});
			expect(result).toEqual(expectedResponse);
		});
	});

	describe('getStats', () => {
		it("should retrieve the user's statistics for the specified time range (default: Last7Days)", async () => {
			const range = WakaTimeTimeRange.Last7Days;
			const expectedResponse = { stats: { duration: 3600 } };

			mockedAxios.get.mockResolvedValue({ data: expectedResponse });

			const result = await wakaTime.getStats(range);

			expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/users/current/stats/${range}`, {
				headers: {
					Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
				},
			});
			expect(result).toEqual(expectedResponse);
		});
	});

	describe('getSummaries', () => {
		it('should retrieve the summaries for the specified date range', async () => {
			const range: WakaTimeSummaryRange = {
				start: '2023-01-01',
				end: '2023-01-07',
			};
			const expectedResponse = { summaries: [{ date: '2023-01-01', total_seconds: 3600 }] };

			mockedAxios.get.mockResolvedValue({ data: expectedResponse });

			const result = await wakaTime.getSummaries(range);

			expect(mockedAxios.get).toHaveBeenCalledWith(
				`${BASE_URL}/users/current/summaries?start=${range.start}&end=${range.end}`,
				{
					headers: {
						Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
					},
				}
			);
			expect(result).toEqual(expectedResponse);
		});

		it('should retrieve the summaries for a single date if start and end are the same', async () => {
			const range: WakaTimeSummaryRange = {
				start: '2023-01-01',
				end: '2023-01-01',
			};
			const expectedResponse = { summaries: [{ date: '2023-01-01', total_seconds: 3600 }] };

			mockedAxios.get.mockResolvedValue({ data: expectedResponse });

			const result = await wakaTime.getSummaries(range);

			expect(mockedAxios.get).toHaveBeenCalledWith(
				`${BASE_URL}/users/current/summaries?start=${range.start}&end=${range.end}`,
				{
					headers: {
						Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
					},
				}
			);
			expect(result).toEqual(expectedResponse);
		});
	});

	describe('getDurations', () => {
		it('should retrieve the duration data for the specified date', async () => {
			const date = '2023-01-01';
			const expectedResponse = { durations: [{ project: 'MyProject', duration: 3600 }] };

			mockedAxios.get.mockResolvedValue({ data: expectedResponse });

			const result = await wakaTime.getDurations(date);

			expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/users/current/durations?date=${date}`, {
				headers: {
					Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
				},
			});
			expect(result).toEqual(expectedResponse);
		});
	});

	describe('getInsights', () => {
		it('should retrieve the insights data for the specified type and date', async () => {
			const type = WakaTimeInsightType.Languages;
			const date = '2023-01-01';
			const expectedResponse = { insights: [{ name: 'JavaScript', total_seconds: 3600 }] };

			mockedAxios.get.mockResolvedValue({ data: expectedResponse });

			const result = await wakaTime.getInsights(type, date);

			expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/users/current/insights/${type}?date=${date}`, {
				headers: {
					Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
				},
			});
			expect(result).toEqual(expectedResponse);
		});

		it('should retrieve the insights data for the specified type without date', async () => {
			const type = WakaTimeInsightType.Projects;
			const expectedResponse = { insights: [{ name: 'MyProject', total_seconds: 3600 }] };

			mockedAxios.get.mockResolvedValue({ data: expectedResponse });

			const result = await wakaTime.getInsights(type);

			expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/users/current/insights/${type}`, {
				headers: {
					Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
				},
			});
			expect(result).toEqual(expectedResponse);
		});
	});

	describe('toURLQuery', () => {
		it('should convert a query object to a URL query string', () => {
			const query: WakaTimeAPIQuery = {
				start: '2023-01-01',
				end: '2023-01-07',
			};
			const expectedQueryString = '?start=2023-01-01&end=2023-01-07';

			expect(wakaTime['toURLQuery'](query)).toBe(expectedQueryString);
		});

		it('should return an empty string if the query object is empty', () => {
			const query: WakaTimeAPIQuery = {};

			expect(wakaTime['toURLQuery'](query)).toBe('');
		});
	});

	describe('getDateString', () => {
		it('should format a date object to a string in the format "YYYY-MM-DD"', () => {
			const date = new Date('2023-01-01');
			const dateString = wakaTime['getDateString'](date);

			expect(dateString).toBe('2023-01-01');
		});

		it('should return the input string if it is already a string', () => {
			const dateString = '2023-01-01';
			const result = wakaTime['getDateString'](dateString);

			expect(result).toBe(dateString);
		});
	});

	describe('formatDate', () => {
		it('should format a date object to a string in the format "YYYY-MM-DD"', () => {
			const date = new Date('2023-01-01');
			const formattedDate = wakaTime['formatDate'](date);

			expect(formattedDate).toBe('2023-01-01');
		});
	});
});
