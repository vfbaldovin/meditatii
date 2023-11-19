import { memo } from 'react';
import PropTypes from 'prop-types';

const EcommerceWorldMap = (props) => {
  const { markerColor } = props;

  return (
    <svg
      fill="none"
      height="100%"
      viewBox="0 0 480 233"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >      <path
      d="M456.119 216.281C456.515 216.281 456.835 215.96 456.835 215.564C456.835 215.169 456.515 214.848 456.119 214.848C455.724 214.848 455.403 215.169 455.403 215.564C455.403 215.96 455.724 216.281 456.119 216.281Z"
      fill="#9DA4AE"
    /></svg>
  );
};

EcommerceWorldMap.propTypes = {
  markerColor: PropTypes.string.isRequired,
};

const memoized = memo(EcommerceWorldMap);

export { memoized as EcommerceWorldMap };
