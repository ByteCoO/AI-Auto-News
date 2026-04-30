import React, { useMemo } from 'react';
import { Lead } from '../types';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis
} from 'recharts';

interface FinancialChartsProps {
  leads: Lead[];
}

export function FinancialCharts({ leads }: FinancialChartsProps) {
  // Generate some "financial" looking data based on leads for the Area Chart
  const pipelineData = useMemo(() => {
    let baseValue = 10000;
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
      // Create an upward trending mock projection
      baseValue += Math.floor(Math.random() * 5000) + 1000;
      return {
        day,
        projectedValue: baseValue,
        baseline: baseValue * 0.7 + Math.random() * 2000
      };
    });
  }, []);

  // Use actual lead data for the scatter plot (Score vs Probability)
  const scatterData = useMemo(() => {
    return leads.map((l, idx) => ({
      id: l.lead_id.substring(0, 8),
      score: Math.round(l.match_score * 100),
      probability: Math.round(l.sales_intelligence.conversion_probability * 100),
      intentValue: l.intent_signal === 'HIGH' ? 800 : 300,
      product: l.context.target_product
    }));
  }, [leads]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Target Pipeline Projection */}
      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-5 shadow-lg shadow-black/20">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-zinc-100 font-bold text-lg mb-1 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-500 rounded-full"></span>
              7-Day Pipeline Projection
            </h3>
            <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Estimated Net Value (USD)</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-amber-500">$34,850</span>
            <p className="text-emerald-400 text-xs font-bold flex items-center justify-end gap-1">
              ▲ +12.4% vs last week
            </p>
          </div>
        </div>
        
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pipelineData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#52525b" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#52525b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="day" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }}
                itemStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="baseline" stroke="#52525b" strokeWidth={2} fillOpacity={1} fill="url(#colorBaseline)" />
              <Area type="monotone" dataKey="projectedValue" name="Projected Value" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Signal Matrix Scatter */}
      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-5 shadow-lg shadow-black/20">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-zinc-100 font-bold text-lg mb-1 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-500 rounded-full"></span>
              Lead Signal Matrix
            </h3>
            <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Match Score vs. Probability</p>
          </div>
        </div>
        
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={true} horizontal={true} />
              <XAxis dataKey="score" type="number" name="Match Score" unit="%" domain={[60, 100]} stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="probability" type="number" name="Probability" unit="%" domain={[30, 100]} stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
              <ZAxis dataKey="intentValue" range={[60, 400]} name="Intent Strength" />
              <RechartsTooltip 
                cursor={{ strokeDasharray: '3 3', stroke: '#52525b' }}
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }}
                formatter={(value: any, name: string) => [`${value}%`, name]}
                labelFormatter={() => ''}
              />
              <Scatter name="Leads" data={scatterData} fill="#f59e0b" opacity={0.8}>
                {
                  scatterData.map((entry, index) => (
                    <cell key={`cell-${index}`} fill={entry.intentValue > 500 ? '#f59e0b' : '#52525b'} />
                  ))
                }
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
