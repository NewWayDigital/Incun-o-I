import React from 'react';
// import VitalSignCard from './VitalSignCard'
import VitalSignCard from './VitalSignCard.JS';

const VitalSignsSection = ({ vitalSigns, lastUpdate }) => {
    return (
        <div className="card card-span-4">
            <div className="card-header">
                <h2 className="card-title">
                    <i className="fas fa-heartbeat card-title-icon"></i>
                    Paramètres vitaux
                </h2>
                <span className="card-status">Mis à jour il y a {lastUpdate}</span>
            </div>
            <div className="card-body">
                <div className="vital-signs">
                    <VitalSignCard 
                        label="Température"
                        value={vitalSigns.temperature.value}
                        unit={vitalSigns.temperature.unit}
                        trend={vitalSigns.temperature.trend}
                        change={vitalSigns.temperature.change}
                        icon="temperature-high"
                    />
                    <VitalSignCard 
                        label="Fréquence cardiaque"
                        value={vitalSigns.heartRate.value}
                        unit={vitalSigns.heartRate.unit}
                        trend={vitalSigns.heartRate.trend}
                        change={vitalSigns.heartRate.change}
                        icon="heartbeat"
                    />
                    <VitalSignCard 
                        label="Saturation O2"
                        value={vitalSigns.saturationO2.value}
                        unit={vitalSigns.saturationO2.unit}
                        trend={vitalSigns.saturationO2.trend}
                        change={vitalSigns.saturationO2.change}
                        icon="lungs"
                    />
                    <VitalSignCard 
                        label="Respiration"
                        value={vitalSigns.respiration.value}
                        unit={vitalSigns.respiration.unit}
                        trend={vitalSigns.respiration.trend}
                        change={vitalSigns.respiration.change}
                        icon="wind"
                    />
                </div>
            </div>
            <div className="card-footer">
                <a href="#" className="resource-link">
                    <i className="fas fa-info-circle resource-icon"></i>
                    Comprendre ces paramètres
                </a>
            </div>
        </div>
    );
};

export default VitalSignsSection;