import { useAppDispatch, useAppSelector } from "@/store/hook";
import { MainAlert } from "../../../../interfaces/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";
import { ScrollArea } from "../../../../ui/scroll-area";
import { getAdditionalAlert } from "@/store/slices/alertsSlice";
import { isValidDateString, readableSanctionString } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { spinner } from "@/app/components/ui/spinner";

export function AdditionalAlertsQueue({
  alerts,
  activeAlertIndex,
  setActiveAlertIndex,
}: {
  alerts: MainAlert[];
  activeAlertIndex: number | null;
  setActiveAlertIndex: Dispatch<SetStateAction<number | null>>;
}) {
  const dispatch = useAppDispatch();
  const { main_alert_loading } = useAppSelector(
    (store) => store.alertSlice
  );
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Additional Alerts for This Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="min-h-[50px] max-h-[400px] text-[13px]">
          {/* additional alerts map */}
          {alerts.length === 0 && <div>None available</div>}
          {alerts.length > 0 &&
            alerts.map((alert, i: number) => (
              <div
                key={alert.id}
                className={`grid grid-cols-4 gap-4 p-2 ${
                  activeAlertIndex === i && "bg-gray-100"
                } hover:bg-gray-200 cursor-pointer rounded-md items-center`}
                onClick={async () => {
                  setActiveAlertIndex(i);
                  await dispatch(getAdditionalAlert(Number(alert.id)));
                }}
              >
                <div className="flex items-center gap-2">
                  {" "}
                  {activeAlertIndex === i && main_alert_loading && (
                    <span className="text-green-600">{spinner()}</span>
                  )}
                  {activeAlertIndex === i && !main_alert_loading && (
                    <CheckCircle2
                      className="text-green-700 text-xs"
                      size={20}
                    />
                  )}{" "}
                  Alert ID: {alert.id}
                </div>
                <span>
                  Watchlist Match:{" "}
                  {readableSanctionString(alert.sanctions_source) ||
                    alert.sanctions_source}
                </span>
                <span>Risk Score: {Number(alert?.score)?.toFixed(0)}</span>
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
