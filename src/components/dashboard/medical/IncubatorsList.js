import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/dashboard/Components.css';
import { incubateurService, patientService, constanceVitaleService } from '../../../services/api';
import { transformIncubatorData } from '../../../services/dataTransformer';
import { toast } from 'react-hot-toast';
import { calculerAge, formaterDate } from '../../../utils/dateUtils';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryTooltip, VictoryVoronoiContainer, VictoryLegend } from 'victory';

const MOCK_PERIODS = [
  { label: '24h', value: '24h' },
  { label: '7 jours', value: '7d' },
  { label: '30 jours', value: '30d' },
  { label: 'Personnalisé', value: 'custom' }
];

// Génère des données mock pour les courbes
function generateMockData(period = '24h') {
  const points = period === '24h' ? 24 : period === '7d' ? 7 : 30;
  const data = [];
  for (let i = 0; i < points; i++) {
    data.push({
      heure: period === '24h' ? `${i}h` : `J${i+1}`,
      temperature: 36.5 + Math.random(),
      heartRate: 120 + Math.round(Math.random() * 20),
      spO2: 95 + Math.round(Math.random() * 4),
      humidite: 60 + Math.round(Math.random() * 10)
    });
  }
  return data;
}

// Fonction utilitaire pour parser une date au format DD/MM/YYYY
function parseDDMMYYYY(dateStr) {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split('/');
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
}

