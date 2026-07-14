"use client";

import { z } from "zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { Switch } from "@/components/ui/switch";
import { updateHabit } from "@/actions/updateHabit";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(3),

  description: z.string().optional(),

  category: z.enum([
    "custom",
    "health",
    "fitness",
    "reading",
    "learning",
    "coding",
    "career",
    "finance",
    "mindfulness",
    "nutrition",
  ]),

  frequency: z.enum(["daily", "weekly", "monthly"]),

  targetDays: z.coerce.number().min(1).max(7),

  reminderTime: z.string().optional(),

  active: z.boolean(),
});

type HabitFormValues = z.infer<typeof formSchema>;

interface HabitFormProps {
  habitId: string;
  defaultValues?: HabitFormValues;
}

export default function HabitForm({ defaultValues, habitId }: HabitFormProps) {
  const [pending, startTransition] = useTransition();

  const form = useForm<HabitFormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: defaultValues ?? {
      title: "",

      description: "",

      category: "health",

      frequency: "daily",

      targetDays: 1,

      reminderTime: "",

      active: true,
    },
  });

  async function submit(values: HabitFormValues) {
    startTransition(async () => {
      const result = await updateHabit({
        id: habitId,
        ...values,
      });

      if (!result.success) {
        console.error(result.message);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Habit Details</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habit Name</FormLabel>

                  <FormControl>
                    <Input placeholder="Morning Exercise" {...field} />
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
                  <FormLabel>Description</FormLabel>

                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Describe your habit..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="health">Health</SelectItem>

                        <SelectItem value="fitness">Fitness</SelectItem>

                        <SelectItem value="learning">Learning</SelectItem>

                        <SelectItem value="reading">Reading</SelectItem>

                        <SelectItem value="coding">Coding</SelectItem>

                        <SelectItem value="career">Career</SelectItem>

                        <SelectItem value="finance">Finance</SelectItem>

                        <SelectItem value="mindfulness">Mindfulness</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>

                        <SelectItem value="weekly">Weekly</SelectItem>

                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="targetDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Days</FormLabel>

                    <FormControl>
                      <Input type="number" min={1} max={7} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reminderTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reminder</FormLabel>

                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel>Active Habit</FormLabel>

                    <p className="text-sm text-muted-foreground">
                      Enable or disable this habit.
                    </p>
                  </div>

                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Saving..." : "Save Habit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
