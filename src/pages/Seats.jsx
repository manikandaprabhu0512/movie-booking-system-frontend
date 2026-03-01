import React, { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import SectionHeader from "../components/SectionHeader"
import Card from "../components/Card"
import Input from "../components/Input"
import Select from "../components/Select"
import Button from "../components/Button"
import FormRow from "../components/FormRow"
import JsonPreview from "../components/JsonPreview"
import { seatsApi } from "../lib/api"
import { useToast } from "../hooks/useToast"

const seatOptions = [
  { label: "Economy", value: "ECONOMY" },
  { label: "Standard", value: "STANDARD" },
  { label: "Premium", value: "PREMIUM" },
  { label: "Recliner", value: "RECLINER" }
]

const Seats = () => {
  const toast = useToast()
  const [createForm, setCreateForm] = useState({
    screenId: "",
    rowName: "",
    seatNumber: "",
    seatType: "ECONOMY"
  })
  const [seatId, setSeatId] = useState("")
  const [createResponse, setCreateResponse] = useState(null)

  const createSeat = useMutation({
    mutationFn: seatsApi.create,
    onSuccess: (data) => {
      setCreateResponse(data)
      toast.success("Seat created", "Seat added successfully.")
    },
    onError: (error) => {
      toast.error("Seat failed", error?.message || "Unable to add seat.")
    }
  })

  const seatQuery = useQuery({
    queryKey: ["seat", seatId],
    queryFn: () => seatsApi.getById(seatId),
    enabled: Boolean(seatId)
  })

  const handleCreateChange = (field) => (event) => {
    setCreateForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const submitCreate = (event) => {
    event.preventDefault()
    createSeat.mutate({
      ...createForm,
      screenId: Number(createForm.screenId),
      seatNumber: Number(createForm.seatNumber)
    })
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Seats"
        description="Create seats per screen and look them up by ID."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Create Seat" subtitle="POST /api/seats">
          <form className="space-y-4" onSubmit={submitCreate}>
            <FormRow>
              <Input
                label="Screen ID"
                type="number"
                value={createForm.screenId}
                onChange={handleCreateChange("screenId")}
                required
              />
              <Input
                label="Row Name"
                value={createForm.rowName}
                onChange={handleCreateChange("rowName")}
                required
              />
            </FormRow>
            <FormRow>
              <Input
                label="Seat Number"
                type="number"
                value={createForm.seatNumber}
                onChange={handleCreateChange("seatNumber")}
                required
              />
              <Select
                label="Seat Type"
                value={createForm.seatType}
                onChange={handleCreateChange("seatType")}
                options={seatOptions}
              />
            </FormRow>
            <Button type="submit" disabled={createSeat.isPending}>
              {createSeat.isPending ? "Saving..." : "Create Seat"}
            </Button>
          </form>
          <div className="mt-4">
            <JsonPreview data={createResponse} title="Create Response" />
          </div>
        </Card>

        <Card title="Get Seat" subtitle="GET /api/seats/{id}">
          <div className="space-y-4">
            <Input
              label="Seat ID"
              type="number"
              value={seatId}
              onChange={(event) => setSeatId(event.target.value)}
              hint="Type an ID to fetch data."
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => seatQuery.refetch()}
              disabled={!seatId || seatQuery.isFetching}
            >
              {seatQuery.isFetching ? "Loading..." : "Fetch Seat"}
            </Button>
            <JsonPreview data={seatQuery.data} title="Seat Response" />
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Seats
