import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@workspace/ui/components/field";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { WidgetHeader } from '../components/widget-header';
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { use } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { contactSessionIdAtomFamily, organizationIdAtom, screenAtom } from "../atoms/widget-atoms";

const widgetAuthSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
});

type WidgetAuthFormData = z.infer<typeof widgetAuthSchema>;

const WidgetAuthScreen = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WidgetAuthFormData>({
    resolver: zodResolver(widgetAuthSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });
  //const organizationId = "org_123"; // Replace with actual organization ID logic
  const setScreen = useSetAtom(screenAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const setContactSessionId = useSetAtom(contactSessionIdAtomFamily(organizationId || ""));
  const createContactSession = useMutation(api.private.contactSessions.createContactSession);

  const onSubmit = async (data: WidgetAuthFormData) => {
    console.log("Form submitted:", data);
    if(!organizationId) {
        return;
    }
    const metadata: Doc<"contactSessions">["metadata"] = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        languages: navigator.languages?.join(","),
        platform: navigator.platform,
        vendor: navigator.vendor,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: new Date().getTimezoneOffset(),
        cookieEnabled: navigator.cookieEnabled,
        referrer: document.referrer || "direct",
        currentUrl: window.location.href,
    };
    const contactSessionId = await createContactSession({
        ...data,
        organizationId,
        metadata,
    });
    // console.log({contactSessionId});
    setContactSessionId(contactSessionId);
    setScreen("selection");
  }

  return (
    <>
        <WidgetHeader>
            <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
            <p className="text-3xl">Hi there! 👋</p>
            <p className="text-lg">Let&apos;s get you started</p>
            </div>
        </WidgetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-y-4 p-4">
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="name">Enter your name</FieldLabel>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id="name"
                                className="h-10 bg-background"
                                type="text"
                                placeholder="e.g. John Doe"
                                {...register("name")}
                            />
                        )}
                    />
                    {errors.name && <FieldError>{errors.name.message}</FieldError>}
                </Field>
                <Field>
                    <FieldLabel htmlFor="email">Enter your email</FieldLabel>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id="email"
                                className="h-10 bg-background"
                                type="email"
                                placeholder="e.g. john.doe@example.com"
                                {...register("email")}
                            />
                        )}
                    />
                    {errors.email && <FieldError>{errors.email.message}</FieldError>}
                 </Field>
                <Field orientation="horizontal">
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? "Loading..." : "Continue"}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    </>
  )
}

export default WidgetAuthScreen