import { Button } from "@/app/components/ui/button";
import LogoHeartBeat from "@/app/components/ui/logoheartbeart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { TabsContent } from "@/app/components/ui/tabs";
import { useAppSelector } from "@/store/hook";
import { ArrowUpDown, Hammer } from "lucide-react";
import { useState } from "react";

const AlertQueueTab = ({
  // columnOrder,
  // handleColumnOrderChange,
  queueData,
  searchQuery,
  renderAlertTable,
  setActiveTab,
}: any) => {
  const [filterDisposition, setFilterDisposition] = useState("all");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const { all_main_alerts_loading } = useAppSelector(
    (store) => store.alertSlice
  );
  //   console.log("alertQueueComp", queueData)
  const filteredAndSortedQueueData = queueData
    .filter(
      (alert: any) =>
        (searchQuery === "" ||
          alert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(alert.id).toLowerCase().includes(searchQuery.toLowerCase())) &&
        (filterDisposition === "all" || alert.disposition === filterDisposition)
    )
    .sort((a: any, b: any) => {
      if (sortBy === "id") {
        return sortOrder === "asc"
          ? Number(a.id) - Number(b.id)
          : Number(b.id) - Number(a.id);
      } else if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "score") {
        return sortOrder === "asc" ? a.score - b.score : b.score - a.score;
      } else if (sortBy === "alertDateTime") {
        return sortOrder === "asc"
          ? new Date(a.alertDateTime).getTime() -
              new Date(b.alertDateTime).getTime()
          : new Date(b.alertDateTime).getTime() -
              new Date(a.alertDateTime).getTime();
      }
      return 0;
    });

  return (
    <TabsContent value="queue">
      <div className="mb-4 flex justify-between items-center">
        {/* All Disposition, Alert Id, Ascending */}
        <div className="flex items-center space-x-2">
          <Select
            value={filterDisposition}
            onValueChange={setFilterDisposition}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by disposition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dispositions</SelectItem>
              <SelectItem value="True Positive">True Positive</SelectItem>
              <SelectItem value="False Positive">False Positive</SelectItem>
              <SelectItem value="Escalated">Escalated</SelectItem>
              <SelectItem value="Pending Review">Pending Review</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">Alert ID</SelectItem>
              <SelectItem value="name">Customer Name</SelectItem>
              <SelectItem value="score">Risk Score</SelectItem>
              <SelectItem value="alertDateTime">Alert Date and Time</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            <ArrowUpDown className="w-4 h-4 mr-2" />
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </Button>
        </div>
        {/* Clear filters */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setFilterDisposition("all")}>
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Column Order */}
      {/* <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Column Order</h3>
        <div className="flex flex-wrap gap-2">
          {columnOrder.map((column: any, index: any) => (
            <div key={column} className="flex items-center">
              <span className="mr-2">{column}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleColumnOrderChange(column, -1)}
                disabled={index === 0}
              >
                ↑
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleColumnOrderChange(column, 1)}
                disabled={index === columnOrder.length - 1}
              >
                ↓
              </Button>
            </div>
          ))}
        </div>
      </div> */}

      {filteredAndSortedQueueData.length > 0 && !all_main_alerts_loading ? (
        renderAlertTable(filteredAndSortedQueueData)
      ) : all_main_alerts_loading ? (
        <div className="flex flex-col gap-1 items-center justify-center w-full h-full mt-10">
          <LogoHeartBeat/>
          <p className="text-sm">...fetching alerts</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 text-gray-600 min-h-40 w-full">
          <div className="flex items-center gap-3">
            <h4 className="text-xl">No alerts to display</h4>
            <Hammer />
          </div>
          <div>
            <p>
              Click{" "}
              <span
                onClick={() => setActiveTab("setup")}
                className="underline cursor-pointer"
              >
                here
              </span>{" "}
              to set up entity screening
            </p>
          </div>
        </div>
      )}
    </TabsContent>
  );
};

export default AlertQueueTab;
