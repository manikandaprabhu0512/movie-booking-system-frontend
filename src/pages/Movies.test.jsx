import React from "react"
import { within, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import Movies from "./Movies"
import { renderWithProviders } from "../test/renderWithProviders"
import { moviesApi } from "../lib/api"

vi.mock("../lib/api", async () => {
  const actual = await vi.importActual("../lib/api")
  return {
    ...actual,
    moviesApi: {
      create: vi.fn(),
      getAll: vi.fn(),
      getById: vi.fn(),
      update: vi.fn(),
      remove: vi.fn()
    }
  }
})

describe("Movies page", () => {
  it("submits create movie form with normalized payload", async () => {
    moviesApi.create.mockResolvedValue({ id: 1, title: "Interstellar" })
    const user = userEvent.setup()

    renderWithProviders(<Movies />)

    const addMovieCard = screen.getByRole("heading", { name: "Add Movie" }).closest("section")
    const scoped = within(addMovieCard)

    await user.type(scoped.getByLabelText("Title"), "Interstellar")
    await user.type(scoped.getByLabelText("Language"), "English")
    await user.type(scoped.getByLabelText("Genre"), "Sci-Fi")
    await user.type(scoped.getByLabelText("Duration (minutes)"), "169")
    await user.type(scoped.getByLabelText("Release Date"), "2014-11-07")
    await user.type(scoped.getByLabelText("Certificate"), "PG-13")
    await user.type(scoped.getByLabelText("Description"), "Space exploration drama")

    await user.click(scoped.getByRole("button", { name: "Create Movie" }))

    await waitFor(() => {
      expect(moviesApi.create).toHaveBeenCalled()
    })

    expect(moviesApi.create.mock.calls[0][0]).toEqual({
      title: "Interstellar",
      language: "English",
      genre: "Sci-Fi",
      durationMinutes: 169,
      releaseDate: "2014-11-07",
      certificate: "PG-13",
      description: "Space exploration drama"
    })
  })
})
