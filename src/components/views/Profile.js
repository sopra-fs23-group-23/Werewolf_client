import { useEffect, useState } from 'react';
import { api, handleError } from 'helpers/api';
import { Spinner } from 'components/ui/Spinner';
import { Button } from 'components/ui/Button';
import { useHistory } from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";

const Profile = () => {

    const [user, setUser] = useState(null);

    const history = useHistory();
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {

                const response = await api.get(`/users/${localStorage.getItem("id")}`);

                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned users and update the state.
                setUser(response.data);

                // This is just some data for you to see what is available.
                // Feel free to remove it.
                console.log('request to:', response.request.responseURL);
                console.log('status code:', response.status);
                console.log('status text:', response.statusText);
                console.log('requested data:', response.data);

                // See here to get more data.
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the user! See the console for details.");
            }
        }

        fetchData();
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
                    onClick={() => logout()}
                >
                    Logout
                </Button>
            </div>
        );
        return (
            <h1>test</h1>
        );
    }
}

export default Profile;