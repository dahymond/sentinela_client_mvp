import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

const AlertAnalytics =({queueData, escalatedAlerts}:any)=>{
    const TOTAL_ALLOWED_SCREENINGS = 1000; // Hypothetical total number of screenings allowed
    const dispositionData = [
        { name: 'True Positive', value: queueData.filter((alert:any) => alert.disposition === 'True Positive').length + escalatedAlerts.filter((alert: any) => alert.disposition === 'True Positive').length },
        { name: 'False Positive', value: queueData.filter((alert:any) => alert.disposition === 'False Positive').length + escalatedAlerts.filter((alert: any) => alert.disposition === 'False Positive').length },
        { name: 'Escalated', value: queueData.filter((alert:any) => alert.disposition === 'Escalated').length + escalatedAlerts.filter((alert: any) => alert.disposition === 'Escalated').length },
        { name: 'Pending Review', value: queueData.filter((alert:any) => alert.disposition === 'Pending Review').length + escalatedAlerts.filter((alert: any) => alert.disposition === 'Pending Review').length },
      ];
    
      const watchlistData = [
        { name: 'OFAC SDN List', value: queueData.filter((alert:any) => alert.match === 'OFAC SDN List').length + escalatedAlerts.filter((alert: any) => alert.match === 'OFAC SDN List').length },
        { name: 'UN Consolidated List', value: queueData.filter((alert:any) => alert.match === 'UN Consolidated List').length + escalatedAlerts.filter((alert: any) => alert.match === 'UN Consolidated List').length },
        { name: 'EU Sanctions List', value: queueData.filter((alert:any) => alert.match === 'EU Sanctions List').length + escalatedAlerts.filter((alert: any) => alert.match === 'EU Sanctions List').length },
      ];
    
      const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']
    
      const monthlyData = [
        { month: 'Jan', alerts: 45, falsePositives: 30 },
        { month: 'Feb', alerts: 52, falsePositives: 35 },
        { month: 'Mar', alerts: 48, falsePositives: 28 },
        { month: 'Apr', alerts: 70, falsePositives: 45 },
        { month: 'May', alerts: 61, falsePositives: 39 },
        { month: 'Jun', alerts: 65, falsePositives: 42 },
      ]
    return <TabsContent value="analytics">
    <div className="grid grid-cols-2 gap-6">
      <Card className="bg-white shadow">
        <CardContent>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Disposition Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dispositionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {dispositionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="bg-white shadow">
        <CardContent>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Watchlist Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={watchlistData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {watchlistData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
    <Card className="bg-white shadow mt-6">
      <CardContent>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Alert Summary</h3>
        <table className="w-full text-gray-800">
          <thead>
            <tr className="text-left border-b border-gray-200">
              <th className="pb-2">Metric</th>
              <th className="pb-2">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">Total Alerts</td>
              <td className="py-2">{queueData.length + escalatedAlerts.length}</td>
            </tr>
            <tr>
              <td className="py-2">Average Risk Score</td>
              <td className="py-2">
                {((queueData.reduce((sum:any, alert:any) => sum + alert.score, 0) +
                  escalatedAlerts.reduce((sum: any, alert: any) => sum + alert.score, 0)) /
                  (queueData.length + escalatedAlerts.length)).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="py-2">Alerts Requiring Action</td>
              <td className="py-2">
                {queueData.filter((alert:any) => ['True Positive', 'Escalated', 'Pending Review'].includes(alert.disposition)).length +
                  escalatedAlerts.filter((alert: any) => ['True Positive', 'Escalated', 'Pending Review'].includes(alert.disposition)).length}
              </td>
            </tr>
            <tr>
              <td className="py-2">Screenings Left</td>
              <td className="py-2">
                {Math.max(0, TOTAL_ALLOWED_SCREENINGS - (queueData.length + escalatedAlerts.length))}
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
    <Card className="bg-white shadow mt-6">
      <CardContent>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Alert Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="alerts" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="falsePositives" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </TabsContent>
}

export default AlertAnalytics