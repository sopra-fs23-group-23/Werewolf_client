import React from 'react';
import 'styles/ui/Spinner.scss';
import PropTypes from 'prop-types';

const Spinner = ({theme}) => (
  <div className="loader">
    <div className={`loader-inner loader-inner-${theme}`}>
      <div className="loader-line-wrap">
        <div className={`loader-line loader-line-${theme}`}></div>
      </div>
      <div className="loader-line-wrap">
        <div className={`loader-line loader-line-${theme}`}></div>
      </div>
      <div className="loader-line-wrap">
        <div className={`loader-line loader-line-${theme}`}></div>
      </div>
      <div className="loader-line-wrap">
        <div className={`loader-line loader-line-${theme}`}></div>
      </div>
      <div className="loader-line-wrap">
        <div className={`loader-line loader-line-${theme}`}></div>
      </div>
      <h2>Loading...</h2>
    </div>
  </div>
);

Spinner.propTypes = {
  theme: PropTypes.string
};

export default Spinner;
