import { useAppDispatch, useAppSelector } from "@/store/hook";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";
import { ScrollArea } from "../../../../ui/scroll-area";
import { getMainAlert } from "@/store/slices/alertsSlice";
import { isValidDateString, readableSanctionString } from "@/lib/utils";
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
        <CardTitle>Main Alert for This Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[70px] text-[13px]">
          {main_alert_mini_details && (
            <div
              className={`grid grid-cols-4 gap-4 ${
                activeAlertIndex === null && "bg-gray-100"
              } p-2 hover:bg-gray-200 cursor-pointer items-center rounded-md`}
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
                Alert ID: {main_alert_mini_details.id}
              </div>
              <span>
                Watchlist Match:{" "}
                {readableSanctionString(
                  main_alert_mini_details.sanctions_source
                ) || main_alert_mini_details.sanctions_source}
              </span>
              <span>
                Risk Score: {Number(main_alert_mini_details?.score)?.toFixed(0)}
              </span>
              <span className="text-xs">
                Alert Date:{" "}
                {isValidDateString(main_alert_mini_details?.alertDateTime)
                  ? new Date(
                      main_alert_mini_details?.alertDateTime
                    ).toUTCString()
                  : "N/A"}
              </span>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
