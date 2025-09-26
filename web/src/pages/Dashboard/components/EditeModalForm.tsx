import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ModalContext } from "../../../context/ModalContextProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

const EditeModalFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Your title is too short!" })
    .max(50, { message: "Your title is too long!" }),
  description: z
    .string()
    .min(10, { message: "Your description is too short!" })
    .max(255, { message: "Your description is too long!" }),
  colorHex: z.string(),
  id: z.string(),
});

type EditeModalForm = z.infer<typeof EditeModalFormSchema>;

interface Note {
  colorHex: string;
  description: string;
  title: string;
  createdAt: string;
  _id: string;
}

interface EditeModalProps {
  data: Note;
  onRefresh: () => void; // Adds the prop to reload the data
}

export function EditeModalForm({ data, onRefresh }: EditeModalProps) {
  const { close } = useContext(ModalContext);
  const [cookie] = useCookies(["token"]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditeModalForm>({
    resolver: zodResolver(EditeModalFormSchema),
  });

  useEffect(() => {
    reset({
      title: data.title,
      description: data.description,
      colorHex: data.colorHex,
      id: data._id,
    });
  }, [data, reset]);

  async function onChangeNote(dataForm: EditeModalForm) {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_SERVER_BACKEND}/post/${dataForm.id}`,
        dataForm,
        {
          headers: {
            Authorization: `Bearer ${cookie.token}`,
          },
        },
      );

      toast.success("Note updated!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      onRefresh();
      close("editeModal");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
        // error.response?.data?.message
      } else {
        console.error("An unexpected error occurred");
      }
    } finally {
      close("editeModal");
    }
  }

  async function onDeleteNote(dataForm: EditeModalForm) {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_SERVER_BACKEND}/post/${dataForm.id}`,
        {
          headers: {
            Authorization: `Bearer ${cookie.token}`,
          },
        },
      );

      toast.success("Note deleted!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      onRefresh();
      close("editeModal");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Error deleting note!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        console.error("An unexpected error occurred");
      }
    } finally {
      close("editeModal");
    }
  }

  return (
    <form onSubmit={handleSubmit(onChangeNote)}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <label htmlFor="title" className="font-bold">
            What did you do today?
          </label>
          <input
            {...register("title")}
            type="text"
            name="title"
            id="title"
            placeholder="E.g.: I presented a report to my boss..."
            className="rounded-lg border border-primary p-2 outline-primary"
          />
          {errors.title && (
            <span className="text-sm text-red-500">
              {errors.title?.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="description" className="font-bold">
            How was it?
          </label>
          <textarea
            {...register("description")}
            name="description"
            id="description"
            placeholder="E.g.: I presented a report to my boss with the main project results, including metrics and improvement suggestions. The focus was on optimizing processes and increasing efficiency in the next steps."
            className="h-52 rounded-lg border border-primary p-2 outline-primary"
          ></textarea>
          {errors.description && (
            <span className="text-sm text-red-500">
              {errors.description?.message}
            </span>
          )}
        </div>

        <div className="flex w-full flex-col items-center justify-between gap-4">
          <div className="flex w-full gap-4">
            <button
              className="w-full rounded-md border border-primary p-2 text-primary"
              type="button"
              onClick={() => close("editeModal")}
            >
              Cancel
            </button>

            <button
              className="w-full rounded-md bg-primary p-2 text-white"
              type="submit"
            >
              Update
            </button>
          </div>

          <button
            className="w-20 rounded-md text-red-400 underline"
            onClick={() =>
              onDeleteNote({
                title: data.title,
                description: data.description,
                colorHex: data.colorHex,
                id: data._id,
              })
            }
          >
            Delete
          </button>
        </div>
      </div>
    </form>
  );
}
