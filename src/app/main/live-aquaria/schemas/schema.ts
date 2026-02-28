import { z } from 'zod';

export const userSchema = z.object({
	customerId: z.string().min(1, 'Customer Id is required'),
	customerName: z.string().min(1, 'Customer Name is required'),
	mobile: z.string().min(1, 'Mobile is required'),
	email: z.string().min(1, 'Email is required'),
	city: z.string().min(1, 'City is required'),
	state: z.string().min(1, 'State is required'),
	country: z.string().min(1, 'Country is required')
});

export type UserSchema = z.infer<typeof userSchema>;