// Composant enfant pour chaque incubateur
function IncubatorAccordionItem({ incubator, expanded, onExpand, period, MOCK_PERIODS, generateMockData, calculerAge }) {
  const [showCharts, setShowCharts] = React.useState(false);
  const [lastVitals, setLastVitals] = React.useState(null);
  const [vitalsHistory, setVitalsHistory] = React.useState([]);
  const [loadingVitals, setLoadingVitals] = React.useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    if (expanded === incubator.id && incubator.patientData && incubator.patientData.id) {
      setLoadingVitals(true);
      import('../../../services/api').then(({ constanceVitaleService }) => {
        constanceVitaleService.getByPatient(incubator.patientData.id)
          .then(vitalsList => {
            if (Array.isArray(vitalsList) && vitalsList.length > 0) {
              // Trier par date décroissante (plus récent d'abord)
              const sorted = [...vitalsList].sort((a, b) => new Date(parseDDMMYYYY(b.date)) - new Date(parseDDMMYYYY(a.date)));
              setLastVitals(sorted[0]);
              setVitalsHistory(sorted.reverse()); // du plus ancien au plus récent pour les courbes
            } else {
              setLastVitals(null);
              setVitalsHistory([]);
            }
          })
          .catch(() => { setLastVitals(null); setVitalsHistory([]); })
          .finally(() => setLoadingVitals(false));
      });
    } else {
      setLastVitals(null);
      setVitalsHistory([]);
    }
  }, [expanded, incubator.id, incubator.patientData]);

  useEffect(() => {
    if (expanded && chartRef.current) {
      console.log('=== DÉBOGAGE ===');
      console.log('Chart container:', chartRef.current);
      console.log('Chart dimensions:', chartRef.current.getBoundingClientRect());
      
      const data = getTemperatureData();
      console.log('Données température:', data);
    }
  }, [expanded]);

  const mockData = generateMockData(period);
  
  // Vérifier si nous avons des données patient
  const hasPatientData = incubator.patientData && Object.keys(incubator.patientData).length > 0;
  
  console.log('Rendu IncubatorAccordionItem:', {
    incubatorId: incubator.id,
    patientName: incubator.patient,
    hasPatientData,
    patientData: incubator.patientData,
    expanded: expanded === incubator.id
  });
  
  // Préparer les données pour les courbes dynamiques (X = index)
  const getCurveData = (key) => {
    if (!vitalsHistory || vitalsHistory.length === 0) {
      console.log(`Pas de données pour ${key}`);
      return [];
    }
    const data = vitalsHistory.map((v, i) => {
      let raw = v[key];
      if (!raw) {
        console.log(`Donnée manquante pour ${key} à l'index ${i}:`, v);
        return { x: undefined, y: undefined };
      }
      raw = String(raw).replace(/[^0-9.,-]/g, '').replace(',', '.');
      const value = parseFloat(raw);
      console.log(`Donnée ${key} à l'index ${i}:`, {
        original: v[key],
        cleaned: raw,
        parsed: value,
        date: v.date
      });
      return {
        x: i + 1,
        y: isNaN(value) ? 0 : value
      };
    }).filter(d => d.x && !isNaN(d.y));
    console.log(`Données finales pour ${key}:`, data);
    return data;
  };

  // Pour SpO2, on prend saturationO2 ou oxygene
  const getSpO2Data = () => {
    if (!vitalsHistory || vitalsHistory.length === 0) {
      console.log('Pas de données SpO2');
      return [];
    }
    const data = vitalsHistory.map((v, i) => {
      let raw = v.saturationO2 ? v.saturationO2 : v.oxygene;
      if (!raw) {
        console.log(`Donnée SpO2 manquante à l'index ${i}:`, v);
        return { x: undefined, y: undefined };
      }
      raw = String(raw).replace(/[^0-9.,-]/g, '').replace(',', '.');
      const value = parseFloat(raw);
      console.log(`Donnée SpO2 à l'index ${i}:`, {
        original: raw,
        cleaned: raw,
        parsed: value,
        date: v.date
      });
      return {
        x: i + 1,
        y: isNaN(value) ? 0 : value
      };
    }).filter(d => d.x && !isNaN(d.y));
    console.log('Données finales SpO2:', data);
    return data;
  };

  // LOGS DEBUG COURBES
  console.log('=== DONNÉES BRUTES ===');
  console.log('vitalsHistory:', vitalsHistory);
  console.log('=== DONNÉES TEMPÉRATURE ===');
  console.log('Température data:', getCurveData('temperature'));
  console.log('=== DONNÉES POULS ===');
  console.log('Pouls data:', getCurveData('pouls'));
  console.log('=== DONNÉES SpO2 ===');
  console.log('SpO2 data:', getSpO2Data());
  console.log('=== DONNÉES HUMIDITÉ ===');
  console.log('Humidité data:', getCurveData('humiditeCorp'));
  console.log('=== DONNÉES POIDS ===');
  console.log('Poids data:', getCurveData('poids'));

  const getTemperatureData = () => {
    if (!vitalsHistory || !Array.isArray(vitalsHistory)) {
      console.log('Pas de données vitales disponibles');
      return [];
    }

    return vitalsHistory.map((item, index) => {
      const temp = parseFloat(String(item.temperature).replace(/[^0-9.,-]/g, '').replace(',', '.'));
      console.log(`Point de données ${index}:`, { temp, original: item.temperature });
      return {
        x: index + 1,
        y: isNaN(temp) ? 0 : temp
      };
    });
  };

  return (
    <div className="incubator-accordion-item">
      <div className="incubator-accordion-header" onClick={() => onExpand(incubator.id)}>
        <div>
          <strong>Incubateur {incubator.id}</strong> — {incubator.patient}
        </div>
        <div className={`status-badge status-${incubator.status}`}>{incubator.status}</div>
        <button className="btn btn-outline btn-sm">Actions</button>
      </div>
      {expanded === incubator.id && (
        <div className="incubator-accordion-content">
          {/* Bloc infos patient */}
          <div className="incubator-info-blocks">
            <div className="info-block patient-block">
              <h4>Patient</h4>
              {hasPatientData ? (
                <ul>
                  <li><b>Nom :</b> {incubator.patientData.nom}</li>
                  <li><b>Âge :</b> {incubator.patientData.dateNaissance ? calculerAge(incubator.patientData.dateNaissance) : 'N/A'}</li>
                  <li><b>Sexe :</b> {incubator.patientData.sexe || 'N/A'}</li>
                  <li><b>Poids à l'admission :</b> {incubator.patientData.poids || 'N/A'}</li>
                  <li><b>Groupe sanguin :</b> {incubator.patientData.groupeSanguin || 'N/A'}</li>
                  <li><b>Allergies :</b> {incubator.patientData.allergies || 'N/A'}</li>
                  <li><b>Parents :</b> {incubator.patientData.parent || 'N/A'}</li>
                  <li><b>Téléphone :</b> {incubator.patientData.telephone || 'N/A'}</li>
                </ul>
              ) : (
                <p>Aucune information patient disponible</p>
              )}
            </div>
            {/* Bloc infos incubateur */}
            <div className="info-block incubateur-block">
              <h4>Incubateur</h4>
              <ul>
                <li><b>Modèle :</b> {incubator.model}</li>
                <li><b>Chambre :</b> {incubator.location}</li>
                <li><b>Statut :</b> {incubator.status}</li>
                <li><b>Dernière maintenance :</b> {incubator.lastMaintenance}</li>
                <li><b>Température ambiante :</b> {incubator.temperature || 'N/A'}</li>
                <li><b>Humidité :</b> {incubator.humidite || 'N/A'}</li>
                <li><b>Saturation O₂ :</b> {incubator.vitalSigns?.oxygen || 'N/A'}</li>
              </ul>
            </div>
            {/* Bloc paramètres vitaux */}
            <div className="info-block vitals-block">
              <h4>Paramètres vitaux</h4>
              {loadingVitals ? (
                <p>Chargement des constantes vitales...</p>
              ) : lastVitals ? (
                <ul>
                  <li><b>Température :</b> {lastVitals.temperature || 'N/A'}</li>
                  <li><b>Fréquence cardiaque :</b> {lastVitals.pouls || 'N/A'}</li>
                  <li><b>SpO2 :</b> {lastVitals.saturationO2 || lastVitals.oxygene || 'N/A'}</li>
                  <li><b>Humidité :</b> {lastVitals.humiditeCorp || 'N/A'}</li>
                  <li><b>Poids :</b> {lastVitals.poids || incubator.patientData?.poids || 'N/A'}</li>
                  <li><b>Date mesure :</b> {
                    lastVitals.date
                      ? (() => {
                          const d = parseDDMMYYYY(lastVitals.date);
                          return d && !isNaN(d) ? d.toLocaleString('fr-FR') : 'N/A';
                        })()
                      : 'N/A'
                  }</li>
                </ul>
              ) : (
                <ul>
                  <li><b>Température :</b> {incubator.temperature || 'N/A'}</li>
                  <li><b>Fréquence cardiaque :</b> {incubator.vitalSigns?.heartRate || 'N/A'}</li>
                  <li><b>SpO2 :</b> {incubator.vitalSigns?.oxygen || 'N/A'}</li>
                  <li><b>Humidité :</b> {incubator.humidite || 'N/A'}</li>
                  <li><b>Poids :</b> {incubator.patientData?.poids || 'N/A'}</li>
                </ul>
              )}
            </div>
          </div>
          {/* Sélecteur de période (désactivé) */}
          <div className="period-selector">
            <label>Période : </label>
            <select value={period} onChange={e => {}} disabled>
              {MOCK_PERIODS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          {/* Graphiques dynamiques */}
          <div className="incubator-charts-row">
            <div className="chart-block">
              <h5><i className="fas fa-thermometer-half" style={{ fontSize: '1.4em', color: '#e67e22', marginRight: 8 }}></i>Température</h5>
              <div className="chart-container" ref={chartRef}>
                <VictoryChart
                  theme={VictoryTheme.material}
                  width={400}
                  height={250}
                  padding={{ top: 30, right: 30, bottom: 50, left: 50 }}
                  domainPadding={{ x: 20, y: 20 }}
                >
                  <VictoryAxis
                    dependentAxis
                    tickFormat={(t) => `${t}°C`}
                    style={{
                      axis: { stroke: '#e67e22' },
                      tickLabels: { fill: '#e67e22' }
                    }}
                  />
                  <VictoryAxis
                    tickFormat={(t) => `Point ${t}`}
                    style={{
                      axis: { stroke: '#e67e22' },
                      tickLabels: { fill: '#e67e22', angle: 45 }
                    }}
                  />
                  <VictoryLine
                    data={getTemperatureData()}
                    style={{
                      data: { stroke: '#e67e22', strokeWidth: 3 }
                    }}
                  />
                </VictoryChart>
              </div>
            </div>
            <div className="chart-block">
              <h5><i className="fas fa-heartbeat" style={{ fontSize: '1.4em', color: '#e74c3c', marginRight: 8 }}></i>Fréquence cardiaque</h5>
              <div className="chart-container">
                <VictoryChart
                  theme={VictoryTheme.material}
                  width={400}
                  height={250}
                  padding={{ top: 30, right: 30, bottom: 50, left: 50 }}
                  domainPadding={{ x: 20, y: 20 }}
                >
                  <VictoryAxis
                    dependentAxis
                    tickFormat={(t) => `${t} bpm`}
                    style={{
                      axis: { stroke: '#e74c3c' },
                      tickLabels: { fill: '#e74c3c' }
                    }}
                  />
                  <VictoryAxis
                    tickFormat={(t) => `Point ${t}`}
                    style={{
                      axis: { stroke: '#e74c3c' },
                      tickLabels: { fill: '#e74c3c', angle: 45 }
                    }}
                  />
                  <VictoryLine
                    data={getCurveData('pouls')}
                    style={{
                      data: { stroke: '#e74c3c', strokeWidth: 3 }
                    }}
                  />
                </VictoryChart>
              </div>
            </div>
            <div className="chart-block">
              <h5><i className="fas fa-wind" style={{ fontSize: '1.4em', color: '#3498db', marginRight: 8 }}></i>SpO2</h5>
              <div className="chart-container">
                <VictoryChart
                  theme={VictoryTheme.material}
                  width={400}
                  height={250}
                  padding={{ top: 30, right: 30, bottom: 50, left: 50 }}
                  domainPadding={{ x: 20, y: 20 }}
                >
                  <VictoryAxis
                    dependentAxis
                    tickFormat={(t) => `${t}%`}
                    style={{
                      axis: { stroke: '#3498db' },
                      tickLabels: { fill: '#3498db' }
                    }}
                  />
                  <VictoryAxis
                    tickFormat={(t) => `Point ${t}`}
                    style={{
                      axis: { stroke: '#3498db' },
                      tickLabels: { fill: '#3498db', angle: 45 }
                    }}
                  />
                  <VictoryLine
                    data={getSpO2Data()}
                    style={{
                      data: { stroke: '#3498db', strokeWidth: 3 }
                    }}
                  />
                </VictoryChart>
              </div>
            </div>
            <div className="chart-block">
              <h5><i className="fas fa-tint" style={{ fontSize: '1.4em', color: '#27ae60', marginRight: 8 }}></i>Humidité</h5>
              <div className="chart-container">
                <VictoryChart
                  theme={VictoryTheme.material}
                  width={400}
                  height={250}
                  padding={{ top: 30, right: 30, bottom: 50, left: 50 }} 
                  domainPadding={{ x: 20, y: 20 }}
                >
                  <VictoryAxis
                    dependentAxis
                    tickFormat={(t) => `${t}%`}
                    style={{
                      axis: { stroke: '#27ae60' },
                      tickLabels: { fill: '#27ae60' }
                    }}
                  />
                  <VictoryAxis
                    tickFormat={(t) => `Point ${t}`}
                    style={{
                      axis: { stroke: '#27ae60' },
                      tickLabels: { fill: '#27ae60', angle: 45 }
                    }}
                  />
                  <VictoryLine
                    data={getCurveData('humiditeCorp')}
                    style={{
                      data: { stroke: '#27ae60', strokeWidth: 3 }
                    }}
                  />
                </VictoryChart>
              </div>
            </div>
            <div className="chart-block">
              <h5><i className="fas fa-weight" style={{ fontSize: '1.4em', color: '#8e44ad', marginRight: 8 }}></i>Poids</h5>
              <div className="chart-container">
                <VictoryChart
                  theme={VictoryTheme.material}
                  width={400}
                  height={250}
                  padding={{ top: 30, right: 30, bottom: 50, left: 50 }}
                  domainPadding={{ x: 20, y: 20 }}
                >
                  <VictoryAxis
                    dependentAxis
                    tickFormat={(t) => `${t} kg`}
                    style={{
                      axis: { stroke: '#8e44ad' },
                      tickLabels: { fill: '#8e44ad' }
                    }}
                  />
                  <VictoryAxis
                    tickFormat={(t) => `Point ${t}`}
                    style={{
                      axis: { stroke: '#8e44ad' },
                      tickLabels: { fill: '#8e44ad', angle: 45 }
                    }}
                  />
                  <VictoryLine
                    data={getCurveData('poids')}
                    style={{
                      data: { stroke: '#8e44ad', strokeWidth: 3 }
                    }}
                  />
                </VictoryChart>
              </div>
            </div>
          </div>
          {/* Actions rapides (exemple) */}
          <div className="incubator-actions-row">
            <button className="btn btn-outline btn-sm">Alerte</button>
            <button className="btn btn-outline btn-sm">Historique</button>
            <button className="btn btn-outline btn-sm">Imprimer</button>
          </div>
        </div>
      )}
    </div>
  );
}

