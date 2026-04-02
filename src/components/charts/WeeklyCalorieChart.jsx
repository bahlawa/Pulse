import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, ReferenceLine, Cell } from 'recharts';

export function WeeklyCalorieChart({ target }) {
  // Generate mock data for the week to look good for the demo
  const data = [
    { name: 'M', value: target * 0.9 },
    { name: 'T', value: target * 1.1 },
    { name: 'W', value: target * 0.85 },
    { name: 'T', value: target * 0.95 },
    { name: 'F', value: target * 1.2 },
    { name: 'S', value: target * 1.05 },
    { name: 'S', value: target * 0.8 },
  ];

  return (
    <div className="h-48 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 13, fontWeight: 'bold' }} 
            dy={10}
          />
          <Tooltip 
            cursor={{ fill: 'var(--bg-card)', opacity: 0.5 }}
            contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px' }}
            itemStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
            formatter={(value) => [`${Math.round(value)} kcal`, 'Consumed']}
          />
          <ReferenceLine y={target} stroke="var(--border)" strokeDasharray="3 3" />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === data.length - 1 ? 'var(--accent)' : 'var(--border)'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
