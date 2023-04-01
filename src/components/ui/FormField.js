import PropTypes from 'prop-types';
import 'styles/ui/Formfield.scss';

const FormField = ({ label, placeholder, value, type, onChange }) => {
  return (
    <div className='formField'>
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
};

export default FormField;
