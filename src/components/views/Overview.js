import { useEffect, useState } from 'react';
import { api, handleError } from 'helpers/api';
import { Spinner } from 'components/ui/Spinner';
import { Button } from 'components/ui/Button';
import { Field } from 'components/ui/Field';
import { useHistory, useParams } from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Profile.scss";



const Overview = () => {


    return (
        <BaseContainer >
            <h1>Hey,<br/> Jerome</h1>

            .create_lobby   
            
            <div className='login button-container'>

                <Button 
                    width="100%"
                    
                >
                create lobby
                </Button>
                <Field
                    label = "lobby"
                    placeholder = "123456"
                >

                </Field>
                <Button
                    width="100%"
                >
                    join lobby
                </Button>
            </div>
        </BaseContainer>
    );
}

export default Overview;