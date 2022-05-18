import { observer } from 'mobx-react-lite';
import React from 'react'
import { Link } from 'react-router-dom';
import {Button, Header, Item, Segment, Image} from 'semantic-ui-react'
import {Employee} from "../../../app/models/employee";
import {format} from 'date-fns';

const employeeImageStyle = {
    filter: 'brightness(50%)'
};

const employeeImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props {
    employee: Employee
}

export default observer (function EmployeeDetailedHeader({employee}: Props) {
    return (
        <Segment.Group>
            <Segment basic attached='top' style={{padding: '0'}}>
                <Image src={`/assets/categoryImages/${employee.empCategory}.jpg`} fluid style={employeeImageStyle}/>
                <Segment style={employeeImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={employee.empName}
                                    style={{color: 'white'}}
                                />
                                <p>{format(employee.empDOJ!, 'dd MMM yyyy')}</p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                <Button as={Link} to={`/manage/${employee.empID}`} color='orange' floated='right'>
                    Manage
                </Button>
            </Segment>
        </Segment.Group>
    )
})