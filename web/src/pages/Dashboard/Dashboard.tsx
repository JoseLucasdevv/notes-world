import {
  ArrowLeft,
  ArrowRight,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  SmileySad,
  Spinner,
} from "@phosphor-icons/react";
import { Input } from "../../components/input";
import { useCallback, useContext, useEffect, useState } from "react";
import { ModalContext } from "../../context/ModalContextProvider";
import { EditeModalForm } from "./components/EditeModalForm";
import Modal from "../../components/Modal";
import axios from "axios";
import { format } from "date-fns";
import { useCookies } from "react-cookie";
import { CreateFormModal } from "./components/CreateFormModal";
import { ViewNotesModal } from "./components/ViewNotesModal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

interface Note {
  colorHex: string;
  description: string;
  title: string;
  createdAt: string;
  _id: string;
}

const SearchFormSchema = z.object({
  search: z.string().min(3, { message: "Your search is too short!" }),
});

type SearchFormType = z.infer<typeof SearchFormSchema>;

const buttonColors = ["#F6C974", "#F19674", "#E4F592", "#43E6FB"];

export function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const { open, close, setModalColor } = useContext(ModalContext);
  const [cookie] = useCookies(["token"]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewNote, setViewNote] = useState<Note | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showColorButtons, setShowColorButtons] = useState(false);

  const openModalNewNote = (color: string) => {
    setModalColor("createNote", color);
    open("createNote");
  };

  const openModalEditeNote = (note: Note) => {
    setEditingNote(note);
    open("editeModal");
    close("viewNote");
  };

  const openModalViewNote = (note: Note) => {
    setViewNote(note);
    open("viewNote");
  };

  const refreshNotes = async () => {
    await getNotes(currentPage);
  };

  const getNotes = useCallback(
    async (page = 1, search = "") => {
      setIsLoading(true);
      try {
        const url = search
          ? `${import.meta.env.VITE_API_SERVER_BACKEND}/post/title?title=${search}`
          : `${import.meta.env.VITE_API_SERVER_BACKEND}/post?page=${page}`;

        const response = await axios
          .get(url, {
            headers: {
              Authorization: `Bearer ${cookie.token}`,
            },
          })
          .finally(() => {
            setIsLoading(false);
          });

        setNotes(response.data.body);
        setTotalPages(response.data.maxPage);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error);

          toast.error("Error getting notes!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [cookie.token],
  );

  useEffect(() => {
    getNotes(currentPage);
  }, [getNotes, currentPage]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const { register, handleSubmit, watch, reset } = useForm<SearchFormType>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: {
      search: "",
    },
  });

  const searchValue = watch("search") || "";

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchValue.length >= 3) {
        getNotes(1, searchValue);
      }

      if (searchValue.length === 0) {
        getNotes(1);
        setCurrentPage(1);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue, getNotes]);

  async function onSubmitForm(data: SearchFormType) {
    await getNotes(1, data.search);
    reset();
  }

  return (
    <section className="flex h-screen flex-col">
      <div className="container mx-auto flex-grow px-4">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4 sm:flex-row">
            <div className="flex gap-2">
              <MagnifyingGlass size={24} weight="bold" />
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Input
                  {...register("search")}
                  placeholder="Search..."
                  type="text"
                  id="search"
                  className="w-36 sm:w-auto"
                />
              </form>
            </div>

            <div className="flex items-center gap-6">
              <div
                className={`flex flex-wrap gap-2 transition-transform duration-300 ease-in-out ${
                  showColorButtons
                    ? "not-sr-only translate-x-0"
                    : "sr-only translate-x-3"
                }`}
              >
                {buttonColors.map((color) => (
                  <button
                    key={color}
                    className="h-6 w-6 cursor-pointer rounded-full transition-transform duration-200 ease-in-out hover:scale-125"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      openModalNewNote(color);
                      setShowColorButtons(false);
                    }}
                  />
                ))}
              </div>

              <button
                className="rounded-full bg-black p-3 text-white"
                type="button"
                onClick={() => setShowColorButtons((prev) => !prev)}
              >
                <Plus size={24} weight="bold" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <Spinner className="animate-spin" size={24} />
              <p>Loading Notes</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <SmileySad size={64} className="text-primary" />
              <p className="text-xl">No notes to display...</p>
            </div>
          ) : (
            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {notes.map((note) => (
                <div
                  key={note._id}
                  style={{ backgroundColor: note.colorHex }}
                  className="flex max-h-60 min-h-52 flex-col items-start justify-between gap-4 rounded-lg p-6"
                >
                  <div
                    className="cursor-pointer space-y-2 text-start"
                    onClick={() => openModalViewNote(note)}
                  >
                    <h2 className="text-lg font-bold xl:text-base">
                      {note.title.length < 30
                        ? note.title
                        : note.title.slice(0, 30) + "..."}
                    </h2>
                    <p>
                      {note.description.length < 90
                        ? note.description
                        : note.description.slice(0, 90) + "..."}
                    </p>
                  </div>

                  <div className="flex w-full items-center justify-between">
                    <time>
                      {format(new Date(note.createdAt), "dd MMM yyyy")}
                    </time>
                    <button
                      className="rounded-full bg-black p-2"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModalEditeNote(note);
                      }}
                    >
                      <PencilSimple
                        size={24}
                        weight="fill"
                        className="text-white"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="my-6 flex items-center justify-center gap-8">
              <button
                className="rounded bg-black p-3"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <ArrowLeft size={17} weight="bold" className="text-white" />
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`${
                    currentPage === index + 1 ? "font-bold underline" : ""
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="rounded bg-black p-3"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <ArrowRight size={17} weight="bold" className="text-white" />
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal id="editeModal">
        {editingNote && (
          <EditeModalForm data={editingNote} onRefresh={refreshNotes} />
        )}
      </Modal>

      <Modal id="createNote">
        <CreateFormModal onRefresh={refreshNotes} />
      </Modal>

      <Modal id="viewNote">
        {viewNote && (
          <ViewNotesModal
            data={viewNote}
            openModalEditeNote={openModalEditeNote}
          />
        )}
      </Modal>

      <footer className="flex items-center justify-center bg-black py-7 text-white">
        <p>© {new Date().getFullYear()} - All rights reserved</p>
      </footer>
    </section>
  );
}
