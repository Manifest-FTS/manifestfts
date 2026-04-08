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
  title = 'Choose your monthly support level',
  subtitle = 'Select a monthly rhythm that matches the pace of support you need right now.',
  compact = false,
}) => {
  const snapshot = getRetainerSnapshot(hours);
  const wrapperClass = compact ? 'bg-2 bdrd-16 p-20' : 'bg-2 bdrd-16 p-30 p-lg-5';
  const titleClass = compact ? 'text-heading-4 color-gray-900 mt-5' : 'text-heading-3 color-gray-900 mt-10';
  const summaryValueClass = compact ? 'text-heading-5 color-gray-900 mt-10' : 'text-heading-4 color-gray-900 mt-10';
  const copyClass = compact ? 'text-body-text-md color-gray-600 mt-15' : 'text-body-text color-gray-600 mt-20';

  return (
    <div className={wrapperClass}>
      <div className="row align-items-end">
        <div className="col-lg-7">
          <h3 className={titleClass}>{title}</h3>
          <p className={copyClass}>{subtitle}</p>
        </div>
        <div className="col-lg-5 mt-5 mt-lg-0 text-lg-end">
          <span className="tag-1 bg-6 color-green-900">{snapshot.supportLabel}</span>
          <div className={compact ? 'text-heading-3 color-gray-900 mt-15' : 'text-heading-2 color-gray-900 mt-20'}>
            {snapshot.hours} hours / month
          </div>
        </div>
      </div>

      <div className={compact ? 'mt-20' : 'mt-30'}>
        <div className="row align-items-center">
          <div className="col-lg-12">
            <label className="text-body-text-md color-gray-600 mb-15 d-inline-block">
              Monthly hours
            </label>
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
                <span key={point} className="text-body-small color-gray-500">
                  {point}h
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={compact ? 'row mt-20' : 'row mt-30'}>
          <div className="col-lg-4 col-md-4 mb-20">
            <span className="text-body-capitalized color-gray-500 text-uppercase">Hourly rate</span>
            <h4 className={summaryValueClass}>{formatUsd(snapshot.effectiveRate)}/hr</h4>
          </div>
          <div className="col-lg-4 col-md-4 mb-20">
            <span className="text-body-capitalized color-gray-500 text-uppercase">Monthly total</span>
            <h4 className={summaryValueClass}>{formatUsd(snapshot.monthlyTotal)}</h4>
          </div>
          <div className="col-lg-4 col-md-4 mb-0">
            <span className="text-body-capitalized color-gray-500 text-uppercase">Good fit for</span>
            <p className="text-sm color-gray-600 mt-10 mb-0">{snapshot.supportDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetainerBuilder;