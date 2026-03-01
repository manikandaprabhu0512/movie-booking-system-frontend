import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import SectionHeader from "../components/SectionHeader";
import Card from "../components/Card";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Button from "../components/Button";
import FormRow from "../components/FormRow";
import JsonPreview from "../components/JsonPreview";
import { theatresApi } from "../lib/api";
import { useToast } from "../hooks/useToast";

const Theatres = () => {
  const toast = useToast();
  const [form, setForm] = useState({
    name: "",
    city: "",
    addressLineOne: "",
    addressLineTwo: "",
    addressLineThree: "",
    state: "",
    pincode: "",
  });
  const [updateForm, setUpdateForm] = useState({
    id: "",
    name: "",
    city: "",
    addressLineOne: "",
    addressLineTwo: "",
    addressLineThree: "",
    state: "",
    pincode: "",
  });
  const [theatreId, setTheatreId] = useState("");
  const [response, setResponse] = useState(null);
  const [updateResponse, setUpdateResponse] = useState(null);

  const createTheatre = useMutation({
    mutationFn: theatresApi.create,
    onSuccess: (data) => {
      setResponse(data);
      toast.success("Theatre created", "Theatre was added successfully.");
    },
    onError: (error) => {
      toast.error("Theatre failed", error?.message || "Unable to add theatre.");
    },
  });

  const updateTheatre = useMutation({
    mutationFn: ({ id, payload }) => theatresApi.update(id, payload),
    onSuccess: (data) => {
      setUpdateResponse(data);
      toast.success("Theatre updated", "Theatre updated successfully.");
    },
    onError: (error) => {
      toast.error("Update failed", error?.message || "Unable to update theatre.");
    },
  });

  const deleteTheatre = useMutation({
    mutationFn: (id) => theatresApi.remove(id),
    onSuccess: () => {
      toast.success("Theatre deleted", "Theatre deleted successfully.");
    },
    onError: (error) => {
      toast.error("Delete failed", error?.message || "Unable to delete theatre.");
    },
  });

  const theatreQuery = useQuery({
    queryKey: ["theatre", theatreId],
    queryFn: () => theatresApi.getById(theatreId),
    enabled: Boolean(theatreId),
  });

  const theatresQuery = useQuery({
    queryKey: ["theatres"],
    queryFn: theatresApi.getAll,
    enabled: false,
  });

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleUpdateChange = (field) => (event) => {
    setUpdateForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createTheatre.mutate(form);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    updateTheatre.mutate({
      id: Number(updateForm.id),
      payload: {
        name: updateForm.name,
        city: updateForm.city,
        addressLineOne: updateForm.addressLineOne,
        addressLineTwo: updateForm.addressLineTwo,
        addressLineThree: updateForm.addressLineThree,
        state: updateForm.state,
        pincode: updateForm.pincode,
      },
    });
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Theatres"
        description="Register theatre locations and addresses."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card title="Add Theatre" subtitle="POST /theatre/add-theatre">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormRow>
              <Input
                label="Theatre Name"
                value={form.name}
                onChange={handleChange("name")}
                required
              />
              <Input
                label="City"
                value={form.city}
                onChange={handleChange("city")}
                required
              />
            </FormRow>
            <Textarea
              label="Address Line 1"
              value={form.addressLineOne}
              onChange={handleChange("addressLineOne")}
              required
            />
            <Textarea
              label="Address Line 2"
              value={form.addressLineTwo}
              onChange={handleChange("addressLineTwo")}
              required
            />
            <Textarea
              label="Address Line 3"
              value={form.addressLineThree}
              onChange={handleChange("addressLineThree")}
            />
            <FormRow>
              <Input
                label="State"
                value={form.state}
                onChange={handleChange("state")}
                required
              />
              <Input
                label="Pincode"
                value={form.pincode}
                onChange={handleChange("pincode")}
                required
              />
            </FormRow>
            <Button type="submit" disabled={createTheatre.isPending}>
              {createTheatre.isPending ? "Saving..." : "Create Theatre"}
            </Button>
          </form>
        </Card>
        <Card title="Latest Response">
          <JsonPreview data={response} />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Get Theatre" subtitle="GET /theatre/{id}">
          <div className="space-y-4">
            <Input
              label="Theatre ID"
              type="number"
              value={theatreId}
              onChange={(event) => setTheatreId(event.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => theatreQuery.refetch()}
                disabled={!theatreId || theatreQuery.isFetching}
              >
                {theatreQuery.isFetching ? "Loading..." : "Fetch Theatre"}
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={() => deleteTheatre.mutate(theatreId)}
                disabled={!theatreId || deleteTheatre.isPending}
              >
                Delete Theatre
              </Button>
            </div>
            <JsonPreview data={theatreQuery.data} title="Theatre Response" />
          </div>
        </Card>

        <Card title="All Theatres" subtitle="GET /theatre">
          <div className="space-y-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => theatresQuery.refetch()}
              disabled={theatresQuery.isFetching}
            >
              {theatresQuery.isFetching ? "Loading..." : "Fetch Theatres"}
            </Button>
            <JsonPreview data={theatresQuery.data} title="Theatres Response" />
          </div>
        </Card>
      </div>

      <Card title="Update Theatre" subtitle="PUT /theatre/{id}">
        <form className="space-y-4" onSubmit={handleUpdate}>
          <FormRow>
            <Input
              label="Theatre ID"
              type="number"
              value={updateForm.id}
              onChange={handleUpdateChange("id")}
              required
            />
            <Input
              label="Theatre Name"
              value={updateForm.name}
              onChange={handleUpdateChange("name")}
              required
            />
          </FormRow>
          <FormRow>
            <Input
              label="City"
              value={updateForm.city}
              onChange={handleUpdateChange("city")}
              required
            />
            <Input
              label="State"
              value={updateForm.state}
              onChange={handleUpdateChange("state")}
              required
            />
          </FormRow>
          <Textarea
            label="Address Line 1"
            value={updateForm.addressLineOne}
            onChange={handleUpdateChange("addressLineOne")}
            required
          />
          <Textarea
            label="Address Line 2"
            value={updateForm.addressLineTwo}
            onChange={handleUpdateChange("addressLineTwo")}
            required
          />
          <Textarea
            label="Address Line 3"
            value={updateForm.addressLineThree}
            onChange={handleUpdateChange("addressLineThree")}
          />
          <FormRow>
            <Input
              label="Pincode"
              value={updateForm.pincode}
              onChange={handleUpdateChange("pincode")}
              required
            />
          </FormRow>
          <Button type="submit" disabled={updateTheatre.isPending}>
            {updateTheatre.isPending ? "Saving..." : "Update Theatre"}
          </Button>
          <div className="mt-4">
            <JsonPreview data={updateResponse} title="Update Response" />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Theatres;
