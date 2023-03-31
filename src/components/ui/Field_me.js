import "styles/ui/Field.scss";

export const Field = props => (
    <div className="field">
      <label className="field label">
        {props.label}
      </label>
      <input
        className="field input"
        placeholder={props.placeholder}
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
);
