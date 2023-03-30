import PropTypes from 'prop-types';

const FormField = ({ label, value, type, onChange }) => {
  return (
    <div className="login field">
      <label className="login label">{label}</label>
      <input
        className="login input"
        placeholder="enter here.."
        value={value}
        type={type || 'text'}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func,
};

export default FormField;
