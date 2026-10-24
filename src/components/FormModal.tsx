"use client";

import {
  deleteClass,
  deleteExam,
  deleteStudent,
  deleteSubject,
  deleteTeacher,
} from "@/lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";

type ActionState = { success: boolean; error: boolean };
type DeleteAction = (
  currentState: ActionState,
  data: FormData
) => Promise<ActionState>;

// Only tables that have a real delete action are listed here.
const deleteActionMap: { [key: string]: DeleteAction | undefined } = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  exam: deleteExam,
};

// USE LAZY LOADING
const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("./forms/ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ExamForm = dynamic(() => import("./forms/ExamForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any
  ) => React.JSX.Element;
} = {
  subject: (setOpen, type, data, relatedData) => (
    <SubjectForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  class: (setOpen, type, data, relatedData) => (
    <ClassForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  teacher: (setOpen, type, data, relatedData) => (
    <TeacherForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  student: (setOpen, type, data, relatedData) => (
    <StudentForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  exam: (setOpen, type, data, relatedData) => (
    <ExamForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
};

const DeleteForm = ({
  table,
  id,
  action,
  setOpen,
}: {
  table: string;
  id: number | string;
  action: DeleteAction;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [state, formAction] = useActionState(action, {
    success: false,
    error: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`${table} has been deleted!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, table, setOpen]);

  return (
    <form action={formAction} className="p-4 flex flex-col gap-4">
      <input type="hidden" name="id" value={id} />
      <span className="text-center font-medium">
        All data will be lost. Are you sure you want to delete this {table}?
      </span>
      {state.error && (
        <span role="alert" className="text-center text-sm text-red-500">
          Could not delete. It may still be linked to other records (for
          example lessons).
        </span>
      )}
      <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
        Delete
      </button>
    </form>
  );
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);

  const renderContent = () => {
    if (type === "delete") {
      const action = deleteActionMap[table];
      if (!action || id === undefined) {
        return (
          <p className="p-4 text-center">
            Deleting a {table} is not available yet.
          </p>
        );
      }
      return (
        <DeleteForm table={table} id={id} action={action} setOpen={setOpen} />
      );
    }

    const renderForm = forms[table];
    if (!renderForm) {
      return (
        <p className="p-4 text-center">
          The {type} form for {table} is not available yet.
        </p>
      );
    }
    return renderForm(setOpen, type, data, relatedData);
  };

  return (
    <>
      <button
        type="button"
        aria-label={`${type} ${table}`}
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open &&
        createPortal(
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div
              role="dialog"
              aria-modal="true"
              className="bg-white p-4 rounded-md relative w-full md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] max-h-[90vh] overflow-y-auto"
            >
              {renderContent()}
              <button
                type="button"
                aria-label="Close"
                className="absolute top-4 right-4 cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <Image src="/close.png" alt="" width={14} height={14} />
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default FormModal;