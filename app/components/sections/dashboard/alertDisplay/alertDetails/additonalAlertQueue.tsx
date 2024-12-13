import { useAppDispatch, useAppSelector } from "@/store/hook";
import { MainAlert } from "../../../../interfaces/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";
import { ScrollArea } from "../../../../ui/scroll-area";
import { getAdditionalAlert } from "@/store/slices/alertsSlice";
import { estTimeZone, readableSanctionString, useToast } from "@/lib/utils";
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
  const { additional_alerts_loading } = useAppSelector(
    (store) => store.alertSlice
  );
  const toast = useToast()
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Additional Alerts</CardTitle>
      </CardHeader>
      {alerts.length > 0 && (
        <div className="grid grid-cols-[1fr,1fr,1fr,1fr,2fr] gap-4 p-2 px-7 place-items-center text-sm font-bold">
          <span>Alert ID</span>
          <span>Disposition</span>
          <span>Watchlist Match</span>
          <span>Risk Score</span>
          <span>Alert Date</span>
        </div>
      )}
      <CardContent>
        <ScrollArea
          className={`min-h-[50px] max-h-[200px] text-[15px] ${
            additional_alerts_loading
              ? "pointer-events-none opacity-70"
              : "opacity-100"
          }`}
        >
          {/* additional alerts map */}
          {alerts.length === 0 && (
            <div className="flex -mt-2">
              <p className="bg-red-50 p-2">None available</p>
            </div>
          )}
          {alerts.length > 0 &&
            alerts.map((alert, i: number) => {
              const iswholenumber = i % 2;
              return (
                <div
                  key={alert.id}
                  className={`grid grid-cols-[1fr,1fr,1fr,1fr,2fr] gap-4 p-2 text-gray-600 ${
                    activeAlertIndex === i && "font-bold text-gray-800"
                  } hover:bg-gray-100 ${
                    !iswholenumber ? "bg-gray-50" : "bg-white"
                  } cursor-pointer rounded-md place-items-center text-center`}
                  onClick={async () => {
                    setActiveAlertIndex(i);
                    const result = await dispatch(getAdditionalAlert(Number(alert.id)));
                    if (result.meta.requestStatus === "rejected") {
                      toast(
                        "error",
                        typeof result.payload == "string"
                          ? result.payload
                          : JSON.stringify(result.payload)
                      );
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    {" "}
                    {activeAlertIndex === i && additional_alerts_loading && (
                      <span className="text-green-600">{spinner()}</span>
                    )}
                    {activeAlertIndex === i && !additional_alerts_loading && (
                      <CheckCircle2
                        className="text-green-700 text-xs"
                        size={20}
                      />
                    )}{" "}
                    {alert.id}
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      alert.disposition === "Pending Review"
                        ? "bg-yellow-100 text-yellow-800"
                        : alert.disposition === "False Positive"
                        ? "bg-green-100 text-green-800"
                        : alert.disposition === "Escalated"
                        ? "bg-red-100 text-red-800"
                        : alert.disposition === "Inconclusive"
                        ? "bg-purple-200 text-red-900"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {alert?.disposition}
                  </span>
                  <span>
                    {" "}
                    {readableSanctionString(alert.sanctions_source) ||
                      alert.sanctions_source}
                  </span>
                  <span>{Number(alert?.score)?.toFixed(0)}</span>
                  <span className="text-md">
                    {estTimeZone(alert?.alertDateTime)}
                  </span>
                </div>
              );
            })}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
