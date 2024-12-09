import { updatealertsSlice } from "@/store/slices/alertsSlice";
import { AlertDetails } from "../alertDisplay/alertDetails/alertDetails";
import { useAppDispatch } from "@/store/hook";

const AlertEscalation = ({
  selectedAlert,
  handleUpdateDisposition,
  renderAlertTable,
  queueData,
  escalatedAlerts,
}: any) => {
  const dispatch = useAppDispatch();
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Escalated Alerts
      </h2>
      {selectedAlert ? (
        <AlertDetails
          alert={selectedAlert}
          onBack={() =>
            dispatch(updatealertsSlice({ name: "main_alert", value: null }))
          }
          onUpdateDisposition={handleUpdateDisposition}
          allAlerts={[...queueData, ...escalatedAlerts]}
        />
      ) : (
        renderAlertTable(escalatedAlerts)
      )}
    </div>
  );
};

export default AlertEscalation;
