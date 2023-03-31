import PropTypes from 'prop-types';
import 'styles/ui/Formfield.scss';

const FormField = ({ label, value, type, onChange }) => {
  return (
    <div>
      <label>{label}</label>
      <input
        className="input"
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
