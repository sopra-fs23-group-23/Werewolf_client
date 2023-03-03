import { useEffect, useState } from 'react';
import { api, handleError } from 'helpers/api';
import { Spinner } from 'components/ui/Spinner';
import { Button } from 'components/ui/Button';
import { useHistory } from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
//import PropTypes from "prop-types";
import "styles/views/Game.scss";

const Profile = () => {

    // const updateProfile = async () => {
    //     try {
    //     const requestBody = JSON.stringify({username, birthDate});
    //     const response = await api.put(`/users/${localStorage.getItem("id")}`, requestBody);

    //     } catch (error) {
    //     alert(`Something went wrong during the update: \n${handleError(error)}`);
    //     }
    // };

    const [user, setUser] = useState(null);

    const history = useHistory();
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchProfile() {
            try {
                let currentUrl = new URL(window.location);
                console.log(currentUrl);
                // do some redux stuff here

                const response = await api.get(`/users/${currentUrl.searchParams.get('id')}`);
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
    }, []);

    let content = <Spinner />;

    if (user) {
        content = (
            <div className="game">
                <div className="player container">
                    <div className="player username">username: {user.username}</div>
                    <div className="player status">status: {user.status}</div>
                    <div className="player creationDate">creation date: {user.creationDate}</div>
                    <div className="player birthday">birthday: {user.birthday}</div>
                </div>
                <Button
                    width="100%"
                    onClick={() => history.push("/game")}
                >
                    Back to Overview
                </Button>
            </div>
        );
    }
    return (
        <BaseContainer className="game container">
            <h1>Profile Page</h1>
            {content}
        </BaseContainer>
    );
}

export default Profile;