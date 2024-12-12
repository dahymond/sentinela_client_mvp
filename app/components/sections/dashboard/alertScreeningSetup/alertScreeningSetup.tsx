import { ActiveTabsType } from "@/app/components/interfaces/interfaces";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Slider } from "@/app/components/ui/slider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { useToast } from "@/lib/utils";

import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  submitPII,
  updateScreeningSetUp,
} from "@/store/slices/screeningSetUpSlice";
import { Search, Upload } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const AlertScreeningSetup = ({
  setActiveTab,
}: {
  setActiveTab: Dispatch<SetStateAction<ActiveTabsType>>;
}) => {
  const dispatch = useAppDispatch();
  const {
    full_name,
    alias,
    address,
    citizenship,
    country_of_residence,
    date_of_birth,
    national_identification_number,
    passport_number,
    fuzzyThreshold,
  } = useAppSelector((store) => store.screeningSetup);

  const { submit_alert_loading } = useAppSelector((store) => store.alertSlice);
  const toast = useToast()
  
  const onChange = ({ target }: any) => {
    const { name, value } = target;
    dispatch(updateScreeningSetUp({ name, value }));
  };

  const submitPIIDetails = async () => {
    const data = {
      full_name: full_name,
      alias,
      address,
      citizenship,
      country_of_residence,
      date_of_birth,
      national_identification_number,
      passport_number,
      match_threshold: fuzzyThreshold,
    };
    const result = await dispatch(submitPII(data));
    if (result.meta.requestStatus === "fulfilled") {
      setActiveTab("alerts");
    } else {
      toast('error', 'Entity not on sanctions list')
      console.log(result.payload);
    }
  };
  return (
    <Card className="bg-white shadow-lg rounded-lg">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Screening Setup
        </h2>
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="single">Single Search</TabsTrigger>
            <TabsTrigger value="batch">Batch Search</TabsTrigger>
          </TabsList>
          <TabsContent value="single">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="full_name"
                    value={full_name}
                    onChange={onChange}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alias">Alias</Label>
                  <Input
                    id="alias"
                    name="alias"
                    value={alias}
                    onChange={onChange}
                    placeholder="Enter alias"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    onChange={onChange}
                    value={address}
                    placeholder="Enter address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="citizenship">Citizenship</Label>
                  <Input
                    id="citizenship"
                    name="citizenship"
                    onChange={onChange}
                    value={citizenship}
                    placeholder="Enter citizenship"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="countryOfResidence">
                    Country of Residence
                  </Label>
                  <Input
                    id="countryOfResidence"
                    name="country_of_residence"
                    value={country_of_residence}
                    onChange={onChange}
                    placeholder="Enter country of residence"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="date_of_birth"
                    value={date_of_birth}
                    onChange={onChange}
                    type="date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationalId">
                    National Identification Number
                  </Label>
                  <Input
                    id="nationalId"
                    name="national_identification_number"
                    value={national_identification_number}
                    onChange={onChange}
                    placeholder="Enter national ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passportNumber">Passport Number</Label>
                  <Input
                    id="passportNumber"
                    name="passport_number"
                    value={passport_number}
                    onChange={onChange}
                    placeholder="Enter passport number"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuzzyScore">
                  Fuzzy Score: {fuzzyThreshold}
                </Label>
                <Slider
                  id="fuzzyScore"
                  min={0}
                  max={100}
                  step={1}
                  value={[fuzzyThreshold]}
                  onValueChange={(value) =>
                    dispatch(
                      updateScreeningSetUp({
                        name: "fuzzyThreshold",
                        value: value[0],
                      })
                    )
                  }
                  className="w-full"
                />
              </div>
              <Button
                disabled={submit_alert_loading}
                onClick={submitPIIDetails}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                {submit_alert_loading ? "..screening" : "Perform Single Search"}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="batch">
            <div className="space-y-4">
              <p className="text-gray-600">
                Configure settings for bulk entity searches.
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                <Upload className="w-4 h-4 mr-2" />
                Set Up Batch Search
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AlertScreeningSetup;
