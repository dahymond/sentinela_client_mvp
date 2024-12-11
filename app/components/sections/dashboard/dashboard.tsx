"use client";
import { ReactElement, useEffect, useState } from "react";
import {
  Shield,
  Search,
  Menu,
  X,
  Download,
  AlertTriangle,
  User,
  ArrowLeftCircle,
  ArrowRightCircle,
  SearchIcon,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { AlertDetails } from "./alertDisplay/alertDetails/alertDetails";
import AlertQueueTab from "./alertDisplay/alertTabs/alertQueueTab";
import AlertAnalytics from "./alertDisplay/alertTabs/alertAnalytics";
import { signOut } from "next-auth/react";
import Image from "next/image";
import AlertEscalation from "./alertEscalation/alertEscalation";
import AlertScreeningSetup from "./alertScreeningSetup/alertScreeningSetup";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { ActiveTabsType, Column } from "../../interfaces/interfaces";
import {
  getAllAlerts,
  getMainAlert,
  updatealertsSlice,
} from "@/store/slices/alertsSlice";
import { Session } from "next-auth";
import { baseClientURL } from "@/lib/utils";

export function DashboardComponent({ session }: { session: Session }) {
  const [firstName, setFirstName] = useState<string | undefined>("");
  const [lastName, setLastName] = useState<string | undefined>("");
  const dispatch = useAppDispatch();

  const { all_main_alerts, main_alert, main_alert_loading } = useAppSelector(
    (store) => store.alertSlice
  );
  const [activeTab, setActiveTab] = useState<ActiveTabsType>("alerts");
  // const [main_alert, setSelectedAlert] = useState<any>(main_alert);
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  const [escalatedAlerts, setEscalatedAlerts] = useState<any>([]);
  const [columnOrder, setColumnOrder] = useState<Column[]>([
    "id",
    "name",
    "sanctions_source",
    "disposition",
    "score",
    "additionalAlertsCount",
  ]);

  useEffect(() => {
    dispatch(getAllAlerts());
  }, [dispatch]);

  useEffect(() => {
    setFirstName(session?.user?.firstName);
    setLastName(session?.user?.lastName);
  }, [session]);

  const menuItems: {
    icon: ReactElement;
    label: string;
    value: "alerts" | "escalations" | "setup";
  }[] = [
    {
      icon: <SearchIcon className="w-5 h-5" />,
      label: "Screening Search",
      value: "setup",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      label: "Alerts Dashboard",
      value: "alerts",
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      label: "Escalations",
      value: "escalations",
    },
  ];

  const handleColumnOrderChange = (column: Column, direction: number) => {
    const currentIndex = columnOrder.indexOf(column);
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < columnOrder.length) {
      const newOrder = [...columnOrder];
      newOrder.splice(currentIndex, 1);
      newOrder.splice(newIndex, 0, column);
      setColumnOrder(newOrder);
    }
  };

  const renderAlertTable = (data: any) => (
    <div className="overflow-x-auto">
      {data?.length > 0 && (
        <table className="my-5 w-full">
          <thead className="">
            <tr className="text-left text-gray-600 border-y">
              {columnOrder.map((column) => (
                <th key={column} className="pb-3 font-medium">
                  <div className="flex flex-col justify-center items-center">
                    <span className="mr-2 mt-4 text-sm font-bold text-center">
                      {column === "id"
                        ? "Alert ID"
                        : column === "name"
                        ? "Customer Name"
                        : column === "sanctions_source"
                        ? "Watchlist Match"
                        : column === "disposition"
                        ? "Disposition"
                        : column === "score"
                        ? "Risk Score"
                        : column === "additionalAlertsCount"
                        ? "Additional Alerts"
                        : column}
                    </span>
                    <div className="flex -ml-3 items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleColumnOrderChange(column, -1)}
                        disabled={columnOrder.indexOf(column) === 0}
                        className=""
                      >
                        <ArrowLeftCircle/>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleColumnOrderChange(column, 1)}
                        disabled={
                          columnOrder.indexOf(column) === columnOrder.length - 1
                        }
                        className="-ml-3"
                      >
                        <ArrowRightCircle/>
                      </Button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody
            style={{
              cursor: main_alert_loading ? "wait" : "pointer",
            }}
          >
            {data.map(
              (
                row: {
                  id: number;
                  disposition: string;
                  name: string;
                  score: number;
                  sanctions_source: string;
                  additionalAlertsCount: number;
                },
                i: number
              ) => {
                const iswholenumber = i % 2;
                return (
                  <tr
                    key={row.id}
                    // className={`border-b last:border-b-0 ${
                    className={`${
                      iswholenumber ? "bg-white" : "bg-gray-100"
                    } ${
                      main_alert_loading
                        ? "pointer-events-none opacity-50"
                        : "opacity-100"
                    } hover:bg-gray-200 transition-colors duration-150`}
                    onClick={() => dispatch(getMainAlert(row.id))}
                  >
                    {columnOrder.map((column) => (
                      <td key={column} className="py-4 text-center">
                        {column === "disposition" ? (
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              row.disposition === "Pending Review"
                                ? "bg-yellow-100 text-yellow-800"
                                : row.disposition === "False Positive"
                                ? "bg-green-100 text-green-800"
                                : row.disposition === "Escalated"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {row.disposition}
                          </span>
                        ) : column === "score" ? (
                          <div className="flex items-center justify-center">
                            <div className="w-[50px] bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-gradient-to-r from-green-400 to-red-500 h-full rounded-full"
                                style={{ width: `${row.score}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{row.score}</span>
                          </div>
                        ) : column === "additionalAlertsCount" ? (
                          <span className="text-sm">
                            {row.additionalAlertsCount}
                          </span>
                        ) : (
                          row[column]
                        )}
                      </td>
                    ))}
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      )}
    </div>
  );

  const handleUpdateDisposition = (newDisposition: string) => {
    if (!main_alert) return;

    const timestamp = new Date().toISOString();
    const newAuditLogEntry = {
      user: `${firstName} ${lastName}`, // Replace with actual user name
      timestamp: timestamp,
      action: `Updated disposition to ${newDisposition}`,
      field: "disposition",
      oldValue: main_alert ? main_alert?.disposition : {},
      newValue: newDisposition,
    };

    const updatedAlert = {
      ...main_alert,
      disposition: newDisposition,
      details: {
        ...main_alert?.details,
        auditLog: [newAuditLogEntry, ...main_alert?.details?.auditLog],
      },
    };
    dispatch(updatealertsSlice({ name: "main_alert", value: updatedAlert }));

    // // Update the alert in the all_main_alerts
    // const updatedQueueData = all_main_alerts.map((alert) =>
    //   alert.id === updatedAlert.id ? updatedAlert : alert
    // );
    // dispatch(
    //   updatealertsSlice({ name: "all_main_alerts", value: updatedQueueData })
    // );
    // setQueueData(updatedQueueData);

    // If escalated, add to escalatedAlerts
    if (newDisposition === "Escalated") {
      setEscalatedAlerts([...escalatedAlerts, updatedAlert]);
    } else if (
      newDisposition !== "Escalated" &&
      escalatedAlerts.find((alert: any) => alert.id === updatedAlert.id)
    ) {
      const updatedEscalatedAlerts = escalatedAlerts.filter(
        (alert: any) => alert.id !== updatedAlert.id
      );
      setEscalatedAlerts(updatedEscalatedAlerts);
    }

    console.log(
      `Updated disposition for alert ${main_alert?.id} to ${newDisposition}`
    );
  };

  // console.log(main_alert, main_alert);
  const renderContent = () => {
    switch (activeTab) {
      case "alerts":
        return (
          <div className="bg-white shadow-lg rounded-lg p-6">
            {main_alert ? (
              <AlertDetails
                alert={main_alert}
                onBack={() => {
                  dispatch(
                    updatealertsSlice({ name: "main_alert", value: null })
                  );
                  //refresh alert list while navigating backwards
                  dispatch(getAllAlerts());
                }}
                onUpdateDisposition={handleUpdateDisposition}
                allAlerts={[...all_main_alerts, ...escalatedAlerts]}
              />
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Alerts Dashboard
                  </h2>
                  <div className="flex items-center space-x-4">
                    <Select defaultValue="thisYear">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select time period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="thisYear">This Year</SelectItem>
                        <SelectItem value="lastYear">Last Year</SelectItem>
                        <SelectItem value="allTime">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" className="flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="queue">
                  <TabsList className="mb-4">
                    <TabsTrigger value="queue">Alerts Queue</TabsTrigger>
                    <TabsTrigger value="analytics">
                      Alerts Analytics
                    </TabsTrigger>
                  </TabsList>

                  {/* ALERTS QUEUE TAB */}
                  <AlertQueueTab
                    queueData={all_main_alerts}
                    searchQuery={searchQuery}
                    columnOrder={columnOrder}
                    handleColumnOrderChange={handleColumnOrderChange}
                    renderAlertTable={renderAlertTable}
                    setActiveTab={setActiveTab}
                  />

                  {/* Alerts Analytics TAB*/}
                  <AlertAnalytics
                    queueData={all_main_alerts}
                    escalatedAlerts={escalatedAlerts}
                  />
                </Tabs>
              </>
            )}
          </div>
        );
      case "escalations":
        return (
          <AlertEscalation
            selectedAlert={main_alert}
            handleUpdateDisposition={handleUpdateDisposition}
            renderAlertTable={renderAlertTable}
            queueData={all_main_alerts}
            escalatedAlerts={escalatedAlerts}
          />
        );
      case "setup":
        return <AlertScreeningSetup setActiveTab={setActiveTab} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* EXPANDABLE AND COLLAPSIBLE NAVIGATION MENU */}
      <nav
        className={`fixed left-0 top-0 h-full bg-white shadow-lg p-4 transition-all duration-300 ease-in-out ${
          isMenuExpanded ? "w-64" : "w-20"
        } z-10`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="mb-4 w-full flex justify-center"
          onClick={() => setIsMenuExpanded(!isMenuExpanded)}
        >
          {isMenuExpanded ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.value}>
              <button
                onClick={() => setActiveTab(item.value)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${
                  activeTab === item.value
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {isMenuExpanded && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* MAIN SECTION */}
      <div
        className={`flex-grow transition-all duration-300 ease-in-out ${
          isMenuExpanded ? "ml-64" : "ml-20"
        }`}
      >
        {/* MAIN SECTION */}
        <div className="max-w-[1920px] mx-auto p-8">
          {/* HEADER WITH LOGO, SEARCH BAR AND LOGOUT*/}
          <header className="flex flex-col lg:flex-row lg:justify-between gap-3 items-center mb-8">
            {/* Sentinela logo */}
            <Image
              src={"/brandLogo/sentinela03.png"}
              width={300}
              height={300}
              alt={"sentinela logo"}
              className="-ml-4 mb-3"
            />

            {/* Search Bar */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search alerts by customer name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white text-gray-800 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>

              {/* PROFILE PIC, PROFILE NAME AND LOGOUT */}
              <div className="flex items-center space-x-1 pr-3">
                <div className="flex items-center justify-center w-[55px] h-[55px] bg-white rounded-full">
                  <User className="w-[40px] h-[40px] text-gray-600 rounded-full" />
                </div>
                <div className="flex md:flex-row flex-col gap-1 md:items-center items-end justify-center bg-gray-50 m-2 px-2 pb-2 rounded-md">
                  <span className="text-gray-800 text-xs font-bold text-end">
                    {session.user?.firstName} {session?.user?.lastName}
                  </span>
                  <button
                    className=" px-2 rounded text-white bg-blue-900 text-sm"
                    onClick={async () => {
                      await signOut({
                        redirect: true,
                        callbackUrl: baseClientURL,
                      });
                    }}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* CONTENT RENDERER */}
          <main>{renderContent()}</main>
        </div>
      </div>
    </div>
  );
}
