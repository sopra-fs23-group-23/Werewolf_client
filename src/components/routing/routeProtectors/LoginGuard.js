import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import StorageManager from 'helpers/StorageManager';

export const LoginGuard = (props) => {
  if (!StorageManager.getUserToken()) {
    return props.children;
  }
  // if user is already logged in
  return <Redirect to="/home" />;
};

LoginGuard.propTypes = {
  children: PropTypes.node,
};
