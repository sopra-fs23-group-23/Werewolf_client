import 'styles/ui/WaitingScreen.scss';
import Spinner from '../Spinner';
import PropTypes from 'prop-types';

const WaitingScreen = ({theme}) => {
  return (
    <div className="waiting-screen container">
        <h2>Current Poll has ended</h2>
        <h1>loading new poll</h1>
        <Spinner theme={theme}/>
    </div>
  );
};

WaitingScreen.propTypes = {
  theme: PropTypes.string
};

export default WaitingScreen;
