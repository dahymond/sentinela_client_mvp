import { ActiveTabsType } from "@/app/components/interfaces/interfaces";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
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
    sanctions_list,
  } = useAppSelector((store) => store.screeningSetup);

  // const handleValueChange = (value: string[]) => {
  //   setSelectedValues(value);
  // };
  const { submit_alert_loading } = useAppSelector((store) => store.alertSlice);
  const toast = useToast();
  const onChange = ({ target }: any) => {
    const { name, value } = target;
    dispatch(updateScreeningSetUp({ name, value }));
  };

  const submitPIIDetails = async () => {
    if (sanctions_list.length === 0) {
      toast("error", "Please select at least one sanctions list to search");
      return;
    }
    if (!full_name) {
      toast("error", "Full name field cannot be empty");
      return;
    }
    const data: any = {
      full_name: full_name,
      alias,
      address,
      citizenship,
      country_of_residence,
      date_of_birth,
      national_identification_number,
      passport_number,
      match_threshold: fuzzyThreshold,
      sanctions_list,
    };
    let numberoffilledfields = 0;
    for (const v in data) {
      if (data[v] !== "") {
        numberoffilledfields++;
      }
    }
    if (numberoffilledfields < 4) {
      toast("error", "Please fill in Full Name and an extra field");
      return;
    }
    toast("success", `Screening started for ${data?.full_name}`);
    // console.log(numberoffilledfields, data);

    const result = await dispatch(submitPII(data));
    if (result.meta.requestStatus === "fulfilled") {
      setActiveTab("alerts");
    } else {
      toast("error", result?.payload?.toString());
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
                <h4 className="text-sm">Sanctions List to Search</h4>
                <ToggleGroup.Root
                  type="multiple"
                  className="flex space-x-4"
                  value={sanctions_list}
                  onValueChange={(value) =>
                    dispatch(
                      updateScreeningSetUp({ name: "sanctions_list", value })
                    )
                  }
                >
                  {["us", "eu", "uk", "un", "fr", "qr"].map((region) => (
                    <ToggleGroup.Item
                      key={region}
                      value={region}
                      className="px-3 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300 data-[state=on]:bg-blue-500 data-[state=on]:text-white"
                    >
                      {region.toUpperCase()}
                    </ToggleGroup.Item>
                  ))}
                </ToggleGroup.Root>
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
