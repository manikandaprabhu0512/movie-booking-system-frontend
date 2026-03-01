import React, { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import SectionHeader from "../components/SectionHeader"
import Card from "../components/Card"
import Input from "../components/Input"
import Button from "../components/Button"
import FormRow from "../components/FormRow"
import JsonPreview from "../components/JsonPreview"
import { screensApi } from "../lib/api"
import { useToast } from "../hooks/useToast"

const Screens = () => {
  const toast = useToast()
  const [createForm, setCreateForm] = useState({
    theatreId: "",
    name: ""
  })
  const [screenId, setScreenId] = useState("")
  const [createResponse, setCreateResponse] = useState(null)

  const createScreen = useMutation({
    mutationFn: screensApi.create,
    onSuccess: (data) => {
      setCreateResponse(data)
      toast.success("Screen created", "Screen added successfully.")
    },
    onError: (error) => {
      toast.error("Screen failed", error?.message || "Unable to add screen.")
    }
  })

  const screenQuery = useQuery({
    queryKey: ["screen", screenId],
    queryFn: () => screensApi.getById(screenId),
    enabled: Boolean(screenId)
  })

  const handleCreateChange = (field) => (event) => {
    setCreateForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const submitCreate = (event) => {
    event.preventDefault()
    createScreen.mutate({
      ...createForm,
      theatreId: Number(createForm.theatreId)
    })
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Screens"
        description="Attach screens to theatres and fetch them by ID."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Create Screen" subtitle="POST /api/screens">
          <form className="space-y-4" onSubmit={submitCreate}>
            <FormRow>
              <Input
                label="Theatre ID"
                type="number"
                value={createForm.theatreId}
                onChange={handleCreateChange("theatreId")}
                required
              />
              <Input
                label="Screen Name"
                value={createForm.name}
                onChange={handleCreateChange("name")}
                required
              />
            </FormRow>
            <Button type="submit" disabled={createScreen.isPending}>
              {createScreen.isPending ? "Saving..." : "Create Screen"}
            </Button>
          </form>
          <div className="mt-4">
            <JsonPreview data={createResponse} title="Create Response" />
          </div>
        </Card>

        <Card title="Get Screen" subtitle="GET /api/screens/{id}">
          <div className="space-y-4">
            <Input
              label="Screen ID"
              type="number"
              value={screenId}
              onChange={(event) => setScreenId(event.target.value)}
              hint="Type an ID to fetch data."
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => screenQuery.refetch()}
              disabled={!screenId || screenQuery.isFetching}
            >
              {screenQuery.isFetching ? "Loading..." : "Fetch Screen"}
            </Button>
            <JsonPreview data={screenQuery.data} title="Screen Response" />
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Screens
