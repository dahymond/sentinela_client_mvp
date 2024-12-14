import { useAppDispatch, useAppSelector } from "@/store/hook";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";
import { ScrollArea } from "../../../../ui/scroll-area";
import { getMainAlert } from "@/store/slices/alertsSlice";
import {
  estTimeZone,
  readableSanctionString,
} from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { spinner } from "@/app/components/ui/spinner";

export function MainAlertQueue({
  activeAlertIndex,
  setActiveAlertIndex,
}: {
  activeAlertIndex: number | null;
  setActiveAlertIndex: Dispatch<SetStateAction<number | null>>;
}) {
  const dispatch = useAppDispatch();
  const { main_alert_mini_details, main_alert_loading } = useAppSelector(
    (store) => store.alertSlice
  );
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Main Alert</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[1fr,1fr,1fr,1fr,2fr] gap-4 pb-3 px-7 place-items-center text-sm font-bold">
          <span>Alert ID</span>
          <span>Disposition</span>
          <span>Watchlist Match</span>
          <span>Risk Score</span>
          <span>Alert Date</span>
        </div>
        <ScrollArea className="max-h-[70px] text-[15px]">
          {main_alert_mini_details && (
            <div
              className={`grid grid-cols-[1fr,1fr,1fr,1fr,2fr] gap-4 ${
                activeAlertIndex === null && "bg-gray-100"
              } p-2 hover:bg-gray-200 cursor-pointer rounded-md place-items-center text-center`}
              onClick={async () => {
                setActiveAlertIndex(null);
                await dispatch(
                  getMainAlert(Number(main_alert_mini_details.id))
                );
              }}
            >
              <div className="flex items-center gap-2">
                {" "}
                {activeAlertIndex === null && main_alert_loading && (
                  <span className="text-green-600">{spinner()}</span>
                )}
                {activeAlertIndex === null && !main_alert_loading && (
                  <CheckCircle2 className="text-green-700 text-xs" size={20} />
                )}{" "}
                {main_alert_mini_details.custom_id}
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  main_alert_mini_details.disposition === "Pending Review"
                    ? "bg-yellow-100 text-yellow-800"
                    : main_alert_mini_details.disposition === "False Positive"
                    ? "bg-green-100 text-green-800"
                    : main_alert_mini_details.disposition === "Escalated"
                    ? "bg-red-100 text-red-800"
                    : main_alert_mini_details.disposition === "Inconclusive"
                    ? "bg-purple-200 text-red-900"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {main_alert_mini_details?.disposition}
              </span>
              <span>
                {readableSanctionString(
                  main_alert_mini_details.sanctions_source
                ) || main_alert_mini_details.sanctions_source}
              </span>
              <span>{Number(main_alert_mini_details?.score)?.toFixed(0)}</span>
              <span className="text-md">
                {estTimeZone(main_alert_mini_details?.alertDateTime)}
              </span>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
