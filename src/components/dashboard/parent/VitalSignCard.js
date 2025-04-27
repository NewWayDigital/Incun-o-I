import React from 'react';
import PropTypes from 'prop-types';

const VitalSignCard = ({ label, value, unit, trend, change, icon }) => {
    const getTrendClass = (trend) => {
        switch(trend) {
            case 'up':
                return 'trend-up';
            case 'down':
                return 'trend-down';
            case 'stable':
            default:
                return 'trend-stable';
        }
    };

    const getTrendIcon = (trend) => {
        switch(trend) {
            case 'up':
                return 'arrow-up';
            case 'down':
                return 'arrow-down';
            case 'stable':
            default:
                return 'equals';
        }
    };

    const getTrendText = (trend, change) => {
        if (trend === 'stable') return 'Stable';
        return change > 0 ? `+${change}` : change;
    };

    return (
        <div className="vital-sign">
            <div className="vital-sign-label">
                <i className={`fas fa-${icon} vital-sign-icon`}></i>
                {label}
            </div>
            <div className="vital-sign-value">
                {value} <span className="vital-sign-unit">{unit}</span>
            </div>
            <div className={`vital-sign-trend ${getTrendClass(trend)}`}>
                <i className={`fas fa-${getTrendIcon(trend)} trend-icon`}></i>
                {getTrendText(trend, change)}
            </div>
        </div>
    );
};

VitalSignCard.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    unit: PropTypes.string.isRequired,
    trend: PropTypes.oneOf(['up', 'down', 'stable']).isRequired,
    change: PropTypes.number,
    icon: PropTypes.string.isRequired
};

VitalSignCard.defaultProps = {
    change: 0,
    trend: 'stable'
};

export default VitalSignCard;