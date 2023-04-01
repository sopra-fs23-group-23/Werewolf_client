import PropTypes from 'prop-types';
<<<<<<< HEAD
import 'styles/ui/FormField.scss'
=======
import 'styles/ui/Formfield.scss';
>>>>>>> d3e5f38c98a1bccc7b5a3916ece90b39733e965c

const FormField = ({ label, placeholder, value, type, onChange }) => {
  return (
    <div className='formField'>
      <label>{label}</label>
      <input
<<<<<<< HEAD
        placeholder={placeholder}
=======
        className="input"
        placeholder="enter here.."
>>>>>>> d3e5f38c98a1bccc7b5a3916ece90b39733e965c
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
