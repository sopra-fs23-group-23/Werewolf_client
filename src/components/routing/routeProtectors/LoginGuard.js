import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

export const LoginGuard = (props) => {
  if (!localStorage.getItem('token')) {
    return props.children;
  }
  // if user is already logged in
  return <Redirect to="/home" />;
};

LoginGuard.propTypes = {
  children: PropTypes.node,
};
