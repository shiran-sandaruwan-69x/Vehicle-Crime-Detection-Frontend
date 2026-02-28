import { Button, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CustomFormTextField from 'src/app/common/FormComponents/CustomFormTextField';
import axios, { AxiosResponse } from 'axios';
import * as yup from 'yup';
import { SYSTEM_SETTINGS_REWARD_POINTS } from 'src/app/axios/services/AdminServices';
import OrdersLogTableSystemSettings from 'src/app/common/OrdersLogTableSystemSettings';
import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';

interface FormValues {
	is_active: number;
	value: string;
}

export interface RewardPointSettingsResponseInterface {
	id: number;
	label: string;
	category: string;
	value: string;
	is_active: number | boolean;
	logs: Log[];
}

export interface Log {
	id: number;
	action: string;
	created_at: string;
}

function RewardPointSettings() {
	// const [pageNo, setPageNo] = useState<number>(0);
	// const [pageSize, setPageSize] = useState<number>(5);
	// const [count] = useState<number>(100);
	const [loading, setLoading] = useState<boolean>(true);
	const [systemSettings, setSystemSettings] = useState<RewardPointSettingsResponseInterface>(null);

	useEffect(() => {
		fetchFreeShippingsSettings();
	}, []);

	const fetchFreeShippingsSettings = async () => {
		setLoading(true);
		try {
			const response: AxiosResponse<{
				data: RewardPointSettingsResponseInterface;
			}> = await axios.get(`${SYSTEM_SETTINGS_REWARD_POINTS}`);
			setSystemSettings(response.data.data);
		} catch (error: unknown) {
			toast('Error occurred while fetching Reward Points settings');
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateSystemSettings = async (values: FormValues) => {
		setLoading(true);
		try {
			const to_update_data = {
				value: values.value,
				is_active: Boolean(values?.is_active)
			};
			const response: AxiosResponse<{
				data: RewardPointSettingsResponseInterface;
			}> = await axios.put(`${SYSTEM_SETTINGS_REWARD_POINTS}`, to_update_data);
			setSystemSettings(response.data.data);
			toast.success('Reward Points settings updated successfully');
		} catch (error) {
			// error management
		} finally {
			setLoading(false);
		}
	};

	const schema = yup.object().shape({
		value: yup
			.number()
			.required('Reward Points is required')
			.max(100, 'Reward Points must be less than or equal to 100')
			.typeError('Reward Points must be a number')
			.positive('Reward Points must be a positive number')
	});

	return loading ? (
		<FuseLoading />
	) : (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="System Settings/Reward Points Settings" />

			<Formik
				initialValues={{
					value: systemSettings?.value,
					is_active: systemSettings?.is_active
				}}
				onSubmit={handleUpdateSystemSettings}
				validationSchema={schema}
			>
				{() => (
					<Form>
						<Grid
							container
							spacing={2}
							className="pt-[10px] pr-[30px] mx-auto"
						>
							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								lg={4}
								xl={3}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">Reward Point Percentage (%)</Typography>
								<CustomFormTextField
									name="value"
									id="value"
									type="number"
									placeholder=""
									disabled={false}
									// changeInput={changeArticleId}
								/>
								<Typography className="formTypography text-[10px] text-gray-700 italic">
									<b className="text-red">Note: </b>(Update the percentage.)
								</Typography>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
								md={8}
								lg={8}
								xl={9}
								className="formikFormField flex pt-[10px!important] sm:!pt-[26px]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="submit"
									variant="contained"
									size="medium"
									disabled={false}
								>
									Update
								</Button>
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>

			<Grid
				container
				spacing={2}
				className="pt-[20px] pr-[30px] mx-auto"
			>
				<Grid
					item
					md={12}
					sm={12}
					xs={12}
					className="pt-[5px!important]"
				>
					{systemSettings.logs && systemSettings.logs.length > 0 && (
						<OrdersLogTableSystemSettings tableData={systemSettings.logs} />
					)}
				</Grid>
			</Grid>
		</div>
	);
}

export default RewardPointSettings;
