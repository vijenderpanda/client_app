import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';


export default observer(function EmployeeDetails() {
    const {empStore} = useStore();
    const {selectedEmployee: employee, deleteemployee, loadingInitial} = empStore;
    const {id} = useParams<{id: string}>();

    useEffect(() => {
        if (id) deleteemployee(Number(id));
    }, [id, deleteemployee]);

    if (loadingInitial || !employee) return <LoadingComponent />;

    return (
        <Grid>
            <Grid.Column width={10}>
            <p>Employee Deleted Sucessfully!</p>
            <Button as={Link} to='/employee' floated='right' type='button' content='Employee'  color='teal'/>
            </Grid.Column>
            <Grid.Column width={6}>
            </Grid.Column>
        </Grid>
    )
})


