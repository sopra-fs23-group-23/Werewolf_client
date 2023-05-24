import { useEffect, useState } from 'react';
import { api } from 'helpers/api';
import StorageManager from 'helpers/StorageManager';
import 'styles/ui/DurationSelection.scss';

const DurationSelection = () => {
  const [singleVoteDuration, setSingleVoteDuration] = useState('');
  const [partyVoteDuration, setPartyVoteDuration] = useState('');

  const handleSingleVoteChange = async (duration) => {
    try {
      await api.put('/lobbies/' + StorageManager.getLobbyId() + '/settings', {
        singleVoteDurationSeconds: duration,
      });
      setSingleVoteDuration(duration);
    } catch(e) {
      console.error(e);
    }
  }

  const handlePartyVoteChange = async (duration) => {
    try {
      await api.put('/lobbies/' + StorageManager.getLobbyId() + '/settings', {
        partyVoteDurationSeconds: duration,
      });
      setPartyVoteDuration(duration);
    } catch(e) {
      console.error(e);
    }
  }

  // fetch initial values
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/lobbies/' + StorageManager.getLobbyId() + '/settings');
        setSingleVoteDuration(response.data.singleVoteDurationSeconds);
        setPartyVoteDuration(response.data.partyVoteDurationSeconds);
      } catch(e) {
        console.error(e);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="duration-selection">
      <div>
        <label>Single Vote Duration</label>
        <select value={singleVoteDuration} onChange={e => handleSingleVoteChange(e.target.value)}>
          <option value="15">15 Seconds</option>
          <option value="30">30 Seconds</option>
          <option value="60">60 Seconds</option>
        </select>
      </div>
      <div>
        <label>Party Vote Duration</label>
        <select value={partyVoteDuration} onChange={e => handlePartyVoteChange(e.target.value)}>
          <option value="15">15 Seconds</option>
          <option value="30">30 Seconds</option>
          <option value="90">90 Seconds</option>
          <option value="120">120 Seconds</option>
        </select>
      </div>
    </div>
  );
};

export default DurationSelection;
