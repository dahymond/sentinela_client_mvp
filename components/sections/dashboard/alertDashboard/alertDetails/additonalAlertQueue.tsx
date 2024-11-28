import { AlertType } from "../../../../interfaces/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";
import { ScrollArea } from "../../../../ui/scroll-area";

export function AdditionalAlertsQueue({ alerts, onSelectAlert }: { alerts: AlertType[], onSelectAlert: (alert: AlertType) => void }) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Additional Alerts for This Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => onSelectAlert({...alert, additionalAlertsCount: alerts.length - 1})}
              >
                <span>Alert ID: {alert.id}</span>
                <span>Watchlist Match: {alert.match}</span>
                <span>Risk Score: {alert.score}</span>
                <span>Alert Date: {alert.alertDateTime}</span>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }