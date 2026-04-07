import {
  RETAINER_MAX_HOURS,
  RETAINER_MIN_HOURS,
  formatUsd,
  getRetainerSnapshot,
} from '../../util/retainer';

const anchorPoints = [5, 10, 20, 40];

const RetainerBuilder = ({
  hours,
  onHoursChange,
  title = 'Build a monthly retainer',
  subtitle = 'Choose a monthly commitment that fits the level of support you need right now.',
  compact = false,
}) => {
  const snapshot = getRetainerSnapshot(hours);

  return (
    <div className={compact ? '' : 'bg-2 bdrd-16 p-30 p-lg-5'}>
      <div className="row align-items-end">
        <div className="col-lg-7">
          <span className="text-body-capitalized color-gray-500 text-uppercase">Flexible monthly support</span>
          <h3 className="text-heading-3 color-gray-900 mt-10">{title}</h3>
          <p className="text-body-text color-gray-600 mt-20">{subtitle}</p>
        </div>
        <div className="col-lg-5 mt-30 mt-lg-0 text-lg-end">
          <span className="tag-1 bg-6 color-green-900">{snapshot.supportLabel}</span>
          <div className="text-heading-2 color-gray-900 mt-20">{snapshot.hours} hours / month</div>
        </div>
      </div>

      <div className="mt-30">
        <div className="row align-items-center">
          <div className="col-lg-12">
            <label className="text-body-text-md color-gray-600 mb-15 d-inline-block">Monthly commitment</label>
            <input
              className="w-100"
              type="range"
              min={RETAINER_MIN_HOURS}
              max={RETAINER_MAX_HOURS}
              step="1"
              value={snapshot.hours}
              onChange={(event) => onHoursChange(Number(event.target.value))}
              aria-label="Monthly retainer hours"
              style={{ accentColor: '#3f8077' }}
            />
            <div className="d-flex justify-content-between mt-10">
              {anchorPoints.map((point) => (
                <span key={point} className="text-body-small color-gray-500">{point}h</span>
              ))}
            </div>
          </div>
        </div>

        <div className="row mt-30">
          <div className="col-lg-4 mb-20">
            <span className="text-body-capitalized color-gray-500 text-uppercase">Effective rate</span>
            <h4 className="text-heading-4 color-gray-900 mt-10">{formatUsd(snapshot.effectiveRate)}/hr</h4>
          </div>
          <div className="col-lg-4 mb-20">
            <span className="text-body-capitalized color-gray-500 text-uppercase">Monthly total</span>
            <h4 className="text-heading-4 color-gray-900 mt-10">{formatUsd(snapshot.monthlyTotal)}</h4>
          </div>
          <div className="col-lg-4 mb-20">
            <span className="text-body-capitalized color-gray-500 text-uppercase">Best for</span>
            <p className="text-sm color-gray-600 mt-10 mb-0">{snapshot.supportDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetainerBuilder;