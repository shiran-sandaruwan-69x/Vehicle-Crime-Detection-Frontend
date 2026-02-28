import { Button, Grid, TextField, Autocomplete } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import axios, { AxiosResponse } from 'axios';
import {
  GET_PERMISSIONS_BY_ID,
  GET_USER_ROLES,
  UPDATE_PERMISSIONS,
} from 'src/app/axios/services/AdminServices';
import MaterialTable, { Column } from 'material-table';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import { ModifiedPermission } from './interfaces';

export interface Role {
  id: number;
  name: string;
  description: string | null;
  is_active: number;
}

interface Links {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: any;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

interface GetRoleResponse {
  data: Role[];
  links: Links;
  meta: Meta;
}

export interface UserPermissionsInterface {
  id: number;
  name: string;
  action: boolean;
}

interface UserPermissions {
  [key: string]: {
    [key: string]: UserPermissionsInterface[];
  };
}

function UserPermissionsApp() {
  const [loading, setLoading] = useState<boolean>(false);
  const [userRoles, setUserRoles] = useState<
    { value: number; label: string }[]
  >([]);
  const [permissions, setPermissions] = useState<ModifiedPermission[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number>(0);
  useEffect(() => {
    fetchUserRoles();
  }, []);

  const fetchUserRoles = async () => {
    setLoading(true);
    try {
      const response: AxiosResponse<GetRoleResponse> =
        await axios.get(GET_USER_ROLES);
      const userRolesLOV: { label: string; value: number }[] =
        response.data.data.map((role: Role) => {
          return {
            label: role.name,
            value: role.id,
          };
        });

      setUserRoles(userRolesLOV);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const axiosError = error as ExtendedAxiosError;

      if (axiosError?.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else if (axiosError.message) {
        toast.error(axiosError.message);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  const filterPermissionsForRole = async (roleId: number) => {
    try {
      const response: AxiosResponse<UserPermissions> = await axios.get(
        GET_PERMISSIONS_BY_ID + roleId
      );

      const permissionModified: any[] = [];
      let idCounter: number = 1;

      Object.entries(response.data).forEach(([key, value]) => {
        // Create Parent (Main Category)
        // eslint-disable-next-line no-plusplus
        const parentId: number = idCounter++;
        permissionModified.push({
          id: parentId,
          name: key,
          index: false,
          store: false,
          show: false,
          update: false,
          destroy: false,
          parentId: null,
          type: 'category',
        });

        Object.entries(value).forEach(([subKey, subValue]) => {
          // Create Child (Sub-category)
          permissionModified.push({
            // eslint-disable-next-line no-plusplus
            id: idCounter++,
            name: subKey,
            index: subValue.find((item) => item.name === 'index'),
            store: subValue.find((item) => item.name === 'store'),
            show: subValue.find((item) => item.name === 'show'),
            update: subValue.find((item) => item.name === 'update'),
            destroy: subValue.find((item) => item.name === 'destroy'),
            parentId,
            type: 'permission',
          });
        });
      });

      setPermissions(permissionModified);
    } catch (error) {
      toast.error('Error occurred while fetching Permissions');
    }
  };

  const tableColumns: Column<ModifiedPermission>[] = [
    {
      title: 'Module Name',
      field: 'name',
      render: (rowData: ModifiedPermission) => (
        <div
          style={{
            paddingLeft: rowData.type === 'child' ? '20px' : '0', // Apply tab space
            fontWeight: rowData.type === 'child' ? 'normal' : 'bold', // Bold for main categories
          }}
        >
          {rowData.name}
        </div>
      ),
    },
    {
      title: 'Index',
      field: 'index',
      render: (rowData: ModifiedPermission) => (
        <input
          disabled={rowData.parentId === null || rowData.index === undefined}
          type='checkbox'
          className='cursor-pointer'
          defaultChecked={rowData?.index?.action}
          onChange={(e) => {
            if (rowData.index) {
              rowData.index.action = e.target.checked;
            }
          }}
        />
      ),
    },
    {
      title: 'View',
      field: 'show',
      render: (rowData: ModifiedPermission) => (
        <input
          disabled={rowData.parentId === null || rowData.show === undefined}
          type='checkbox'
          className='cursor-pointer'
          defaultChecked={rowData?.show?.action}
          onChange={(e) => {
            if (rowData.show) {
              rowData.show.action = e.target.checked;
            }
          }}
        />
      ),
    },
    {
      title: 'Create',
      field: 'store',
      render: (rowData: ModifiedPermission) => (
        <input
          disabled={rowData.parentId === null || rowData.store === undefined}
          type='checkbox'
          className='cursor-pointer'
          defaultChecked={rowData?.store?.action}
          onChange={(e) => {
            if (rowData.store) {
              rowData.store.action = e.target.checked;
            }
          }}
        />
      ),
    },
    {
      title: 'Update',
      field: 'update',
      render: (rowData: ModifiedPermission) => (
        <input
          disabled={rowData.parentId === null || rowData.update === undefined}
          className='cursor-pointer'
          defaultChecked={rowData?.update?.action}
          type='checkbox'
          onChange={(e) => {
            if (rowData.update) {
              rowData.update.action = e.target.checked;
            }
          }}
        />
      ),
    },
    {
      title: 'Delete',
      field: 'destroy',
      render: (rowData: ModifiedPermission) => (
        <input
          disabled={rowData.parentId === null || rowData.destroy === undefined}
          type='checkbox'
          defaultChecked={rowData?.destroy?.action}
          className='cursor-pointer'
          onChange={(e) => {
            if (rowData.destroy) {
              rowData.destroy.action = e.target.checked;
            }
          }}
        />
      ),
    },
  ];

  const schema = yup.object().shape({});

  const onChangeRole = (role: number | null) => {
    if (role === null) {
      setSelectedRoleId(null);
      setPermissions([]);
    } else {
      setSelectedRoleId(role);
      filterPermissionsForRole(role);
    }
  };

  const updatePermissions = async () => {
    const selectedPermissionsIds = [];

    permissions.forEach((permission: any) => {
      if (permission.index && permission.index.action === true) {
        selectedPermissionsIds.push(permission.index.id);
      }

      if (permission.show && permission.show.action === true) {
        selectedPermissionsIds.push(permission.show.id);
      }

      if (permission.store && permission.store.action === true) {
        selectedPermissionsIds.push(permission.store.id);
      }

      if (permission.update && permission.update.action === true) {
        selectedPermissionsIds.push(permission.update.id);
      }

      if (permission.destroy && permission.destroy.action === true) {
        selectedPermissionsIds.push(permission.destroy.id);
      }
    });

    try {
      await axios.put(UPDATE_PERMISSIONS + selectedRoleId, {
        permissions: selectedPermissionsIds,
      });
      toast.success('Permissions Updated Successfully');
    } catch (error) {
      const axiosError = error as ExtendedAxiosError;

      if (axiosError?.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else if (axiosError.message) {
        toast.error(axiosError.message);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  return loading ? (
    <FuseLoading />
  ) : (
    <div className='min-w-full max-w-[100vw]'>
      <NavigationViewComp title='Permissions' />

      <Formik
        initialValues={
          {
            status: null,
          } as {
            status: number | null;
          }
        }
        validationSchema={schema}
        onSubmit={null}
      >
        {({ values, setFieldValue, touched, errors }) => (
          <Form>
            <Grid container spacing={2} className='pt-[10px] pr-[30px] mx-auto'>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={4}
                xl={3}
                className='formikFormField pt-[5px!important]'
              >
                <Typography className='formTypography'>Select Role</Typography>
                <Autocomplete
                  size='small'
                  options={userRoles}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, newValue) => {
                    setFieldValue('status', newValue); // Set the entire object
                    onChangeRole(newValue ? newValue.value : null); // Pass only the ID to your handler
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name='status'
                      variant='outlined'
                      fullWidth
                      placeholder='Select Role'
                      error={touched.status && Boolean(errors.status)}
                      helperText={touched.status && errors.status}
                    />
                  )}
                  value={values.status || null} // Set the current object value or null
                />

                {/* <Autocomplete
                  size="small"
                  options={userRoles}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, newValue) => {
                    console.log('event', event);
                    console.log('newValue', newValue);
                    setFieldValue("status", newValue ? newValue.value : "");
                    onChangeRole(newValue ? newValue.value : "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="status"
                      variant="outlined"
                      fullWidth
                      placeholder="Select Role"
                      error={touched.status && Boolean(errors.status)}
                      helperText={touched.status && errors.status}
                    />
                  )}
                  value={
                    StatusOptions.find(
                      (option) => option.value === values.status
                    ) || null
                  }
                /> */}
              </Grid>

              <Grid
                item
                xl={9}
                md={8}
                sm={6}
                xs={12}
                className='flex justify-end pt-[10px!important] sm:!pt-[26px]'
              >
                <Button
                  className='flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80'
                  type='button'
                  variant='contained'
                  size='medium'
                  onClick={updatePermissions}
                >
                  Update Permissions
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
      <Grid container spacing={2} className='pt-[20px] pr-[30px] mx-auto'>
        <Grid
          item
          md={12}
          sm={12}
          xs={12}
          className='pt-[5px!important] custom-table lightTable table-shadow-0 blueUnderLineIndicator redTableStrip overflow-hidden shadow-0'
        >
          <MaterialTable
            title='Permissions Management'
            data={permissions}
            columns={tableColumns}
            parentChildData={(row, rows) =>
              rows.find((a) => a.id === row.parentId)
            }
            options={{
              selection: true,
            }}
          />
        </Grid>
        {/* <Grid item md={12} sm={12} xs={12} className='pt-[5px!important]'>
          <Button
            className='flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80'
            type='button'
            variant='contained'
            size='medium'
            onClick={updatePermissions}
          >
            Update Permissions
          </Button>
        </Grid> */}
      </Grid>
    </div>
  );
}

export default UserPermissionsApp;
