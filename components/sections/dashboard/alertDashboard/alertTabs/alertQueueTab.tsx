import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TabsContent } from "@/components/ui/tabs"
import { ArrowUpDown } from "lucide-react"
import { useState } from "react"

const AlertQueueTab = ({ columnOrder, handleColumnOrderChange, queueData, searchQuery, renderAlertTable}: any) => {
    const [filterDisposition, setFilterDisposition] = useState('all')
  const [sortBy, setSortBy] = useState('id')
  const [sortOrder, setSortOrder] = useState('asc')

    const filteredAndSortedQueueData = queueData
        .filter((alert:any) =>
            (searchQuery === '' ||
                alert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                alert.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (filterDisposition === 'all' || alert.disposition === filterDisposition)
        )
        .sort((a:any, b:any) => {
            if (sortBy === 'id') {
                return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
            } else if (sortBy === 'name') {
                return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
            } else if (sortBy === 'score') {
                return sortOrder === 'asc' ? a.score - b.score : b.score - a.score
            } else if (sortBy === 'alertDateTime') {
                return sortOrder === 'asc' ? new Date(a.alertDateTime).getTime() - new Date(b.alertDateTime).getTime() : new Date(b.alertDateTime).getTime() - new Date(a.alertDateTime).getTime();
            }
            return 0
        })





    return <TabsContent value="queue">
        <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <Select value={filterDisposition} onValueChange={setFilterDisposition}>
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
                <Button variant="outline" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                </Button>
            </div>
            <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={() => setFilterDisposition('all')}>Clear Filters</Button>
            </div>
        </div>
        <div className="mb-4">
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
        </div>
        {renderAlertTable(filteredAndSortedQueueData)}
    </TabsContent>

}

export default AlertQueueTab