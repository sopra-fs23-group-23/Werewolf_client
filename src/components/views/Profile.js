import { useEffect, useState } from 'react';
import { api, handleError } from 'helpers/api';
import { Spinner } from 'components/ui/Spinner';
import { Button } from 'components/ui/Button';
import { useHistory, useParams } from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
//import PropTypes from "prop-types";
import "styles/views/Profile.scss";


const Profile = () => {

    const [user, setUser] = useState(null);
    const { id } = useParams();
    const history = useHistory();
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchProfile() {
            try {

                const response = await api.get(`/users/${id}`);
                // Get the returned user and update the state.

                await new Promise(resolve => setTimeout(resolve, 1000));

                setUser(response.data);

            } catch (error) {
                console.error(`Something went wrong while fetching the requested user: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the requested user! See the console for details.");
            }
        }

        fetchProfile();
    }, [id]);

    let content = <Spinner />;

    if (user) {
        content = (
            <div className="profile">
                <div className="player container">
                    <div className="player username">{user.username}</div>
                </div>
                <div className="player container">
                    <div className="player status">status: {user.status}</div>
                    <div className="player creationDate">creation date: {user.creationDate}</div>
                    <div className="player birthday">birthday: {user.birthday}</div>
                </div>
            </div>
        );
    }
    return (
        <BaseContainer className="profile container">
            <h1>Profile Page</h1>
            {content}
            <div className='login button-container'>
                <Button 
                    width="100%"
                    onClick={() => history.push(`/game/profile/${id}/edit`)}
                >
                Edit
                </Button>
                <Button
                    width="100%"
                    onClick={() => history.push("/game")}
                >
                    Back
                </Button>
            </div>
        </BaseContainer>
    );
}

export default Profile;