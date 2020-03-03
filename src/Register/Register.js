import React, {Component} from 'react';
import axios from 'axios';
import './Register.css';


class Register extends Component {

    state = {
        user: {
            firstName: '',
            lastName: '',
            address: '',
            postal: '',
            email: '',
            phone: ''
        },
        unionCounty: 'UKJENT',
        localUnions: [],
        errors: {
            firstName: '',
            lastName: '',
            postal: '',
            email: '',
            phone: ''
        }

    };

    handleSubmit = (event) => {
        event.preventDefault();
        const isValid = this.validate();
        if(isValid){
             var {firstName, lastName, address, postal, email, phone} = this.state.user;
            const CASE = {
                firstName,
                lastName,
                address,
                postal,
                email,
                phone,
                unionID: this.state.localUnion.id
            };
            axios.put('https://localhost:44329/api/case', CASE).then(response => this.props.history.push({pathname: '/personer'}));

        }

    };

    validate = () => {
        var isValid = true;
        var firstNameError = '';
        var lastNameError = '';
        var postalError = '';
        var phoneError = '';
        var emailError = '';
        const postNumber = /^[0-9]{4}$/;
        const phoneNumber = /^[0-9]{8}$/;

        if(this.state.user.firstName === ''){
                firstNameError = 'Fornavn er nødvendig';
            isValid = false;
        }
        if(this.state.user.lastName === ''){
            lastNameError = 'Etternavn er nødvendig';
            isValid = false;
        }
        if(!this.state.user.postal.match(postNumber) ){
            postalError = 'Postkode er nødvendig og kan bare inneholde tall.';
            isValid = false;
        }
        if(!this.state.user.email.includes("@")){
            emailError = 'Ugyldig email';
            isValid = false;
        }
        if(!this.state.user.phone.match(phoneNumber)){
           phoneError = 'Mobil nummer er nødvendig! Kan bare inneholde tall.';
            isValid = false;
        }
        this.setState({errors: {phone: phoneError, firstName: firstNameError,
                lastName: lastNameError, postal: postalError, email: emailError}});

        return isValid;
    }

    firstNameChanged = (event) => {
        this.setState({user: { ...this.state.user, firstName:  event.target.value}});
    }

    lastNameChanged = (event) => {
        this.setState({user: { ...this.state.user, lastName:  event.target.value}});
    }

    addressChanged = (event) => {
        this.setState({user: { ...this.state.user, address:  event.target.value}});
    }

    postalChanged = (event) => {
        this.setState({user: { ...this.state.user, postal:  event.target.value}});
        const postal = event.target.value;
        var unionCounty = 'UKJENT';

        if(postal >= 5000 && postal <= 6000){
           unionCounty = 'HORDALAND';
        }

        else if (postal >= 0 && postal <= 1000){
            unionCounty = 'OSLO';
        }

        else if (postal >= 8000 && postal <= 9000){
            unionCounty = 'NORDLAND';
        }

        this.setState({unionCounty: unionCounty});
        this.setDefaultUnionValues(unionCounty);

    }


    emailChanged = (event) => {
        this.setState({user: {...this.state.user, email:  event.target.value}});
    }

    phoneChanged = (event) => {
        this.setState({user: {...this.state.user, phone:  event.target.value}});
    }

    unionCountyChanged = (event) => {
        this.setState({ unionCounty:  event.target.value});
        this.setDefaultUnionValues(event.target.value);
    }

    setDefaultUnionValues = county  => {
        /*
           var localUnion = '';
        if(county === "HORDALAND"){
            localUnion = 'Første lag';
        }
        if(county === "OSLO"){
            localUnion = 'Andre lag';
        }
        if(county === "NORDLAND"){
            localUnion = 'Tredje lag';
        }

        this.setState({localUnion: localUnion});

         */

        axios.get('https://localhost:44329/api/union/counties/' + county).then(response =>
        {this.setState({
            localUnions: response.data.localUnions, localUnion: (response.data.localUnions) && (response.data.localUnions.length !== 0) ? response.data.localUnions[0] : ''});
        });

}

    localUnionChanged = event => {
            const localUnion = this.state.localUnions.find(lu =>
                lu.id === +event.target.value
            );
        this.setState({ localUnion: localUnion });
    }

    render() {
        return (
            <form>
                <div className="my-form">
                    <div>
                        <input className="field-long" type="text" placeholder="FORNAVN"
                               value={this.state.user.firstName} onChange={this.firstNameChanged}/>
                        <p className="error">{this.state.errors.firstName}</p>
                    </div>
                    <div>
                        <input  className="field-long" type="text" placeholder="ETTERNAVN"
                                value={this.state.user.lastName}
                                onChange={this.lastNameChanged}/>
                        <p className="error">{this.state.errors.lastName}</p>
                    </div>
                    <div>
                        <input className="field-long" placeholder="ADRESSE"
                               type="text" value={this.state.user.address} onChange={this.addressChanged}/>
                    </div>
                    <br/>
                    <div>
                        <input className="field-long" placeholder="POSTNUMMER"
                               type="text" value={this.state.user.postal} onChange={this.postalChanged}/>
                        <p className="error">{this.state.errors.postal}</p>
                    </div>


                    <div>
                        <input className="field-long" placeholder="E-POST"  type="email"
                               value={this.state.user.email} onChange={this.emailChanged}/>
                             <p className="error">{this.state.errors.email}</p>
                    </div>
                    <div>
                        <input className="field-long" placeholder="MOBIL"
                               type="text" value={this.state.user.phone} onChange={this.phoneChanged}/>
                               <p className="error">{this.state.errors.phone}</p>
                    </div>

                    <p>Du tilhører laget { this.state.unionCounty !== 'UKJENT' && this.state.localUnion && this.state.localUnion.name ? this.state.unionCounty + ' - ' + this.state.localUnion.name : '«XXXXX»'}, vil du velge et annet lag, angi her?</p>

                   <div>
                       <div style={{float: 'left'}}>Fylkeslag:</div>
                       <select style={{width: '70%', float:'right'}}
                               onChange={this.unionCountyChanged}
                               value={this.state.unionCounty}>
                        <option value="HORDALAND">HORDALAND</option>
                       <option value="OSLO">OSLO</option>
                       <option value="NORDLAND">NORDLAND</option>
                        <option value="UKJENT">UKJENT</option>
                    </select></div>
                    <br/>


                    {this.state.localUnion && <div>
                        <div style={{float: 'left'}}>Lokalforening:</div>
                        <select style={{width: '70%', float: 'right'}}
                                onChange={this.localUnionChanged}
                                value={this.state.localUnion.id}>

                            {this.state.localUnions && this.state.localUnions.map((lu) => <option key={lu.id}
                                                                                                  value={lu.id}>{lu.name}</option>)}
                        </select>
                    </div>
                    }
                <div>
                        <input type="submit"  onClick={this.handleSubmit} value="Bli Frivillig"></input>
                    </div>
                </div>


            </form>

        );
    }
}

export default Register;
