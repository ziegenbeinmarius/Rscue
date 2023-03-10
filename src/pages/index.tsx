import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { HiSelector, HiCheck } from "react-icons/hi";
import { signIn, signOut, useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { api } from "~/utils/api";
import { useForm, UseFormSetValue } from "react-hook-form";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Rscue</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="m-auto flex min-h-screen max-w-screen-lg flex-col items-center justify-center p-4">
        <Toaster position="bottom-center" />
        <h1 className="text-5xl font-bold text-white sm:text-[5rem]">Rscue</h1>
        <AnimalEntries />

        <AnimalForm />

        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p>
          <AuthShowcase />
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

interface AnimalEntriesProps {}
const AnimalEntries: React.FC<AnimalEntriesProps> = () => {
  const { data: sessionData } = useSession();
  const { data: animals, isLoading } = api.animal.getAll.useQuery();
  const utils = api.useContext();
  const deleteAnimal = api.animal.deleteAnimal.useMutation({
    onSettled: async () => {
      await utils.animal.getAll.invalidate();
    },
  });

  if (isLoading) return <div>Fetching animals...</div>;
  return (
    <div className="">
      <h2 className="text-2xl font-bold text-white ">Animals</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {animals?.map((animal) => (
          <div
            className="rounded-md bg-white p-4"
            key={animal.type + "-" + animal.name}
          >
            {sessionData && (
              <a
                className="relative top-0 right-0 h-16 w-16 cursor-pointer bg-red-500"
                onClick={() =>
                  deleteAnimal.mutate(animal.id, {
                    onSuccess: (res) => {
                      toast.success("Successfully removed animal");

                      // api.animal.getAll.useQuery().
                      // api.animal.getAll.useQuery().refetch();
                    },
                  })
                }
              >
                X
              </a>
            )}
            <h3 className="text-center text-xl font-semibold">{animal.name}</h3>
            <p>Type: {animal.type}</p>
            <p>Description: {animal.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

type AnimalFormValues = {
  name: string;
  description: string;
  type: AnimalType;
};

type AnimalType = "Dog" | "Cat" | "Bird";
interface AnimalFormProps {}
const AnimalForm: React.FC<AnimalFormProps> = () => {
  const utils = api.useContext();
  const { data: session, status } = useSession();
  const addAnimal = api.animal.addAnimal.useMutation({
    // onMutate: async (newAnimal) => {
    //   await utils.animal.getAll.cancel();
    //   utils.animal.getAll.setData(undefined, (prevAnimals) => {
    //     if (prevAnimals) {
    //       return [newAnimal, ...prevAnimals];
    //     } else {
    //       return [newAnimal];
    //     }
    //   });
    // },
    onSettled: async () => {
      await utils.animal.getAll.invalidate();
    },
  });

  const {
    reset,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AnimalFormValues>({ defaultValues: { type: "Dog" } });
  const onSubmit = (data: AnimalFormValues) => {
    console.log(data);
    addAnimal.mutate(
      {
        name: data.name,
        type: data.type,
        description: data.description,
      },
      {
        onSuccess: (res) => {
          toast.success("Successfully added animal");
          reset();
          // api.useContext().invalidate();
          // api.animal.getAll.useQuery().
          // api.animal.getAll.useQuery().refetch();
        },
      }
    );
  };
  if (status !== "authenticated") return null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-4 flex flex-col gap-2"
    >
      {/* register your input into the hook by invoking the "register" function */}
      <input
        placeholder="Animal name"
        className="rounded-md border border-purple-500 p-2"
        {...register("name", { required: true })}
      />
      {errors.name && <span>This field is required</span>}

      {/* include validation with required or other standard HTML validation rules */}
      <input
        className="rounded-md border border-purple-500 p-2"
        placeholder="Animal descriptiion"
        {...register("description", { required: true })}
      />
      {/* errors will return when field validation fails  */}
      {errors.description && <span>This field is required</span>}

      <AnimalTypeListbox
        selectedAnimalType={watch("type")}
        setSelectedAnimalType={setValue}
      />

      <input
        className="cursor-pointer rounded-md bg-purple-700 text-white hover:bg-purple-500"
        type="submit"
      />
    </form>
  );
};

interface AnimalTypeListboxProps {
  selectedAnimalType: AnimalType;
  setSelectedAnimalType: UseFormSetValue<AnimalFormValues>;
}

const AnimalTypeListbox: React.FC<AnimalTypeListboxProps> = ({
  selectedAnimalType,
  setSelectedAnimalType,
}) => {
  const animalTypes = ["Dog", "Cat", "Bird"];
  // const [selectedAnimalType, setSelectedAnimalType] = useState(animalTypes[0]);

  return (
    <div className="relative w-full">
      <Listbox
        value={selectedAnimalType}
        onChange={(value) => setSelectedAnimalType("type", value)}
      >
        <Listbox.Button className=" flex w-full flex-row items-center justify-between rounded-md bg-white p-2   shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          {selectedAnimalType}
          <HiSelector></HiSelector>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60  w-full overflow-auto rounded-md bg-white  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {animalTypes.map((animalType) => (
              <Listbox.Option
                key={animalType}
                value={animalType}
                className={({ active, selected }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-purple-400 " : "text-gray-900"
                  }
                  ${selected && "bg-purple-500"}`
                }
              >
                {({ selected }) => (
                  <div className="flex flex-row items-center">
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {animalType}
                    </span>
                    {selected ? <HiCheck className="ml-2" /> : null}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
};
