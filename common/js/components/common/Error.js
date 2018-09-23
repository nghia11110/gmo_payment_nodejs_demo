import React from 'react';
import PropTypes from 'prop-types';

const Error = (props) => {
  const {
    error,
    balloon,
  } = props;

  const className = `ac-c-error__balloon ${balloon && 'balloon'}`;

  return (
    <div>
      {error &&
        <span className={className}>{error}</span>
      }
    </div>
  );
};

Error.propTypes = {
  error: PropTypes.string,
  balloon: PropTypes.bool,
};
Error.defaultProps = {
  balloon: true,
};

export default Error;

