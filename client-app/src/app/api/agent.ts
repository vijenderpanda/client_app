import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import { Employee } from '../models/employee';
import { User, UserFormValues } from '../models/user';
import { store } from '../stores/store';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:8000';


axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    console.log('This is token value : ');
    console.log(token);
    if (token) config.headers.Authorization = `Bearer ${token}`

    return config;
})

axios.interceptors.response.use(async response => {
    await sleep(1000);
    return response;
}, (error: AxiosError) => {
    const {data, status, config} = error.response!;
    switch (status) {
        case 400:
            if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
                history.push('/not-found');
            }
            if (data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();
            } else {
                toast.error(data);
            }
            break;
        case 401:
            toast.error('unauthorised');
            break;
        case 404:
            history.push('/not-found');
            break;
        case 500:
           // store.commonStore.setServerError(data);
            history.push('/server-error');
            break;
    }
    return Promise.reject(error);
})

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Employees = {
    list: () => requests.get<Employee[]>('/api/employee'),
    details: (id: number) => requests.get<Employee>(`/api/employee/${id}`),
    create: (employee: Employee) => axios.post<void>('/api/employee', employee),
    update: (employee: Employee) => axios.put<void>(`/api/employee/${employee.empID}`, employee),
    delete: (id: number) => axios.delete<void>(`/api/employee/${id}`)
}

const Account = {
    current: () => requests.get<User>('/api/account'),
    login: (user: UserFormValues) => requests.post<User>('/api/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/api/account/register', user)
}

const agent = {
    Employees,
    Account
}

export default agent;
