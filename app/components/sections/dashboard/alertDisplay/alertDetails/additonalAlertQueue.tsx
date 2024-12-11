import { useAppDispatch } from "@/store/hook";
import { MainAlert } from "../../../../interfaces/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";
import { ScrollArea } from "../../../../ui/scroll-area";
import { getAdditionalAlert } from "@/store/slices/alertsSlice";
import { isValidDateString, readableSanctionString } from "@/lib/utils";

export function AdditionalAlertsQueue({ alerts }: { alerts: MainAlert[] }) {
  const dispatch = useAppDispatch();
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Additional Alerts for This Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[120px] text-[13px]">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="grid grid-cols-4 gap-4 p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => dispatch(getAdditionalAlert(Number(alert.id)))}
            >
              <span>Alert ID: {alert.id}</span>
              <span>
                Watchlist Match:{" "}
                {readableSanctionString(alert.sanctions_source) ||
                  alert.sanctions_source}
              </span>
              <span>Risk Score: {alert.score}</span>
              <span className="text-xs">
                Alert Date:{" "}
                {isValidDateString(alert?.alertDateTime)
                  ? new Date(alert?.alertDateTime).toUTCString()
                  : "N/A"}
              </span>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
