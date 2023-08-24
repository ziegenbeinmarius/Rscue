import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
  imageUrls: z.string().url().array(),
  description: z.string().max(1023),
});

interface AnimalWizardProps {}

export const AnimalWizard: React.FC<AnimalWizardProps> = () => {
  const { data: sessionData } = useSession();
  const { mutate: mutateAddAnimal } = api.animals.add.useMutation();

  const ctx = api.useContext();

  const [indexes, setIndexes] = useState<number[]>([]);
  const [counter, setCounter] = useState<number>(0);
  const form = useForm<z.infer<typeof animalFormSchema>>({
    resolver: zodResolver(animalFormSchema),
  });

  if (!sessionData) {
    return <></>;
  }

  function onSubmit(values: z.infer<typeof animalFormSchema>) {
    console.log(values);

    mutateAddAnimal(
      values,

      {
        onSuccess: () => {
          ctx.animals.invalidate();
        },
        onError: (err) => {
          console.log(err);
        },
      }
    );
  }

  return (
    <Section className="flex flex-col gap-8">
      <h2>Add an animal</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Animal name</FormLabel>
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
                <FormLabel>Animal type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a animal type" />
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
                <FormLabel>Animal location</FormLabel>
                <FormControl>
                  <Input placeholder="Stockholm" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Animal sex</FormLabel>
                <FormControl>
                  <Input placeholder="Male" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Animal age</FormLabel>
                <FormControl>
                  <Input placeholder="3" {...field} />
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
                <FormLabel>Animal size</FormLabel>
                <FormControl>
                  <Input placeholder="Large" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="characteristics"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Animal characteristics</FormLabel>
                <FormControl>
                  <Input placeholder="Playful" {...field} />
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
                <FormLabel>Animal health</FormLabel>
                <FormControl>
                  <Input placeholder="Healthy" {...field} />
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
                <FormLabel>Animal color</FormLabel>
                <FormControl>
                  <Input placeholder="Orange" {...field} />
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
                <FormLabel>Animal race</FormLabel>
                <FormControl>
                  <Input placeholder="Husky" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          {indexes.map((existingIndex, index) => {
            return (
              <div className="flex flex-row items-end gap-4">
                <FormField
                  key={`${existingIndex}_${index}`}
                  control={form.control}
                  name={`imageUrls.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Animal url</FormLabel>
                      <FormControl>
                        <Input placeholder="www.cute.se" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  onClick={() => {
                    setIndexes((prev) =>
                      prev.filter((savedIndex) => savedIndex !== existingIndex)
                    );
                  }}
                >
                  remove img
                </Button>
              </div>
            );
          })}
          <Button
            type="button"
            onClick={() => {
              setIndexes((prev) => [...prev, counter]);
              setCounter((prev) => prev + 1);
            }}
          >
            Add img
          </Button>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Animal description</FormLabel>
                <FormControl>
                  <Input placeholder="Lupo is a quite dog" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Save animal</Button>
        </form>
      </Form>
    </Section>
  );
};
