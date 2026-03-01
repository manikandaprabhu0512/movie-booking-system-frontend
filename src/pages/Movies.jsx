import React, { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import SectionHeader from "../components/SectionHeader"
import Card from "../components/Card"
import Input from "../components/Input"
import Textarea from "../components/Textarea"
import Button from "../components/Button"
import FormRow from "../components/FormRow"
import JsonPreview from "../components/JsonPreview"
import { moviesApi } from "../lib/api"
import { useToast } from "../hooks/useToast"

const Movies = () => {
  const toast = useToast()
  const [form, setForm] = useState({
    title: "",
    language: "",
    genre: "",
    durationMinutes: "",
    releaseDate: "",
    certificate: "",
    description: ""
  })
  const [updateForm, setUpdateForm] = useState({
    id: "",
    title: "",
    language: "",
    genre: "",
    durationMinutes: "",
    releaseDate: "",
    certificate: "",
    description: ""
  })
  const [movieId, setMovieId] = useState("")
  const [response, setResponse] = useState(null)
  const [updateResponse, setUpdateResponse] = useState(null)

  const createMovie = useMutation({
    mutationFn: moviesApi.create,
    onSuccess: (data) => {
      setResponse(data)
      toast.success("Movie created", "Movie was added successfully.")
    },
    onError: (error) => {
      toast.error("Movie failed", error?.message || "Unable to add movie.")
    }
  })

  const updateMovie = useMutation({
    mutationFn: ({ id, payload }) => moviesApi.update(id, payload),
    onSuccess: (data) => {
      setUpdateResponse(data)
      toast.success("Movie updated", "Movie updated successfully.")
    },
    onError: (error) => {
      toast.error("Update failed", error?.message || "Unable to update movie.")
    }
  })

  const deleteMovie = useMutation({
    mutationFn: (id) => moviesApi.remove(id),
    onSuccess: () => {
      toast.success("Movie deleted", "Movie deleted successfully.")
    },
    onError: (error) => {
      toast.error("Delete failed", error?.message || "Unable to delete movie.")
    }
  })

  const movieQuery = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => moviesApi.getById(movieId),
    enabled: Boolean(movieId)
  })

  const moviesQuery = useQuery({
    queryKey: ["movies"],
    queryFn: moviesApi.getAll,
    enabled: false
  })

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleUpdateChange = (field) => (event) => {
    setUpdateForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    createMovie.mutate({
      ...form,
      durationMinutes: Number(form.durationMinutes)
    })
  }

  const handleUpdate = (event) => {
    event.preventDefault()
    updateMovie.mutate({
      id: Number(updateForm.id),
      payload: {
        title: updateForm.title,
        language: updateForm.language,
        genre: updateForm.genre,
        durationMinutes: Number(updateForm.durationMinutes),
        releaseDate: updateForm.releaseDate,
        certificate: updateForm.certificate,
        description: updateForm.description
      }
    })
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Movies"
        description="Create the movie catalog that powers show schedules."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card title="Add Movie" subtitle="POST /movies/add-movie">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormRow>
              <Input
                label="Title"
                value={form.title}
                onChange={handleChange("title")}
                required
              />
              <Input
                label="Language"
                value={form.language}
                onChange={handleChange("language")}
                required
              />
            </FormRow>
            <FormRow>
              <Input
                label="Genre"
                value={form.genre}
                onChange={handleChange("genre")}
                required
              />
              <Input
                label="Duration (minutes)"
                type="number"
                min="1"
                value={form.durationMinutes}
                onChange={handleChange("durationMinutes")}
                required
              />
            </FormRow>
            <FormRow>
              <Input
                label="Release Date"
                type="date"
                value={form.releaseDate}
                onChange={handleChange("releaseDate")}
                required
              />
              <Input
                label="Certificate"
                value={form.certificate}
                onChange={handleChange("certificate")}
                required
              />
            </FormRow>
            <Textarea
              label="Description"
              value={form.description}
              onChange={handleChange("description")}
              maxLength={500}
              required
            />
            <Button type="submit" disabled={createMovie.isPending}>
              {createMovie.isPending ? "Saving..." : "Create Movie"}
            </Button>
          </form>
        </Card>
        <Card title="Latest Response">
          <JsonPreview data={response} />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Get Movie" subtitle="GET /movies/{id}">
          <div className="space-y-4">
            <Input
              label="Movie ID"
              type="number"
              value={movieId}
              onChange={(event) => setMovieId(event.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => movieQuery.refetch()}
                disabled={!movieId || movieQuery.isFetching}
              >
                {movieQuery.isFetching ? "Loading..." : "Fetch Movie"}
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={() => deleteMovie.mutate(movieId)}
                disabled={!movieId || deleteMovie.isPending}
              >
                Delete Movie
              </Button>
            </div>
            <JsonPreview data={movieQuery.data} title="Movie Response" />
          </div>
        </Card>

        <Card title="All Movies" subtitle="GET /movies">
          <div className="space-y-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => moviesQuery.refetch()}
              disabled={moviesQuery.isFetching}
            >
              {moviesQuery.isFetching ? "Loading..." : "Fetch Movies"}
            </Button>
            <JsonPreview data={moviesQuery.data} title="Movies Response" />
          </div>
        </Card>
      </div>

      <Card title="Update Movie" subtitle="PUT /movies/{id}">
        <form className="space-y-4" onSubmit={handleUpdate}>
          <FormRow>
            <Input
              label="Movie ID"
              type="number"
              value={updateForm.id}
              onChange={handleUpdateChange("id")}
              required
            />
            <Input
              label="Title"
              value={updateForm.title}
              onChange={handleUpdateChange("title")}
              required
            />
          </FormRow>
          <FormRow>
            <Input
              label="Language"
              value={updateForm.language}
              onChange={handleUpdateChange("language")}
              required
            />
            <Input
              label="Genre"
              value={updateForm.genre}
              onChange={handleUpdateChange("genre")}
              required
            />
          </FormRow>
          <FormRow>
            <Input
              label="Duration (minutes)"
              type="number"
              min="1"
              value={updateForm.durationMinutes}
              onChange={handleUpdateChange("durationMinutes")}
              required
            />
            <Input
              label="Release Date"
              type="date"
              value={updateForm.releaseDate}
              onChange={handleUpdateChange("releaseDate")}
              required
            />
          </FormRow>
          <FormRow>
            <Input
              label="Certificate"
              value={updateForm.certificate}
              onChange={handleUpdateChange("certificate")}
              required
            />
          </FormRow>
          <Textarea
            label="Description"
            value={updateForm.description}
            onChange={handleUpdateChange("description")}
            maxLength={500}
            required
          />
          <Button type="submit" disabled={updateMovie.isPending}>
            {updateMovie.isPending ? "Saving..." : "Update Movie"}
          </Button>
          <div className="mt-4">
            <JsonPreview data={updateResponse} title="Update Response" />
          </div>
        </form>
      </Card>
    </div>
  )
}

export default Movies
