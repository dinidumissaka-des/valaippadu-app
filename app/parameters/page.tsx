'use client';
import { useWeatherContext } from '../../context/WeatherContext';
import { ParameterGaugeBar } from '../../components/ParameterGaugeBar';
import { ParamKey } from '../../constants/thresholds';

const PARAM_ORDER: ParamKey[] = ['salinity', 'temperature', 'rainfall', 'wave_height', 'turbidity'];

export default function ParametersPage() {
  const { current, loading } = useWeatherContext();

  if (loading || !current) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#F7F7F7' }}>
        <div style={{ width: 32, height: 32, border: '2.5px solid #222222', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F7F7F7', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#fff', padding: '52px 20px 16px', borderBottom: '1px solid #EEEEEE', position: 'sticky', top: 0, zIndex: 40 }}>
        <p style={{ fontFamily: 'var(--font-manrope)', fontWeight: 800, fontSize: 20, color: '#222222', margin: 0 }}>
          Today's Readings
        </p>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: 20,
          padding: '20px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
        }}>
          {PARAM_ORDER.map((key) => {
            const r = current.parameters[key];
            return <ParameterGaugeBar key={key} paramKey={key} value={r.value} source={r.source} />;
          })}
        </div>
      </div>
    </div>
  );
}
