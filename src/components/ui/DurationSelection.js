import 'styles/ui/DurationSelection.scss';

const DurationSelection = () => {
  return (
    <div className="duration-selection">
      <div>
        <label>Single Vote Duration</label>
        <select value={15}>
          <option value="15">15 Seconds</option>
          <option value="30">30 Seconds</option>
          <option value="90">90 Seconds</option>
          <option value="90">120 Seconds</option>
        </select>
      </div>
      <div>
        <label>Party Vote Duration</label>
        <select value={90}>
          <option value="15">15 Seconds</option>
          <option value="30">30 Seconds</option>
          <option value="90">90 Seconds</option>
          <option value="90">120 Seconds</option>
        </select>
      </div>
    </div>
  );
};

export default DurationSelection;
