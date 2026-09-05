import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Cpu, 
  Database, 
  Layers, 
  Server, 
  Radio, 
  Code, 
  Workflow, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Smartphone,
  ExternalLink
} from 'lucide-react';

export const TechnicalArchitecturePage: React.FC = () => {
  const { setActiveTab } = useApp();

  const dataSources = [
    { title: 'IMD Radar & AWS Networks', type: 'Meteorological Data', desc: 'Doppler precipitation reflectivities, barometric pressure, wind velocity vectors.' },
    { title: 'ISRO / Bhuvan Topography', type: 'Satellite GIS & DEM', desc: 'High-resolution digital elevation models (DEM), watershed drainage contours, land-use mapping.' },
    { title: 'NASA POWER Climatology', type: 'Surface Energy Flux', desc: 'Solar radiation (MJ/m²), dew point, relative humidity saturation, vapor pressure deficits.' },
    { title: 'OpenStreetMap & LGD India', type: 'Administrative Boundaries', desc: 'Panchayat, Block, District shapefiles aligned with the Local Government Directory (LGD).' },
    { title: 'Agmarknet / e-NAM', type: 'Market Baseline Data', desc: 'Mandi price indicators, commodity modal rates used to benchmark direct farmer price transparency.' }
  ];

  const pipelineStages = [
    { num: '01', title: 'Data Ingestion & Normalization', desc: 'Asynchronous collectors ingest multi-format raster and vector data every 15 minutes.' },
    { num: '02', title: 'Topographical Feature Engineering', desc: 'Extracts slope gradients, wetland proximity indices, and antecedent soil moisture.' },
    { num: '03', title: 'XGBoost Micro-Grid Downscaling', desc: 'Downscales 25km regional numerical weather outputs into 2.5km Panchayat catchment cells.' },
    { num: '04', title: 'Agronomic Ruleset Matching', desc: 'Correlates meteorological thresholds with crop growth stages (ICAR / KVK validated logic).' },
    { num: '05', title: 'Multi-Channel Early Warning Engine', desc: 'Dispatches priority alerts via WebSocket push, cellular SMS gateways, and automated IVR queues.' },
    { num: '06', title: 'Direct Market Settlement Routing', desc: 'Connects farmgate produce listings with nearby urban consumer hubs, facilitating direct payout.' }
  ];

  const backendComponents = [
    { name: 'FastAPI Microservices', role: 'High-throughput async Python REST API gateway serving downscaled forecasts and alert endpoints.' },
    { name: 'PostgreSQL + PostGIS', role: 'Spatial database storing Panchayat polygons, GPS farm plots, and spatial bounding boxes.' },
    { name: 'Redis Cache & Celery', role: 'In-memory caching for low-latency weather requests and asynchronous task queues for SMS/IVR broadcast.' },
    { name: 'MLflow Model Registry', role: 'Tracks downscaling model weights, training runs, and cross-validation accuracy metrics.' },
    { name: 'IVR / Telecom Gateway', role: 'Integrates with Kisan Call Center (KCC) and cloud telecom gateways (Twilio / Exotel) for voice synthesis.' }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Title */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
          <Cpu className="w-4 h-4 text-emerald-700" />
          Production-Grade System Architecture
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          KrishiKavach Engineering Stack & Data Pipelines
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          A blueprint designed for state agricultural departments, disaster management authorities, and rural cooperatives. Built with open-source frameworks and cloud-native microservices.
        </p>
      </div>

      {/* END-TO-END WORKFLOW DIAGRAM */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-slate-900">End-to-End Processing Workflow</h2>
          <p className="text-xs text-slate-500">From satellite and radar telemetry to multi-channel delivery</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pipelineStages.map((stage, idx) => (
            <div key={idx} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 relative overflow-hidden">
              <div className="text-2xl font-black text-emerald-700/30">{stage.num}</div>
              <h3 className="font-bold text-slate-900 text-sm">{stage.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{stage.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* DATA SOURCES & INGESTION ARCHITECTURE */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-slate-900">Multi-Modal Ingestion Sources</h2>
          <p className="text-xs text-slate-500">Authoritative government and open-source meteorological telemetry</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {dataSources.map((ds, i) => (
            <div key={i} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-sm">
                  {ds.type}
                </span>
                <Database className="w-4 h-4 text-slate-400" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{ds.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{ds.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* BACKEND MICROSERVICES & CLOUD SPECIFICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Backend & DB (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">Backend & Cloud Blueprint</h3>
            <p className="text-xs text-slate-500">Horizontal scaling ready for 1,000+ Panchayats</p>
          </div>

          <div className="space-y-3">
            {backendComponents.map((b, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                  <Server className="w-4 h-4 text-emerald-700" />
                  <span>{b.name}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{b.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Machine Learning & Frontend (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">Machine Learning & Frontend</h3>
            <p className="text-xs text-slate-500">Client and predictive stack components</p>
          </div>

          <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
            <div className="text-xs font-bold text-emerald-950 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-700" />
              <span>Downscaling ML Engine (XGBoost)</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Trained on historical AWS ground station rain gauges and satellite radar reflectivities to learn localized convective biases caused by coastal and river delta topography.
            </p>
            <div className="pt-2 text-[10px] text-emerald-800 font-bold">
              *Label: ML outputs serve as advisory estimates, not deterministic guarantees.
            </div>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <Code className="w-4 h-4 text-slate-700" />
              <span>Frontend Architecture</span>
            </div>
            <ul className="space-y-1 text-slate-600 list-disc list-inside">
              <li>React 19 + TypeScript for strict type safety</li>
              <li>Tailwind CSS design system</li>
              <li>Recharts interactive data visualization</li>
              <li>Web Speech API for audio synthesis</li>
              <li>Accessible design for keyboard & screen readers</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
