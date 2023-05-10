import 'styles/ui/EventLog.scss';
import PropTypes from 'prop-types';

const EventPopup = ({ show, handleClose, stage, logger}) => {
  const handleClickOutsidePopup = (e) => {
    if(e.target.classList.contains('log-popup-background')) {
      handleClose();
    }
  }

  if(!show) {
    return <div></div>;
  } else {
    return (
      <div className='log-popup-background' onClick={handleClickOutsidePopup}>
        <div className={'log-popup-container ' + (stage === 'Day' ? 'background-light ' : 'background-dark ') +
          'log-popup-container-'+ (stage === 'Day' ? 'light' : 'dark')} id={"LogContainer"}>
          <img src='/static/media/close.svg' className={`log-popup-close log-popup-close-${(stage === 'Day' ? 'light' : 'dark')}`}
               onClick={handleClose} alt='close'/>
          <h2 className='log-popup-title'>History</h2>
          {logger.getLog().map((action) => <div className={"log-popup-action-container log-popup-action-container-"+
              (stage === 'Day' ? 'light' : 'dark')}>
            {(stage === 'Day' ? action.getRepresentationLight() : action.getRepresentationDark())}
          </div>
          )}
        </div>
      </div>
    );
  }
}

EventPopup.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  logger: PropTypes.object
};


export default EventPopup;