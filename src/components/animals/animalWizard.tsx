import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
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

interface AnimalWizardProps {}
const animalFormSchema = z.object({
  name: z.string().min(2).max(50),
  type: z.union([z.literal("Cat"), z.literal("Dog"), z.literal("Monkey")]),
  image: z.string().optional(),
  description: z.string().max(1023),
});
export const AnimalWizard: React.FC<AnimalWizardProps> = () => {
  const { data: sessionData } = useSession();
  const { mutate } = api.animals.add.useMutation();

  const ctx = api.useContext();
  const form = useForm<z.infer<typeof animalFormSchema>>({
    resolver: zodResolver(animalFormSchema),
    defaultValues: {
      name: "",
    },
  });

  if (!sessionData) {
    return <></>;
  }

  function onSubmit(values: z.infer<typeof animalFormSchema>) {
    mutate(values, {
      onSuccess: (res) => {
        ctx.animals.invalidate();
      },
    });
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
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image url</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  You can copy a image url in here which will be used for the
                  image
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
