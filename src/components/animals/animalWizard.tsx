import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Section } from "../layouts/section";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { Loader } from "../ui/loader";

interface AnimalWizardProps {}

export const AnimalWizard: React.FC<AnimalWizardProps> = () => {
  const { data: sessionData } = useSession();

  if (!sessionData) {
    return <></>;
  }

  return (
    <Section className="flex flex-col gap-8">
      <h2>Add an animal</h2>

      <AddAnimalDialog />
    </Section>
  );
};

const animalFormSchema = z.object({
  name: z.string().min(2).max(50),
  type: z.union([z.literal("Cat"), z.literal("Dog"), z.literal("Monkey")]),
  location: z.string(),
  sex: z.string(),
  age: z.string(),
  size: z.string(),
  characteristics: z.string(),
  health: z.string(),
  color: z.string(),
  race: z.string(),
  imageUrls: z.object({ url: z.string().url() }).array(),
  description: z.string().max(1023),
});

interface AddAnimalDialogProps {}
const AddAnimalDialog: React.FC<AddAnimalDialogProps> = () => {
  const { data: sessionData } = useSession();
  const { mutate: mutateAddAnimal, isLoading } = api.animals.add.useMutation();
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleDialog() {
    setDialogOpen(!dialogOpen);
  }

  const ctx = api.useContext();

  const form = useForm<z.infer<typeof animalFormSchema>>({
    resolver: zodResolver(animalFormSchema),
    defaultValues: {
      name: "",
      type: undefined,
      location: undefined,
      sex: undefined,
      age: "",
      size: undefined,
      characteristics: "",
      health: "",
      color: "",
      race: "",
      imageUrls: [{ url: "" }],
      description: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "imageUrls",
  });

  if (!sessionData) {
    return <></>;
  }

  function onSubmit(values: z.infer<typeof animalFormSchema>) {
    mutateAddAnimal(
      {
        ...values,
        imageUrls: values.imageUrls.map((imageUrl) => imageUrl.url),
      },

      {
        onSuccess: () => {
          ctx.animals.invalidate();
          form.reset({
            name: "",
            type: undefined,
            location: undefined,
            sex: undefined,
            age: "",
            size: undefined,
            characteristics: "",
            health: "",
            color: "",
            race: "",
            imageUrls: [{ url: "" }],
            description: "",
          });
          handleDialog();
        },
        onError: (err) => {
          console.log(err);
        },
      }
    );
  }

  // TODO add loader thing
  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialog}>
      <DialogTrigger asChild>
        <Button>Add Animal</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <Loader isLoading={isLoading} />
        <DialogHeader>
          <DialogTitle>Add animal</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-8">
            <ScrollArea className="h-[60vh] pr-4">
              <section className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Lupo" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of animal</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="What species is your animal?" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem value="Cat">Cat</SelectItem>
                          <SelectItem value="Dog">Dog</SelectItem>
                          <SelectItem value="Monkey">Monkey</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Where is the animal currently?" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem value="Stockholm">Stockholm</SelectItem>
                          <SelectItem value="Gothenburg">Gothenburg</SelectItem>
                          <SelectItem value="Malmö">Malmö</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sex</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="What sex is you animal?" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="3" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="What is the size of your animal?" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem value="Small">Small</SelectItem>
                          <SelectItem value="Medium">Female</SelectItem>
                          <SelectItem value="Large">Large</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="characteristics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Characteristics</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Playful, fearful, curious, happy..."
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="health"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Health</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Healthy, but needs new shots"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Orange, black and white, brownish..."
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="race"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Breed</FormLabel>
                      <FormControl>
                        <Input placeholder="Husky" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Lupo is quite a happy dog. We adopted him as a rescue in greece..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <section className="space-y-4">
                {fields.map((field, index) => {
                  return (
                    <div
                      className="flex flex-row items-end gap-4"
                      key={field.id}
                    >
                      <FormField
                        control={form.control}
                        name={`imageUrls.${index}.url` as const}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Image url</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="www.cuteimage.se"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {index >= 1 && (
                        <Button
                          type="button"
                          onClick={() => {
                            remove(index);
                          }}
                        >
                          remove img
                        </Button>
                      )}
                    </div>
                  );
                })}

                <Button
                  type="button"
                  onClick={() => {
                    append({ url: "" });
                  }}
                >
                  Add img
                </Button>
              </section>
            </ScrollArea>
            <div className="flex flex-col space-y-8">
              <Button type="submit">Save animal</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
