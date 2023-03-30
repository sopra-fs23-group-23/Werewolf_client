import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = ({label, value, type, onChange}) => {
  return (
    <div className="login field">
      <label className="login label">
        {label}
      </label>
      <input
        className="login input"
        placeholder="enter here.."
        value={value}
        type={type || "text"}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func
};

export default FormField;