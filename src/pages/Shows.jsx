import React, { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import SectionHeader from "../components/SectionHeader"
import Card from "../components/Card"
import Input from "../components/Input"
import Button from "../components/Button"
import FormRow from "../components/FormRow"
import JsonPreview from "../components/JsonPreview"
import { showsApi } from "../lib/api"
import { useToast } from "../hooks/useToast"

const Shows = () => {
  const toast = useToast()
  const [form, setForm] = useState({
    movieId: "",
    screenId: "",
    showDate: "",
    showTime: ""
  })
  const [response, setResponse] = useState(null)

  const createShow = useMutation({
    mutationFn: showsApi.create,
    onSuccess: (data) => {
      setResponse(data)
      toast.success("Show created", "Show added successfully.")
    },
    onError: (error) => {
      toast.error("Show failed", error?.message || "Unable to add show.")
    }
  })

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    createShow.mutate({
      ...form,
      movieId: Number(form.movieId),
      screenId: Number(form.screenId)
    })
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Shows"
        description="Schedule shows for movies and screens."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card title="Add Show" subtitle="POST /theatre-shows/add-show">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormRow>
              <Input
                label="Movie ID"
                type="number"
                value={form.movieId}
                onChange={handleChange("movieId")}
                required
              />
              <Input
                label="Screen ID"
                type="number"
                value={form.screenId}
                onChange={handleChange("screenId")}
                required
              />
            </FormRow>
            <FormRow>
              <Input
                label="Show Date"
                type="date"
                value={form.showDate}
                onChange={handleChange("showDate")}
                required
              />
              <Input
                label="Show Time"
                type="time"
                value={form.showTime}
                onChange={handleChange("showTime")}
                required
              />
            </FormRow>
            <Button type="submit" disabled={createShow.isPending}>
              {createShow.isPending ? "Saving..." : "Create Show"}
            </Button>
          </form>
        </Card>
        <Card title="Latest Response">
          <JsonPreview data={response} />
        </Card>
      </div>
    </div>
  )
}

export default Shows