function IncubatorsList() {
  const navigate = useNavigate();
  const [incubators, setIncubators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null); // Accordéon ouvert
  const [period, setPeriod] = useState('24h');

  useEffect(() => {
    fetchIncubators();
  }, []);

  const fetchIncubators = async () => {
    try {
      setLoading(true);
      // Récupérer les incubateurs
      const incubateursResponse = await incubateurService.getAll();
      console.log('1. Incubateurs récupérés (brut):', JSON.stringify(incubateursResponse, null, 2));
      
      // Récupérer les patients
      const patientsResponse = await patientService.getAll();
      console.log('2. Patients récupérés (brut):', JSON.stringify(patientsResponse, null, 2));
      
      // Associer les patients aux incubateurs
      const incubateursWithPatients = incubateursResponse.map(incubateur => {
        console.log(`\n3. Traitement de l'incubateur ${incubateur.id}:`, {
          incubateurId: incubateur.id,
          incubateurPatient: incubateur.patient,
          incubateurStatus: incubateur.status
        });

        // Trouver le patient associé à cet incubateur
        const patientMatch = patientsResponse.find(p => {
          // Vérifier si le patient a cet incubateur dans son champ incubateur
          const patientHasIncubateur = p.incubateur && p.incubateur.toString() === incubateur.id.toString();
          
          // Vérifier si l'incubateur a ce patient dans son champ patient
          const incubateurHasPatient = incubateur.patient && p.nom === incubateur.patient;
          
          console.log(`   Vérification du patient ${p.id}:`, {
            patientIncubateur: p.incubateur,
            patientNom: p.nom,
            matchIncubateur: patientHasIncubateur,
            matchNom: incubateurHasPatient
          });
          
          return patientHasIncubateur || incubateurHasPatient;
        });
        
        console.log(`4. Patient trouvé pour l'incubateur ${incubateur.id}:`, patientMatch);
        
        if (patientMatch) {
          // Si on trouve un patient, on met à jour les deux côtés de la relation
          const result = {
            ...incubateur,
            patient: patientMatch.nom,
            patientData: {
              ...patientMatch,
              incubateur: incubateur.id.toString()
            }
          };
          console.log(`5. Données combinées pour l'incubateur ${incubateur.id}:`, result);
          return result;
        }
        
        // Si pas de patient trouvé, on garde les données de base de l'incubateur
        const result = {
          ...incubateur,
          patient: incubateur.patient || 'Non assigné',
          patientData: null
        };
        console.log(`6. Incubateur ${incubateur.id} sans patient:`, result);
        return result;
      });
      
      console.log('7. Tous les incubateurs avec patients:', incubateursWithPatients);
      
      // Transformer les données pour l'affichage
      const transformedData = transformIncubatorData(incubateursWithPatients);
      console.log('8. Données finales transformées:', transformedData);
      setIncubators(transformedData);
    } catch (error) {
      console.error('Erreur lors du chargement des incubateurs:', error);
      toast.error('Erreur lors du chargement des incubateurs');
      setIncubators([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div className="main-content" id="main-content">
      <div className="topbar">
        <h1 className="page-title">Gestion des incubateurs</h1>
      </div>
      <div className="dashboard-content">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des incubateurs...</p>
          </div>
        ) : (
          <div className="incubators-accordion-list">
            {incubators.map((incubator, idx) => (
              <IncubatorAccordionItem
                key={incubator.id}
                incubator={incubator}
                expanded={expanded}
                onExpand={handleExpand}
                period={period}
                MOCK_PERIODS={MOCK_PERIODS}
                generateMockData={generateMockData}
                calculerAge={calculerAge}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default IncubatorsList;