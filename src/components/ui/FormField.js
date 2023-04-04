import PropTypes from 'prop-types';

const FormField = ({ label, placeholder, value, type, onChange, theme}) => {
  return (
    <div className= {`form-field form-field-${theme}`}>
      <label>{label}</label>
      <input
        placeholder={placeholder}
        value={value}
        type={type || 'text'}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func,
  theme: PropTypes.string
};

export default FormField;
