import React, {Component} from 'react';
import axios from 'axios';
import './PersonList.css';
import {Link} from 'react-router-dom';

class PersonList extends Component {

    state = {
        cases: [{firstName: '', lastName:'', id: ''}]
    };

    componentDidMount(){
        axios.get('https://localhost:44329/api/case/cases').then(response => {
            this.setState({cases: response.data});
        })
    }

    render() {
        const myTable = <table id='persons'>
            <thead>
            <tr>
                <th>Fornavn</th>
                <th>Etternavn</th>
            </tr>
            </thead>
            <tbody>
            { this.state.cases.map(
                (Case) =>
                    <tr key={Case.id}>
                        <td>{Case.firstName}</td>
                        <td>{Case.lastName}</td>
                    </tr>
            )}
            </tbody>
        </table>
        
        return (
            <div style={{align: 'center'}}>
            <div>
                {myTable}


                <Link to={'/'}>Tilbake</Link>
            </div></div>
        );
    }
}

export default PersonList;