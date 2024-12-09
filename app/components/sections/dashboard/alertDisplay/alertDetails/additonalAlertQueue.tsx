import { useAppDispatch } from "@/store/hook";
import { MainAlert } from "../../../../interfaces/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";
import { ScrollArea } from "../../../../ui/scroll-area";
import { getAdditionalAlert } from "@/store/slices/alertsSlice";

export function AdditionalAlertsQueue({ alerts }: { alerts: MainAlert[] }) {
  const dispatch = useAppDispatch();
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Additional Alerts for This Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[100px]">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => dispatch(getAdditionalAlert(Number(alert.id)))}
            >
              <span>Alert ID: {alert.id}</span>
              <span>Watchlist Match: {alert.sanctions_source}</span>
              <span>Risk Score: {alert.score}</span>
              <span>Alert Date: {alert.alertDateTime}</span>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
