import { AxiosError, AxiosResponse } from 'axios';

// Define the structure for the response data
interface ExtendedAxiosResponseData {
	message?: string; // Optional message field
}

// Extend AxiosResponse to include ExtendedAxiosResponseData
interface ExtendedAxiosResponse extends AxiosResponse {
	data: ExtendedAxiosResponseData;
}

// Extend the AxiosError interface to use the ExtendedAxiosResponse
export default interface ExtendedAxiosError extends AxiosError {
	response?: ExtendedAxiosResponse; // Make the response field optional, like AxiosError
}
