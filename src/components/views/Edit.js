import { useState } from 'react';
import { api, handleError } from 'helpers/api';
import { Button } from 'components/ui/Button';
import { useHistory, useParams } from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";



const FormFieldUsername = props => {
    return (
      <div className="login field">
        <label className="login label">
          {props.label}
        </label>
        <input
          className="login input"
          placeholder="enter username.."
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
        />
      </div>
    );
  };
  
  const FormFieldBirthday = props => {
  
    return (
      <div className="login field">
        <label className="login label">
          {props.label}
        </label>
        <input
          className="login input"
          type="date"
          placeholder="enter birthday.."
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
        />
      </div>
    );
  };

const Edit = () => {
    const [birthday, setBirthday] = useState(null);
    const [username, setUsername] = useState(null);

    const { id } = useParams();
    const history = useHistory();

    const updateProfile = async () => {
        try {
        const requestBody = JSON.stringify({username, birthday});
        await api.put(`/users/${id}`, requestBody);

        await new Promise(resolve => setTimeout(resolve, 1000));
        history.push(`/game/profile/${id}`);

        } catch (error) {
        alert(`Something went wrong during the update: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
        <div className="login container">
          <div className="login form">
          <h1>Edit Profile</h1>
            <FormFieldUsername
              label="username"
              value={username}
              onChange={un => setUsername(un)}
            />
            <FormFieldBirthday
              label="birthday"
              value={birthday}
              onChange={n => setBirthday(n)}
            />
            <div className="login button-container">
                <Button
                    width="100%"
                    onClick={() => updateProfile()}
                    >
                    Save
                </Button>
            </div>
            
          </div>
        </div>
      </BaseContainer>
    );
}

export default Edit;