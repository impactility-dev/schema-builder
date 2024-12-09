import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  schemaType: z.string().min(1, "Schema type is required"),
  version: z.string().min(1, "Version is required"),
  description: z.string().min(1, "Description is required"),
  credentialType: z.enum(["Merklized", "Non-merklized"]),
});

export default function Step1({
  setStep,
  setFormData,
}: Readonly<{
  setStep: (step: number) => void;
  setFormData: (data: z.infer<typeof formSchema>) => void;
}>) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      schemaType: "",
      version: "",
      description: "",
      credentialType: "Merklized",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    setFormData(values);
    setStep(2);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-right">Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Title"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="schemaType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-right">Schema type</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter schema type"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="version"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-right">Version</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter version"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-right">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="advanced-options">
            <AccordionTrigger>Advanced options</AccordionTrigger>
            <AccordionContent>
              {" "}
              <FormField
                control={form.control}
                name="credentialType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Credential type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Merklized" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Merklized
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Non-merklized" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Non-merklized
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button type="submit">Define attributes</Button>
      </form>
    </Form>
  );
}
