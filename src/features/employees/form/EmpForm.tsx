import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';
import { Employee } from '../../../app/models/employee';

export default observer(function EmployeeForm() {
    const history = useHistory();
    const { empStore } = useStore();
    const { createEmployee, updateEmployee,
        loading, loademployee, loadingInitial } = empStore;
    const { id } = useParams<{ id: string }>();

    const [employee, setEmployee] = useState<Employee>({
        empID: 0,
        empName: '',
        empDOJ: null,
        empDescription: '',
        empCategory: '',
        empCity: '',
        empOfficeVenue: ''
    });

    const validationSchema = Yup.object({
        empName: Yup.string().required('The Name is required'),
        empDescription: Yup.string().required('The description is required'),
        empCategory: Yup.string().required(),
        empDOJ: Yup.string().required('Date is required').nullable(),
        empOfficeVenue: Yup.string().required(),
        empCity: Yup.string().required(),
    })

    useEffect(() => {
        if (id) loademployee(parseInt(id)).then(employee => setEmployee(employee!))
    }, [id, loademployee]);

    function handleFormSubmit(employee: Employee) {
        if (employee.empID === 0) {
            let newEmployee = {
                ...employee,
                id: Math.floor(Math.random() * (3020 - 50 + 1)) + 50,
            };
            createEmployee(newEmployee).then(() => history.push(`/employee/${newEmployee.empID}`))
        } else {
            updateEmployee(employee).then(() => history.push(`/employee/${employee.empID}`))
        }
    }

    if (loadingInitial) return <LoadingComponent content='Loading employee...' />

    return (
        <Segment clearing>
            <Header content='Employee Details' sub color='teal' />
            <Formik 
                validationSchema={validationSchema}
                enableReinitialize 
                initialValues={employee} 
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput name='empName' placeholder='Employee Name' />
                        <MyDateInput 
                            placeholderText='Date'  
                            name='empDOJ' 
                            showTimeSelect
                            timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa'
                        />
                        <MyTextArea rows={3} placeholder='Description' name='empDescription' />
                        <MySelectInput options={categoryOptions} placeholder='Category'  name='empCategory' />
                        <Header content='Location Details' sub color='teal' />
                        <MyTextInput placeholder='City'  name='empCity' />
                        <MyTextInput placeholder='Venue' name='empOfficeVenue' />
                        <Button 
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={loading} floated='right' 
                            positive type='submit' content='Submit' />
                        <Button as={Link} to='/employee' floated='right' type='button' content='Cancel' />
                    </Form>
                )}
            </Formik>

        </Segment>
    )
})