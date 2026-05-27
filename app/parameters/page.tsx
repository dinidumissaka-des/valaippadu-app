'use client';
import { useWeatherContext } from '../../context/WeatherContext';
import { ParameterGaugeBar } from '../../components/ParameterGaugeBar';
import { Card, CardContent } from '../../components/ui/card';
import { ParamKey } from '../../constants/thresholds';

const PARAM_ORDER: ParamKey[] = ['salinity', 'temperature', 'rainfall', 'wave_height', 'turbidity'];

export default function ParametersPage() {
  const { current, loading } = useWeatherContext();

  if (loading || !current) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      <div className="px-4 bg-white border-b border-slate-100" style={{ paddingTop: 52, paddingBottom: 12 }}>
        <p style={{ fontFamily: 'var(--font-manrope)', fontWeight: 800, fontSize: 15, color: '#0f172a', margin: 0 }}>
          Today's Readings
        </p>
      </div>
      <div className="p-4 pb-10">
        <Card>
          <CardContent className="pt-4">
            {PARAM_ORDER.map((key) => {
              const r = current.parameters[key];
              return <ParameterGaugeBar key={key} paramKey={key} value={r.value} source={r.source} />;
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
